import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BakeryCard,
  Chip,
  Container,
  EmptyState,
  ProductCard,
  Skeleton,
} from '@shared/ui';
import { FilterSidebar } from '@features/marketplace/FilterSidebar';
import { bakeryService, productService } from '@shared/services';
import { useFiltersStore, type SortKey } from '@app/store/filters.store';
import { useDebouncedValue } from '@shared/hooks/useDebouncedValue';

const categoryChips = [
  { id: null as string | null, label: 'All', emoji: '🍰' },
  { id: 'cake', label: 'Cakes', emoji: '🎂' },
  { id: 'cupcake', label: 'Cupcakes', emoji: '🧁' },
  { id: 'pastry', label: 'Pastries', emoji: '🥐' },
  { id: 'cookie', label: 'Cookies', emoji: '🍪' },
  { id: 'bread', label: 'Breads', emoji: '🥖' },
];

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_low', label: 'Price: Low → High' },
  { value: 'price_high', label: 'Price: High → Low' },
  { value: 'fastest', label: 'Fastest Delivery' },
];

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const {
    category,
    setCategory,
    search,
    setSearch,
    sort,
    setSort,
    priceMax,
    ratingMin,
    dietary,
  } = useFiltersStore();

  // Hydrate filters from URL on first mount
  useEffect(() => {
    const urlCategory = params.get('category');
    const urlSearch = params.get('q');
    const urlSort = params.get('sort') as SortKey | null;
    if (urlCategory) setCategory(urlCategory);
    if (urlSearch) setSearch(urlSearch);
    if (urlSort) setSort(urlSort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync filters → URL
  useEffect(() => {
    const next: Record<string, string> = {};
    if (category) next.category = category;
    if (search) next.q = search;
    if (sort && sort !== 'popular') next.sort = sort;
    setParams(next, { replace: true });
  }, [category, search, sort, setParams]);

  const debouncedSearch = useDebouncedValue(search, 250);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.list(),
  });
  const { data: bakeries } = useQuery({
    queryKey: ['bakeries'],
    queryFn: () => bakeryService.list(),
  });

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = [...products];
    if (category) list = list.filter((p) => p.category === category);
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    list = list.filter((p) => p.basePrice <= priceMax && p.rating >= ratingMin);
    switch (sort) {
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_low':
        list.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price_high':
        list.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'fastest':
        list.sort((a, b) => a.preparationHours - b.preparationHours);
        break;
      default:
        list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [products, category, debouncedSearch, sort, priceMax, ratingMin]);

  const activeFilterCount =
    (category ? 1 : 0) +
    (priceMax < 1_000_000 ? 1 : 0) +
    (ratingMin > 0 ? 1 : 0) +
    dietary.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-8">
        <div className="flex flex-col gap-2 mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Marketplace
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700">
            Discover bakeries near you
          </h1>
          <p className="text-ink-500">
            Browse curated cakes, pastries, and bakers — refine the way you bake.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 items-stretch mb-6">
          <div className="flex items-center gap-2 h-12 px-5 rounded-2xl bg-white border border-cream-200 flex-1 focus-within:border-accent-500 focus-within:ring-4 focus-within:ring-accent-500/20">
            <Search size={18} className="text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, flavor, or bakery"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink-300"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-ink-400 hover:text-burgundy-700"
                aria-label="Clear"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-12 px-4 rounded-2xl bg-white border border-cream-200 text-sm font-medium text-ink-700 focus-ring"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                Sort: {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden h-12 px-5 rounded-2xl bg-white border border-cream-200 inline-flex items-center justify-between gap-2 text-sm font-medium"
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal size={16} /> Filters
            </span>
            {activeFilterCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-500 text-white font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          {categoryChips.map((c) => (
            <Chip
              key={c.label}
              active={category === c.id}
              onClick={() => setCategory(c.id)}
              icon={<span>{c.emoji}</span>}
            >
              {c.label}
            </Chip>
          ))}
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          <div className="flex flex-col gap-8 min-w-0">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-display text-xl font-semibold text-burgundy-700">
                  All Bakeries
                </h2>
                <span className="text-sm text-ink-500">
                  {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
                </span>
              </div>
              {isLoading ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-80" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon={<Search size={20} />}
                  title="No matching cakes"
                  description="Try widening your filters or searching for a different flavor."
                />
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((p) => {
                    const bakery = bakeries?.find((b) => b.id === p.bakeryId);
                    return (
                      <ProductCard
                        key={p.id}
                        product={p}
                        bakeryName={bakery?.name}
                        onQuickAdd={() => navigate(`/product/${p.id}`)}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-display text-xl font-semibold text-burgundy-700 mb-4">
                Featured studios
              </h2>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {bakeries?.slice(0, 6).map((b) => (
                  <BakeryCard key={b.id} bakery={b} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </Container>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-burgundy-900/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-auto rounded-t-3xl bg-cream-50 p-4"
          >
            <FilterSidebar />
            <div className="mt-3">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full h-12 rounded-2xl bg-burgundy-600 text-cream-50 font-semibold"
              >
                See {filtered.length} results
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
