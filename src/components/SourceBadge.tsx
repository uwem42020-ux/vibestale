type SourceBadgeProps = {
  name?: string;
  baseUrl?: string;
};

export default function SourceBadge({ name, baseUrl }: SourceBadgeProps) {
  if (!name) return null;

  const faviconUrl = baseUrl
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(baseUrl)}&sz=32`
    : null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-300">
      {faviconUrl && (
        <img src={faviconUrl} alt={name} className="w-4 h-4 rounded-sm" loading="lazy" />
      )}
      <span className="truncate max-w-[120px]">{name}</span>
    </span>
  );
}