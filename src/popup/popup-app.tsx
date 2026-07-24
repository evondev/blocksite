import { useState } from "react";
import type { ChangeEvent, SyntheticEvent } from "react";
import Button from "../shared/components/button";
import { normalizeAllowedUrl, normalizeDomain } from "../shared/utils";
import { DomainList } from "./components/domain-list";
import { ToggleSwitch } from "./components/toggle-switch";
import { useBlockConfig } from "./hooks/use-block-config";

export default function PopupApp() {
  const { config, isLoading, updateConfig } = useBlockConfig();
  const [inputs, setInputs] = useState({ domain: "", allowedUrl: "" });
  const [errors, setErrors] = useState({ domain: "", allowedUrl: "" });

  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    updateConfig({ username: event.target.value });
  }

  function handleToggle(isEnabled: boolean) {
    updateConfig({ isEnabled });
  }

  function handleSubmitDomain(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const domain = normalizeDomain(inputs.domain);

    if (!domain) {
      setErrors({ ...errors, domain: "Nhập domain hợp lệ, ví dụ facebook.com" });
      return;
    }
    if (config.blockedDomains.includes(domain)) {
      setErrors({ ...errors, domain: "Domain này đã có trong danh sách" });
      return;
    }

    updateConfig({ blockedDomains: [...config.blockedDomains, domain] });
    setInputs({ ...inputs, domain: "" });
    setErrors({ ...errors, domain: "" });
  }

  function handleSubmitAllowedUrl(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const allowedUrl = normalizeAllowedUrl(inputs.allowedUrl);

    if (!allowedUrl) {
      setErrors({
        ...errors,
        allowedUrl: "Dán URL đầy đủ, ví dụ facebook.com/messages",
      });
      return;
    }
    if (config.allowedUrls.includes(allowedUrl)) {
      setErrors({ ...errors, allowedUrl: "URL này đã có trong danh sách" });
      return;
    }

    updateConfig({ allowedUrls: [...config.allowedUrls, allowedUrl] });
    setInputs({ ...inputs, allowedUrl: "" });
    setErrors({ ...errors, allowedUrl: "" });
  }

  function handleRemoveDomain(domain: string) {
    updateConfig({
      blockedDomains: config.blockedDomains.filter((item) => item !== domain),
    });
  }

  function handleRemoveAllowedUrl(allowedUrl: string) {
    updateConfig({
      allowedUrls: config.allowedUrls.filter((item) => item !== allowedUrl),
    });
  }

  if (isLoading) {
    return <div className="w-80 p-4 text-sm text-gray-500">Đang tải...</div>;
  }

  return (
    <div className="flex w-80 flex-col gap-4 bg-white p-4 text-gray-900">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/shield.png" alt="BlockSite" className="h-6 w-6" />
          <h1 className="text-base font-semibold">BlockSite</h1>
        </div>
        <ToggleSwitch checked={config.isEnabled} onChange={handleToggle} />
      </header>

      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm font-medium text-gray-700">
          Tên của bạn
        </label>
        <input
          id="username"
          type="text"
          placeholder="Nhập tên hiển thị"
          value={config.username}
          onChange={handleUsernameChange}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <form onSubmit={handleSubmitDomain} className="flex flex-col gap-1">
        <label htmlFor="domain" className="text-sm font-medium text-gray-700">
          Thêm domain bị chặn
        </label>
        <div className="flex gap-2">
          <input
            id="domain"
            type="text"
            placeholder="facebook.com"
            value={inputs.domain}
            onChange={(event) =>
              setInputs({ ...inputs, domain: event.target.value })
            }
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <Button type="submit">Thêm</Button>
        </div>
        {errors.domain && <p className="text-xs text-red-500">{errors.domain}</p>}
      </form>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-gray-700">
          Danh sách bị chặn ({config.blockedDomains.length})
        </h2>
        <DomainList
          domains={config.blockedDomains}
          onRemove={handleRemoveDomain}
          emptyMessage="Chưa có domain nào bị chặn."
          removeLabelPrefix="Bỏ chặn"
        />
      </section>

      <hr className="border-gray-200" />

      <form onSubmit={handleSubmitAllowedUrl} className="flex flex-col gap-1">
        <label
          htmlFor="allowed-url"
          className="text-sm font-medium text-gray-700"
        >
          Thêm URL ngoại lệ
        </label>
        <div className="flex gap-2">
          <input
            id="allowed-url"
            type="text"
            placeholder="facebook.com/messages"
            value={inputs.allowedUrl}
            onChange={(event) =>
              setInputs({ ...inputs, allowedUrl: event.target.value })
            }
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <Button type="submit">Thêm</Button>
        </div>
        {errors.allowedUrl ? (
          <p className="text-xs text-red-500">{errors.allowedUrl}</p>
        ) : (
          <p className="text-xs text-gray-500">
            Khớp theo tiền tố — thêm <code>facebook.com/messages</code> là mở
            khoá mọi cuộc trò chuyện bên dưới.
          </p>
        )}
      </form>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-gray-700">
          Ngoại lệ không bị chặn ({config.allowedUrls.length})
        </h2>
        <DomainList
          domains={config.allowedUrls}
          onRemove={handleRemoveAllowedUrl}
          emptyMessage="Chưa có URL ngoại lệ nào."
          removeLabelPrefix="Xoá ngoại lệ"
        />
      </section>

      {!config.isEnabled && (
        <p className="rounded-md bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
          Đang TẮT — các domain trong danh sách hiện không bị chặn.
        </p>
      )}
    </div>
  );
}
