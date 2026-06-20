import type { BlockConfig } from "../types/block-config";

export const STORAGE_KEY = "blockConfig";

export const DEFAULT_CONFIG: BlockConfig = {
  username: "",
  isEnabled: true,
  blockedDomains: [],
};
