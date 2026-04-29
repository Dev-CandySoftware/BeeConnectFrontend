import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { type DistributionField, getDistributionData } from "../api/clients";
import { InlineAsyncStatus } from "./AsyncPageFeedback";
import { useCallback, useEffect, useState } from "react";
import { getSessionUserId } from "../auth/session";
import {
  type DistributionSlice,
} from "../api/parsers/entities/distribution";

const COLORS = [
  "#4472C4",
  "#ED7D31",
  "#A9D18E",
  "#7030A0",
  "#00B0F0",
  "#FF0000",
  "#FFC000",
  "#92D050",
  "#00B050",
  "#FF0000",
  "#0070C0",
  "#FF6600",
  "#7030A0",
  "#00B0F0",
  "#92D050",
  "#FF0000",
  "#0070C0",
];

type Slice = DistributionSlice;

const EMPTY_SLICES: Slice[] = [];

function StatCard({ field }: { field: DistributionField }) {
  const userId = getSessionUserId();
  const [data, setData] = useState<Slice[]>(EMPTY_SLICES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    if (userId == null) return;
    setIsLoading(true);
    setError("");
    const result = await getDistributionData(field, userId);
    if (!result.ok) {
      setError(result.error);
      setData(EMPTY_SLICES);
      setIsLoading(false);
      return;
    }
    setData(result.data);
    setIsLoading(false);
  }, [field, userId]);

  useEffect(() => {
    load();
  }, [load]);

  if (userId == null) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-amber-200 bg-amber-50/60 px-4 text-center text-sm text-amber-800">
        Graficele sunt disponibile după autentificare.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "450px" }}>
      <InlineAsyncStatus
        isLoading={isLoading}
        error={error}
        loadingLabel="Se încarcă graficul…"
        onRetry={load}
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </InlineAsyncStatus>
    </div>
  );
}
export default StatCard;
