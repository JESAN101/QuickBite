const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/**
 * Safely extract page & limit from query params.
 * Rejects NaN, negatives, zero and unreasonably large values.
 */
const parsePagination = (query = {}) => {
  const raw = parseInt(query.page, 10);
  const page = Number.isFinite(raw) && raw >= 1 ? raw : DEFAULT_PAGE;

  const rawLimit = parseInt(query.limit, 10);
  const limit =
    Number.isFinite(rawLimit) && rawLimit >= 1
      ? Math.min(rawLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Escape a user-supplied string so it is safe to use inside new RegExp(s, "i").
 */
const escapeRegex = (str) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = { parsePagination, escapeRegex };
