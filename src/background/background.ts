import { STORAGE_KEY } from "../shared/constants/storage";
import { getConfig } from "../shared/utils/storage";
import type { BlockConfig } from "../shared/types/block-config";

// declarativeNetRequest rule id phải >= 1 và là số nguyên dương.
const RULE_ID_OFFSET = 1;

function buildRedirectUrl(domain: string): string {
  const blockedPage = chrome.runtime.getURL("blocked.html");

  return `${blockedPage}?domain=${encodeURIComponent(domain)}`;
}

function buildRules(config: BlockConfig): chrome.declarativeNetRequest.Rule[] {
  if (!config.isEnabled) return [];

  return config.blockedDomains.map((domain, index) => ({
    id: index + RULE_ID_OFFSET,
    priority: 1,
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
