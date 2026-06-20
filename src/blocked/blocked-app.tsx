import { useEffect, useState } from "react";
import { BACKGROUND_IMAGES } from "../shared/constants/backgrounds";
import { cn, getConfig, pickRandom } from "../shared/utils";

function getBlockedDomain(): string {
  const params = new URLSearchParams(window.location.search);

  return params.get("domain") ?? "trang này";
}

function resolveBackgroundUrl(): string | null {
  const file = pickRandom(BACKGROUND_IMAGES);

  if (!file) return null;

  if (typeof chrome !== "undefined" && chrome.runtime?.getURL) {
    return chrome.runtime.getURL(`backgrounds/${file}`);
  }

  return `/backgrounds/${file}`;
}

export default function BlockedApp() {
  const [blockedDomain] = useState(getBlockedDomain);
  const [backgroundUrl] = useState(resolveBackgroundUrl);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    getConfig().then((config) => setUsername(config.username));
  }, []);

  useEffect(() => {
    if (!backgroundUrl) return;

    const image = new Image();
    image.onload = () => setIsImageLoaded(true);
    image.src = backgroundUrl;
  }, [backgroundUrl]);

  const namePart = username ? ` ${username}` : "";

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-950 p-6">
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-out",
          isImageLoaded ? "opacity-100" : "opacity-0",
        )}
        style={
          backgroundUrl
            ? { backgroundImage: `url(${backgroundUrl})` }
            : undefined
        }
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      <div className="animate-blocked-in relative z-10 flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl border border-white/10 bg-black/40 p-10 text-center text-white shadow-2xl backdrop-blur-md sm:p-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
          <img src="/shield.png" alt="" className="h-4 w-4" />
          BlockSite
        </span>

        <p className="text-3xl font-bold leading-snug sm:text-4xl">
          Dừng lại <span className="text-rose-300">{namePart}</span>, đừng tốn
          thời gian vô bổ vào{" "}
          <span className="text-rose-300">{blockedDomain}</span> nữa
        </p>

        <p className="text-base leading-relaxed text-white/70">
          Hãy cân nhắc thật kỹ xem có cần thiết không(Đọc "Vào {blockedDomain}{" "}
          để làm gì 10 lần") trước khi truy cập vào{" "}
          <span className="font-semibold text-white/90">{blockedDomain}</span>{" "}
          nhé.
        </p>
      </div>
    </div>
  );
}
