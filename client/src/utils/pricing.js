export const FREE_DELIVERY_THRESHOLD = 1000;
export const DELIVERY_FEE = 100;

export const getDeliveryFee = (subtotal) =>
  subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
