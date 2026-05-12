import { Filter } from 'lucide-react';
import { Button } from '@shared/ui';
import { dietaryOptions } from '@shared/services/mock-data';
import { useFiltersStore } from '@app/store/filters.store';
import { cn } from '@shared/utils/cn';
import { formatCurrency } from '@shared/utils/format';

const categories = [
  { id: 'cake', label: 'Cakes' },
  { id: 'cupcake', label: 'Cupcakes' },
  { id: 'pastry', label: 'Pastries' },
  { id: 'cookie', label: 'Cookies' },
  { id: 'bread', label: 'Breads' },
];

export function FilterSidebar() {
  const {
    category,
    setCategory,
    priceMax,
    setPriceMax,
    ratingMin,
    setRatingMin,
    dietary,
    toggleDietary,
    reset,
  } = useFiltersStore();

  return (
    <aside className="bg-white rounded-3xl border border-cream-100 shadow-soft p-5 lg:sticky lg:top-20 self-start">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-display text-lg font-semibold text-burgundy-700 flex items-center gap-2">
          <Filter size={16} /> Filters
        </h3>
        <button
          onClick={reset}
          className="text-xs text-accent-600 font-semibold hover:underline"
        >
          Reset
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-2">
            Category
          </p>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setCategory(null)}
              className={cn(
                'h-9 px-3 rounded-xl text-sm text-left transition-colors',
                !category
                  ? 'bg-burgundy-600 text-cream-50'
                  : 'hover:bg-cream-100 text-ink-700',
              )}
            >
              All Bakeries
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  'h-9 px-3 rounded-xl text-sm text-left transition-colors',
                  category === c.id
                    ? 'bg-burgundy-600 text-cream-50'
                    : 'hover:bg-cream-100 text-ink-700',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Price range
            </p>
            <span className="text-xs font-semibold text-burgundy-700">
              up to {formatCurrency(priceMax)}
            </span>
          </div>
          <input
            type="range"
            min={50_000}
            max={1_000_000}
            step={10_000}
            value={priceMax}
            onChange={(e) => setPriceMax(parseInt(e.target.value))}
            className="w-full accent-accent-500"
          />
          <div className="flex justify-between text-[10px] text-ink-400 mt-1">
            <span>UGX 50K</span>
            <span>UGX 1M+</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-2">
            Minimum rating
          </p>
          <div className="flex gap-2">
            {[0, 4, 4.5, 4.8].map((r) => (
              <button
                key={r}
                onClick={() => setRatingMin(r)}
                className={cn(
                  'flex-1 h-9 rounded-xl text-xs font-semibold border transition-colors',
                  ratingMin === r
                    ? 'bg-burgundy-600 text-cream-50 border-burgundy-600'
                    : 'border-cream-200 text-ink-700 hover:border-burgundy-300',
                )}
              >
                {r === 0 ? 'Any' : `${r}+`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-2">
            Dietary
          </p>
          <div className="flex flex-wrap gap-1.5">
            {dietaryOptions.map((d) => {
              const active = dietary.includes(d.id);
              return (
                <button
                  key={d.id}
                  onClick={() => toggleDietary(d.id)}
                  className={cn(
                    'h-8 px-3 rounded-full text-xs font-medium border transition-colors',
                    active
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'border-cream-200 text-ink-700 hover:border-burgundy-300',
                  )}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        <Button block size="md">
          Apply Filters
        </Button>
      </div>
    </aside>
  );
}
