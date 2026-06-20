import { useState } from "react";
import type { ChangeEvent, SyntheticEvent } from "react";
import Button from "../shared/components/button";
import { normalizeDomain } from "../shared/utils";
import { DomainList } from "./components/domain-list";
import { ToggleSwitch } from "./components/toggle-switch";
import { useBlockConfig } from "./hooks/use-block-config";

export default function PopupApp() {
  const { config, isLoading, updateConfig } = useBlockConfig();
  const [domainInput, setDomainInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    updateConfig({ username: event.target.value });
  }

  function handleToggle(isEnabled: boolean) {
    updateConfig({ isEnabled });
  }

  function handleAddDomain() {
    const domain = normalizeDomain(domainInput);

    if (!domain) {
      setErrorMessage("Nhập domain hợp lệ, ví dụ facebook.com");
      return;
    }
    if (config.blockedDomains.includes(domain)) {
      setErrorMessage("Domain này đã có trong danh sách");
      return;
    }

    updateConfig({ blockedDomains: [...config.blockedDomains, domain] });
    setDomainInput("");
    setErrorMessage("");
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    handleAddDomain();
  }

  function handleRemoveDomain(domain: string) {
    updateConfig({
      blockedDomains: config.blockedDomains.filter((item) => item !== domain),
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-1">
        <label htmlFor="domain" className="text-sm font-medium text-gray-700">
          Thêm domain bị chặn
        </label>
        <div className="flex gap-2">
          <input
            id="domain"
            type="text"
            placeholder="facebook.com"
            value={domainInput}
            onChange={(event) => setDomainInput(event.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <Button type="submit">Thêm</Button>
        </div>
        {errorMessage && (
          <p className="text-xs text-red-500">{errorMessage}</p>
        )}
      </form>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-gray-700">
          Danh sách bị chặn ({config.blockedDomains.length})
        </h2>
        <DomainList
          domains={config.blockedDomains}
          onRemove={handleRemoveDomain}
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
