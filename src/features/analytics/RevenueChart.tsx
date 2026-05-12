import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency, formatCurrencyCompact } from '@shared/utils/format';
import type { AnalyticsPoint } from '@shared/types';

interface RevenueChartProps {
  data: AnalyticsPoint[];
  height?: number;
  primaryName?: string;
  secondaryName?: string;
}

export function RevenueChart({
  data,
  height = 280,
  primaryName = 'Revenue',
  secondaryName = 'Last week',
}: RevenueChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="primary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F26B1F" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#F26B1F" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="secondary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5C1F22" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#5C1F22" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#F0E2C7" strokeDasharray="4 6" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#A39B8E"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            stroke="#A39B8E"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(v) => formatCurrencyCompact(v)}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #F0E2C7',
              boxShadow: '0 8px 24px rgba(63,21,23,0.08)',
              fontSize: 12,
            }}
            formatter={(v: number) => formatCurrency(v)}
          />
          <Area
            type="monotone"
            dataKey="secondary"
            name={secondaryName}
            stroke="#5C1F22"
            strokeWidth={2}
            strokeDasharray="4 4"
            fill="url(#secondary)"
          />
          <Area
            type="monotone"
            dataKey="value"
            name={primaryName}
            stroke="#F26B1F"
            strokeWidth={3}
            fill="url(#primary)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
