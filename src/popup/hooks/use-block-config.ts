import { useEffect, useState } from "react";
import { DEFAULT_CONFIG } from "../../shared/constants/storage";
import { getConfig, setConfig } from "../../shared/utils";
import type { BlockConfig } from "../../shared/types/block-config";

interface UseBlockConfigResult {
  config: BlockConfig;
  isLoading: boolean;
  updateConfig: (partial: Partial<BlockConfig>) => Promise<void>;
}

export function useBlockConfig(): UseBlockConfigResult {
  const [config, setConfigState] = useState<BlockConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getConfig().then((loaded) => {
      setConfigState(loaded);
      setIsLoading(false);
    });
  }, []);

  async function updateConfig(partial: Partial<BlockConfig>) {
    const next = { ...config, ...partial };

    setConfigState(next);
    await setConfig(next);
  }

  return { config, isLoading, updateConfig };
}
