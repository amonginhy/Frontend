import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image as ImageIcon } from 'lucide-react';
import { Button, Input, Modal } from '@shared/ui';
import type { Product } from '@shared/types';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Add a brief description'),
  basePrice: z.coerce.number().min(1, 'Price must be > 0'),
  category: z.enum(['cake', 'cupcake', 'pastry', 'cookie', 'bread']),
  image: z.string().url('Use a valid image URL').or(z.literal('')),
  preparationHours: z.coerce.number().min(1).max(48),
  customizable: z.boolean(),
});

type Form = z.infer<typeof schema>;

interface Props {
  open: boolean;
  product?: Product | null;
  onClose: () => void;
  onSubmit: (values: Form) => void;
}

const defaultImage =
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80';

export function ProductFormModal({ open, product, onClose, onSubmit }: Props) {
  const isEdit = !!product;
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      basePrice: 200_000,
      category: 'cake',
      image: defaultImage,
      preparationHours: 6,
      customizable: true,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: product?.name ?? '',
        description: product?.description ?? '',
        basePrice: product?.basePrice ?? 200_000,
        category: (product?.category as Form['category']) ?? 'cake',
        image: product?.image ?? defaultImage,
        preparationHours: product?.preparationHours ?? 6,
        customizable: product?.customizable ?? true,
      });
    }
  }, [open, product, reset]);

  const submit = handleSubmit((values) => {
    onSubmit(values);
  });

  const previewUrl = watch('image') || defaultImage;

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit product' : 'Add product'} size="lg">
      <form onSubmit={submit} className="grid sm:grid-cols-[200px_1fr] gap-5">
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-cream-100 border border-cream-200">
            {previewUrl ? (
              <img src={previewUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full grid place-items-center text-ink-400">
                <ImageIcon size={28} />
              </div>
            )}
          </div>
          <Input
            label="Image URL"
            placeholder="https://…"
            {...register('image')}
            error={errors.image?.message}
          />
        </div>

        <div className="space-y-4">
          <Input
            label="Product name"
            placeholder="Midnight Chocolate Drip"
            {...register('name')}
            error={errors.name?.message}
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink-700">Description</span>
            <textarea
              rows={3}
              {...register('description')}
              className="rounded-2xl border border-cream-200 bg-white p-4 text-sm focus-ring resize-none"
            />
            {errors.description && (
              <span className="text-xs text-rose-500">{errors.description.message}</span>
            )}
          </label>
          <div className="grid sm:grid-cols-3 gap-3">
            <Input
              label="Price"
              type="number"
              step="1"
              {...register('basePrice')}
              error={errors.basePrice?.message}
            />
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink-700">Category</span>
              <select
                {...register('category')}
                className="h-12 px-4 rounded-2xl border border-cream-200 bg-white text-sm font-medium focus-ring"
              >
                <option value="cake">Cake</option>
                <option value="cupcake">Cupcake</option>
                <option value="pastry">Pastry</option>
                <option value="cookie">Cookie</option>
                <option value="bread">Bread</option>
              </select>
            </label>
            <Input
              label="Prep hours"
              type="number"
              {...register('preparationHours')}
              error={errors.preparationHours?.message}
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-accent-500" {...register('customizable')} />
            Customers can customize this product
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isEdit ? 'Save changes' : 'Add product'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
