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
