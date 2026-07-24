import { STORAGE_KEY } from "../shared/constants/storage";
import { getConfig } from "../shared/utils/storage";
import type { BlockConfig } from "../shared/types/block-config";

// declarativeNetRequest rule id phải >= 1 và là số nguyên dương.
// Tách 2 dải id để rule chặn và rule ngoại lệ không đụng nhau.
const BLOCK_RULE_ID_OFFSET = 1;
const ALLOW_RULE_ID_OFFSET = 10_000;

// Rule ngoại lệ phải có priority cao hơn rule chặn thì mới thắng.
const BLOCK_RULE_PRIORITY = 1;
const ALLOW_RULE_PRIORITY = 2;

function buildRedirectUrl(domain: string): string {
  const blockedPage = chrome.runtime.getURL("blocked.html");

  return `${blockedPage}?domain=${encodeURIComponent(domain)}`;
}

function buildBlockRules(
  blockedDomains: string[],
): chrome.declarativeNetRequest.Rule[] {
  return blockedDomains.map((domain, index) => ({
    id: index + BLOCK_RULE_ID_OFFSET,
    priority: BLOCK_RULE_PRIORITY,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
      redirect: { url: buildRedirectUrl(domain) },
    },
    condition: {
      // "||domain^" khớp cả domain gốc lẫn subdomain (www, m, ...).
      urlFilter: `||${domain}^`,
      resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
    },
  }));
}

function buildAllowRules(
  allowedUrls: string[],
): chrome.declarativeNetRequest.Rule[] {
  return allowedUrls.map((allowedUrl, index) => ({
    id: index + ALLOW_RULE_ID_OFFSET,
    priority: ALLOW_RULE_PRIORITY,
    action: { type: chrome.declarativeNetRequest.RuleActionType.ALLOW },
    condition: {
      // Không có "^" ở cuối nên khớp theo tiền tố: URL dài hơn (query, path con)
      // vẫn được cho qua.
      urlFilter: `||${allowedUrl}`,
      isUrlFilterCaseSensitive: false,
      resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
    },
  }));
}

function buildRules(config: BlockConfig): chrome.declarativeNetRequest.Rule[] {
  if (!config.isEnabled) return [];

  return [
    ...buildBlockRules(config.blockedDomains),
    ...buildAllowRules(config.allowedUrls),
  ];
}

async function syncRules(): Promise<void> {
  const config = await getConfig();
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const existingRuleIds = existingRules.map((rule) => rule.id);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingRuleIds,
    addRules: buildRules(config),
  });
}

chrome.runtime.onInstalled.addListener(() => {
  void syncRules();
});

chrome.runtime.onStartup.addListener(() => {
  void syncRules();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes[STORAGE_KEY]) {
    void syncRules();
  }
});
