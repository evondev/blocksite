import type { ChangeEvent } from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.checked);
  }

  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={handleChange}
      />
      <div className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-green-500 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  );
}
