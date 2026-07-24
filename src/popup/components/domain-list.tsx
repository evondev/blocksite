import Button from "../../shared/components/button";

interface DomainListProps {
  domains: string[];
  onRemove: (domain: string) => void;
  emptyMessage: string;
  removeLabelPrefix: string;
}

export function DomainList({
  domains,
  onRemove,
  emptyMessage,
  removeLabelPrefix,
}: DomainListProps) {
  if (domains.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-400">{emptyMessage}</p>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {domains.map((domain) => (
        <li
          key={domain}
          className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2"
        >
          <span className="truncate text-sm text-gray-800">{domain}</span>
          <Button
            variant="ghost"
            aria-label={`${removeLabelPrefix} ${domain}`}
            onClick={() => onRemove(domain)}
          >
            ✕
          </Button>
        </li>
      ))}
    </ul>
  );
}
