export interface BlockConfig {
  username: string;
  isEnabled: boolean;
  blockedDomains: string[];
  // URL ngoại lệ dạng "domain/path" — khớp theo tiền tố nên
  // "facebook.com/messages" mở khoá mọi link con bên dưới.
  allowedUrls: string[];
}
