import { DEFAULT_CONFIG, STORAGE_KEY } from "../constants/storage";
import type { BlockConfig } from "../types/block-config";

// Khi chạy `npm run dev` trong tab trình duyệt thường, chrome.storage không tồn tại.
// Lúc đó fallback sang localStorage để xem/preview được UI. Bản extension thật vẫn
// dùng chrome.storage.local.
function hasChromeStorage(): boolean {
  return typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
}

export async function getConfig(): Promise<BlockConfig> {
  if (!hasChromeStorage()) {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as Partial<BlockConfig>) : {};

    return { ...DEFAULT_CONFIG, ...parsed };
  }

  const result = await chrome.storage.local.get(STORAGE_KEY);
  const stored = result[STORAGE_KEY] as Partial<BlockConfig> | undefined;

  return { ...DEFAULT_CONFIG, ...stored };
}

export async function setConfig(config: BlockConfig): Promise<void> {
  if (!hasChromeStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return;
  }

  await chrome.storage.local.set({ [STORAGE_KEY]: config });
}
