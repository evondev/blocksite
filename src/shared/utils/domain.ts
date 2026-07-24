// Chuẩn hoá input người dùng nhập về dạng domain thuần,
// ví dụ "https://www.facebook.com/abc" -> "facebook.com".
export function normalizeDomain(rawInput: string): string {
  let domain = rawInput.trim().toLowerCase();

  if (!domain) return "";

  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.replace(/^www\./, "");
  domain = domain.split("/")[0];
  domain = domain.split("?")[0];
  domain = domain.split("#")[0];

  return domain;
}

// Chuẩn hoá URL ngoại lệ về dạng "domain/path", giữ nguyên query vì query
// cũng nằm trong URL request. Ví dụ
// "https://www.facebook.com/messages/e2ee/t/123" -> "facebook.com/messages/e2ee/t/123".
export function normalizeAllowedUrl(rawInput: string): string {
  let allowedUrl = rawInput.trim().toLowerCase();

  if (!allowedUrl) return "";

  allowedUrl = allowedUrl.replace(/^https?:\/\//, "");
  allowedUrl = allowedUrl.replace(/^www\./, "");
  // Fragment không được gửi kèm request nên bỏ đi.
  allowedUrl = allowedUrl.split("#")[0];
  allowedUrl = allowedUrl.replace(/\/+$/, "");

  const domain = allowedUrl.split("/")[0];

  if (!domain.includes(".")) return "";

  return allowedUrl;
}
