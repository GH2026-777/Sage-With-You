import { PILLAR_LABELS } from "../../../lib/badge";

type Props = {
  scores: Record<string, number | null> | null | undefined;
};

export function PillarScorecard({ scores }: Props) {
  const entries = Object.entries(PILLAR_LABELS);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {entries.map(([key, label]) => {
        const score = scores?.[key];
        return (
          <div
            key={key}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
          >
            <span className="text-sm text-gray-700">{label}</span>
            <span className="text-sm font-semibold text-sage-800">
              {score == null ? "N/A" : `${score} / 5`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
