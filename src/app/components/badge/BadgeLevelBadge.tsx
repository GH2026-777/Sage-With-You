import { LEVEL_DISPLAY, type BadgeLevel } from "../../../lib/badge";

type Props = {
  level: BadgeLevel | null | undefined;
  size?: "sm" | "md";
};

export function BadgeLevelBadge({ level, size = "md" }: Props) {
  if (!level) {
    return (
      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
        Not yet assessed
      </span>
    );
  }

  const meta = LEVEL_DISPLAY[level];
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span className={`inline-flex rounded-full font-medium ${sizeClass} ${meta.className}`}>
      {meta.label}
    </span>
  );
}
