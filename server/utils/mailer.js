const Order = require("../models/Order");

// =============================================
// Mailer via Brevo (Sendinblue) HTTP API
// Uses the transactional email endpoint:
//   POST https://api.brevo.com/v3/smtp/email
// Emails are "fire and forget" — failures are
// logged but never block the order flow.
// If BREVO_API_KEY is not configured, emails
// are silently skipped (dev convenience).
// =============================================

const BREVO_API_URL =
  "https://api.brevo.com/v3/smtp/email";

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));

// Raw HTTP call — the transport layer used by every email
const sendBrevoEmail = async ({
  to,
  subject,
  html,
  toName,
}) => {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.log(
      `[mailer] skipped "${subject}" -> ${to} (BREVO_API_KEY not configured)`
    );
    return;
  }

  const senderName =
    process.env.BREVO_SENDER_NAME || "QuickBite";
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL ||
    "no-reply@quickbite.app";

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: toName
        ? [{ email: to, name: toName }]
        : [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Brevo send failed (${response.status}): ${errorBody}`
    );
  }

  return response.json();
};

const sendMail = sendBrevoEmail;

// =============================================
// Helpers
// =============================================

const loadOrderForEmail = (orderId) =>
  Order.findById(orderId)
    .populate("user", "name email")
    .populate("restaurant", "name")
    .populate("foods.food", "name price");

const statusColor = (status) => {
  const colors = {
    Pending: "#946022",
    Preparing: "#B03A24",
    "Out for Delivery": "#2C5670",
    Delivered: "#2F522F",
    Cancelled: "#1D1512",
  };

  return colors[status] || "#3A2A20";
};

const orderItemsRows = (order) =>
  order.foods
    .map((item) => {
      const food = item.food || {};
      const name = food.name || "Item";
      const unit = food.price || 0;
      const lineTotal = unit * item.quantity;

      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #EADFC8;color:#3A2A20;font-size:14px;">
            <strong>${escapeHtml(name)}</strong>
            <div style="font-size:12px;color:#3A2A20;opacity:.7;">Qty: ${item.quantity} × Rs. ${unit}</div>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #EADFC8;color:#3A2A20;font-size:14px;text-align:right;white-space:nowrap;">
            Rs. ${lineTotal}
          </td>
        </tr>`;
    })
    .join("");

const baseLayout = ({ title, body }) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background:#FFFBF3;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFBF3;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border:1px solid #EADFC8;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#1D1512;padding:24px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <span style="display:inline-block;width:34px;height:34px;line-height:34px;text-align:center;background:#F0A438;border-radius:50%;color:#1D1512;font-weight:bold;font-size:14px;">QB</span>
                      <span style="color:#F7ECD9;font-size:20px;font-weight:bold;margin-left:8px;">QuickBite</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 8px;font-size:22px;color:#1D1512;">${title}</h1>
                ${body}
              </td>
            </tr>
            <tr>
              <td style="background:#F7ECD9;padding:16px 32px;color:#3A2A20;font-size:12px;text-align:center;">
                Craving something? Your next order is just a tap away.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const orderSummaryHtml = (order, statusText) => {
  const restaurantName = order.restaurant?.name || "the restaurant";

  return `
    <p style="margin:16px 0 24px;color:#3A2A20;font-size:14px;line-height:1.6;">
      ${
        statusText
          ? `Your QuickBite order has been updated to <strong style="color:${statusColor(
              order.orderStatus
            )};">${escapeHtml(
              order.orderStatus
            )}</strong>.`
          : `Thanks for ordering from <strong>${escapeHtml(
              restaurantName
            )}</strong>. We've received your order and the kitchen is on it!`
      }
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #EADFC8;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="background:#1D1512;color:#F7ECD9;padding:12px 16px;font-size:13px;font-weight:bold;letter-spacing:1px;">
          ORDER #${escapeHtml(order._id)}
        </td>
        <td style="background:#1D1512;color:#F7ECD9;padding:12px 16px;font-size:13px;font-weight:bold;text-align:right;">
          ${escapeHtml(order.orderStatus)}
        </td>
      </tr>
      ${orderItemsRows(order)}
      ${
        order.discount > 0
          ? `<tr>
              <td style="padding:10px 12px;color:#3A2A20;font-size:14px;">Coupon discount</td>
              <td style="padding:10px 12px;color:#2F522F;font-size:14px;text-align:right;">- Rs. ${order.discount}</td>
            </tr>`
          : ""
      }
      <tr>
        <td style="padding:12px 16px;background:#F7ECD9;color:#1D1512;font-size:15px;font-weight:bold;">Total</td>
        <td style="padding:12px 16px;background:#F7ECD9;color:#D64933;font-size:18px;font-weight:bold;text-align:right;">Rs. ${order.totalPrice}</td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;font-size:13px;color:#3A2A20;line-height:1.8;">
      <tr>
        <td style="padding:4px 0;"><strong>Delivery to:</strong></td>
        <td style="padding:4px 0;text-align:right;">${escapeHtml(
          order.deliveryAddress
        )}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;"><strong>Payment:</strong></td>
        <td style="padding:4px 0;text-align:right;">${escapeHtml(
          order.paymentMethod
        )} · ${escapeHtml(order.paymentStatus)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;"><strong>Placed on:</strong></td>
        <td style="padding:4px 0;text-align:right;">${new Date(
          order.createdAt
        ).toLocaleString()}</td>
      </tr>
    </table>
  `;
};

// =============================================
// Public helpers
// =============================================

// Email sent to the customer right after placing an order
const sendOrderPlacedEmail = async (orderId) => {
  const order = await loadOrderForEmail(orderId);

  if (!order || !order.user?.email) return;

  const html = baseLayout({
    title: "Your order is confirmed 🎉",
    body: orderSummaryHtml(order, false),
  });

  await sendMail({
    to: order.user.email,
    toName: order.user.name,
    subject: `Order confirmed — QuickBite #${order._id}`,
    html,
  });
};

// Email sent to the customer whenever an order's status changes
const sendOrderStatusEmail = async (orderId) => {
  const order = await loadOrderForEmail(orderId);

  if (!order || !order.user?.email) return;

  const html = baseLayout({
    title: "Your order has been updated",
    body: orderSummaryHtml(order, true),
  });

  await sendMail({
    to: order.user.email,
    toName: order.user.name,
    subject: `Order ${order.orderStatus} — QuickBite #${order._id}`,
    html,
  });
};

module.exports = {
  sendMail,
  sendOrderPlacedEmail,
  sendOrderStatusEmail,
};
