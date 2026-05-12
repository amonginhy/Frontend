import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { AnalyticsPoint } from '@shared/types';

const COLORS = ['#5C1F22', '#F26B1F', '#B86060', '#E5D0A6', '#3F1517'];

export function CategoryDonut({ data }: { data: AnalyticsPoint[] }) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  return (
    <div className="relative w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={92}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #F0E2C7',
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">
            Total orders
          </p>
          <p className="text-display text-2xl font-semibold text-burgundy-700">
            {total.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
