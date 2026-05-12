import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Badge, Button, EmptyState, Skeleton, Toggle } from '@shared/ui';
import { productService } from '@shared/services';
import { formatCurrency } from '@shared/utils/format';
import { toast } from '@app/store/toast.store';
import { ProductFormModal } from '@features/vendor/ProductFormModal';
import type { Product } from '@shared/types';

export default function VendorProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.list(),
  });

  const [items, setItems] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [stock, setStock] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (data) {
      setItems(data);
      setStock((prev) => {
        const next = { ...prev };
        data.forEach((p, i) => {
          if (next[p.id] === undefined) next[p.id] = i % 3 !== 0;
        });
        return next;
      });
    }
  }, [data]);

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [items, search]);

  const handleSubmit = (values: {
    name: string;
    description: string;
    basePrice: number;
    category: Product['category'];
    image: string;
    preparationHours: number;
    customizable: boolean;
  }) => {
    if (editing) {
      setItems((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                ...values,
                image: values.image || p.image,
              }
            : p,
        ),
      );
      toast.success('Product updated', values.name);
    } else {
      const newProduct: Product = {
        id: `p_${Date.now()}`,
        bakeryId: 'b1',
        name: values.name,
        description: values.description,
        basePrice: values.basePrice,
        image: values.image,
        rating: 5.0,
        reviews: 0,
        category: values.category,
        tags: ['new'],
        preparationHours: values.preparationHours,
        customizable: values.customizable,
      };
      setItems((prev) => [newProduct, ...prev]);
      setStock((prev) => ({ ...prev, [newProduct.id]: true }));
      toast.success('Product added', values.name);
    }
    setOpenModal(false);
    setEditing(null);
  };

  const handleDelete = (p: Product) => {
    setItems((prev) => prev.filter((x) => x.id !== p.id));
    toast.info('Product removed', p.name);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Catalog
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Products & inventory
          </h1>
          <p className="text-ink-500 mt-1">
            Manage your menu, pricing, and live availability.
          </p>
        </div>
        <Button
          variant="dark"
          leftIcon={<Plus size={16} />}
          onClick={() => {
            setEditing(null);
            setOpenModal(true);
          }}
        >
          Add product
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-cream-100 shadow-soft p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 h-10 px-3 rounded-full bg-cream-100 flex-1 min-w-64">
          <Search size={14} className="text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog…"
            className="bg-transparent outline-none text-sm w-full placeholder:text-ink-400"
          />
        </div>
        <Badge tone="cream">{filtered.length} items</Badge>
      </div>

      <div className="bg-white rounded-3xl border border-cream-100 shadow-soft overflow-hidden">
        {isLoading ? (
          <Skeleton className="h-80" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={20} />}
            title="No products match"
            description="Try a different search or add your first product."
            action={
              <Button onClick={() => setOpenModal(true)} leftIcon={<Plus size={14} />}>
                Add product
              </Button>
            }
          />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-cream-100">
              <tr className="text-xs uppercase tracking-wider text-ink-500">
                <th className="text-left font-semibold py-3 px-5">Product</th>
                <th className="text-left font-semibold py-3 px-5">Category</th>
                <th className="text-left font-semibold py-3 px-5">Available</th>
                <th className="text-right font-semibold py-3 px-5">Price</th>
                <th className="text-right font-semibold py-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-cream-50">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt=""
                        className="h-12 w-12 rounded-2xl object-cover"
                      />
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-ink-400 line-clamp-1 max-w-xs">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5 capitalize">{p.category}</td>
                  <td className="py-3 px-5">
                    <Toggle
                      checked={stock[p.id] ?? true}
                      onChange={(v) => {
                        setStock((prev) => ({ ...prev, [p.id]: v }));
                        toast.info(v ? 'Now available' : 'Out of stock', p.name);
                      }}
                    />
                  </td>
                  <td className="py-3 px-5 text-right font-semibold tabular-nums">
                    {formatCurrency(p.basePrice)}
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditing(p);
                          setOpenModal(true);
                        }}
                        className="h-9 w-9 grid place-items-center rounded-full text-ink-500 hover:bg-cream-100"
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="h-9 w-9 grid place-items-center rounded-full text-rose-500 hover:bg-rose-50"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ProductFormModal
        open={openModal}
        product={editing}
        onClose={() => {
          setOpenModal(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
    </motion.div>
  );
}
