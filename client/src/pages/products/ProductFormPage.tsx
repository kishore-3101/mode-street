import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  getAdminProductsApi,
  createProductApi,
  updateProductApi,
} from '../../api/products.js';
import { getCategoriesApi } from '../../api/categories.js';
import { uploadImagesApi } from '../../api/uploads.js';
import {
  Button,
  Input,
  Textarea,
  Select,
  Switch,
  PageHeader,
  ImageUploader,
  type ImageItem,
} from '../../components/ui/index.js';
import { getApiErrorMessage } from '../../lib/utils.js';

const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().trim().min(1, 'Size is required'),
  stock: z
    .number()
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),
});

const productSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required').max(200),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be at least 0'),
  category_id: z.string().min(1, 'Please select a category'),
  is_active: z.boolean(),
  variants: z
    .array(variantSchema)
    .min(1, 'At least one size variant is required')
    .refine(
      (items) => {
        const sizes = items.map((i) => i.size.toLowerCase().trim()).filter(Boolean);
        return new Set(sizes).size === sizes.length;
      },
      { message: 'Size variants must be unique (no duplicate sizes)' }
    ),
});

type ProductFormData = z.infer<typeof productSchema>;

const QUICK_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'Free size'];

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Categories Query
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesApi,
  });

  // If in edit mode, fetch products to find the target product
  const { data: adminProducts = [], isLoading: isLoadingProduct } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => getAdminProductsApi(),
    enabled: isEditMode,
  });

  const existingProduct = isEditMode
    ? adminProducts.find((p) => p.id === id)
    : undefined;

  // Images state
  const [images, setImages] = useState<ImageItem[]>([]);
  const [imagesDirty, setImagesDirty] = useState(false);

  // Form setup
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category_id: '',
      is_active: true,
      variants: [{ size: 'M', stock: 10 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  // Populate data when existingProduct loads
  useEffect(() => {
    if (existingProduct) {
      reset({
        name: existingProduct.name,
        description: existingProduct.description || '',
        price: existingProduct.price,
        category_id: existingProduct.category_id,
        is_active: existingProduct.is_active,
        variants:
          existingProduct.variants && existingProduct.variants.length > 0
            ? existingProduct.variants.map((v) => ({
                id: v.id,
                size: v.size,
                stock: v.stock,
              }))
            : [{ size: 'M', stock: 10 }],
      });

      if (existingProduct.images && existingProduct.images.length > 0) {
        // oxlint-disable-next-line react/set-state-in-effect
        setImages(
          existingProduct.images.map((img) => ({
            id: img.id,
            url: img.url,
            path: img.path,
          }))
        );
      }
    }
  }, [existingProduct, reset]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty || imagesDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, imagesDirty]);

  // Quick add size handler
  const handleQuickAddSize = (size: string) => {
    const currentSizes = fields.map((f) => f.size.toLowerCase().trim());
    if (currentSizes.includes(size.toLowerCase().trim())) {
      toast.info(`Size ${size} is already added`);
      return;
    }
    append({ size, stock: 10 });
  };

  // Submit Mutation
  const mutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      // Step 1: Upload any new images
      const finalImages: { url: string; path: string }[] = [];

      for (const img of images) {
        if (img.isNew && img.file) {
          const uploadRes = await uploadImagesApi([img.file]);
          const uploaded = uploadRes[0];
          if (uploaded) {
            finalImages.push({ url: uploaded.url, path: uploaded.path });
          }
        } else if (img.path) {
          finalImages.push({ url: img.url, path: img.path });
        }
      }

      // Step 2: Create or update product
      if (isEditMode && id) {
        return updateProductApi(id, {
          name: data.name,
          description: data.description || null,
          price: data.price,
          category_id: data.category_id,
          is_active: data.is_active,
          variants: data.variants.map((v) => ({ size: v.size, stock: v.stock })),
          images: finalImages,
        });
      } else {
        return createProductApi({
          name: data.name,
          description: data.description || null,
          price: data.price,
          category_id: data.category_id,
          is_active: data.is_active,
          variants: data.variants.map((v) => ({ size: v.size, stock: v.stock })),
          images: finalImages,
        });
      }
    },
    onSuccess: (resProduct) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(
        isEditMode
          ? `Product "${resProduct.name}" updated successfully`
          : `Product "${resProduct.name}" created successfully`
      );
      navigate('/admin/products');
    },
    onError: (err) => {
      const msg = getApiErrorMessage(
        err,
        isEditMode ? 'Failed to update product' : 'Failed to create product'
      );
      toast.error(msg);
    },
  });

  const onSubmit = (formData: ProductFormData) => {
    mutation.mutate(formData);
  };

  if (isEditMode && isLoadingProduct) {
    return (
      <div className="space-y-6">
        <PageHeader title="Loading product..." />
        <div className="p-8 text-center text-espresso/60 font-serif italic">
          Fetching product details...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header with Back button */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/products"
          className="p-2 text-espresso/70 hover:text-espresso hover:bg-sand/30 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <PageHeader
          title={isEditMode ? 'Edit Product' : 'Add New Product'}
          subtitle={
            isEditMode
              ? `Update details, photography and variants for "${existingProduct?.name || ''}"`
              : 'Add an apparel garment to your fashion catalog'
          }
          className="mb-0 pb-0 border-b-0"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Basic Info */}
        <section className="bg-cream-surface rounded-xl border border-sand/80 p-5 sm:p-6 shadow-2xs space-y-5 text-left">
          <div className="border-b border-sand/60 pb-3">
            <h2 className="font-serif text-xl font-semibold text-espresso">
              1. Basic Information
            </h2>
            <p className="text-xs text-espresso/70 mt-0.5">
              Garment title, category assignment, retail pricing and visibility
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="sm:col-span-2">
              <Input
                label="Product Name"
                placeholder="e.g. Linen Relaxed Fit Shirt"
                {...register('name')}
                error={errors.name?.message}
                required
              />
            </div>

            {/* Category Select */}
            <div>
              <Select
                label="Category"
                {...register('category_id')}
                error={errors.category_id?.message}
                required
                options={[
                  { value: '', label: 'Select a category' },
                  ...categories.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
            </div>

            {/* Price */}
            <div>
              <Input
                type="number"
                label="Price (INR ₹)"
                placeholder="2499"
                leftElement={<span className="font-bold text-espresso">₹</span>}
                {...register('price', { valueAsNumber: true })}
                error={errors.price?.message}
                required
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <Textarea
                label="Product Description"
                placeholder="Describe fabric, fit, styling tips, care instructions..."
                rows={3}
                {...register('description')}
                error={errors.description?.message}
              />
            </div>

            {/* Active Toggle Switch */}
            <div className="sm:col-span-2 pt-2 border-t border-sand/40">
              <Controller
                control={control}
                name="is_active"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    label="Active & Visible in Catalog"
                    description="When active, customers can browse and purchase this garment on the storefront"
                  />
                )}
              />
            </div>
          </div>
        </section>

        {/* Section 2: Images */}
        <section className="bg-cream-surface rounded-xl border border-sand/80 p-5 sm:p-6 shadow-2xs space-y-4 text-left">
          <div className="border-b border-sand/60 pb-3">
            <h2 className="font-serif text-xl font-semibold text-espresso">
              2. Photography & Imagery
            </h2>
            <p className="text-xs text-espresso/70 mt-0.5">
              Upload up to 5 high-resolution product photos. Drag to arrange; the first photo is the cover.
            </p>
          </div>

          <ImageUploader
            images={images}
            onChange={(newImgs) => {
              setImages(newImgs);
              setImagesDirty(true);
            }}
          />
        </section>

        {/* Section 3: Sizes & Stock Variants */}
        <section className="bg-cream-surface rounded-xl border border-sand/80 p-5 sm:p-6 shadow-2xs space-y-5 text-left">
          <div className="border-b border-sand/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif text-xl font-semibold text-espresso">
                3. Sizes & Stock Variants
              </h2>
              <p className="text-xs text-espresso/70 mt-0.5">
                Define the available sizes and real-time inventory count for each size.
              </p>
            </div>
          </div>

          {/* Quick-add chips */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-espresso/80">
              Quick Add Standard Sizes:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {QUICK_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleQuickAddSize(sz)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-md border border-sand bg-cream hover:border-camel hover:bg-sand/30 text-espresso transition-colors cursor-pointer select-none"
                >
                  + {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Variants validation error message */}
          {errors.variants?.message && (
            <div className="p-3 rounded-lg bg-danger-bg border border-[#E8C6C3] flex items-center gap-2 text-xs text-danger">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.variants.message}</span>
            </div>
          )}

          {/* Variants Table / Rows */}
          <div className="space-y-3">
            {fields.map((fieldItem, index) => (
              <div
                key={fieldItem.id}
                className="flex items-start gap-3 bg-cream/50 p-3 rounded-lg border border-sand/60"
              >
                <div className="flex-1">
                  <Input
                    placeholder="Size (e.g. S, M, 32, Free size)"
                    {...register(`variants.${index}.size`)}
                    error={errors.variants?.[index]?.size?.message}
                  />
                </div>

                <div className="w-32 sm:w-40">
                  <Input
                    type="number"
                    placeholder="Stock qty"
                    {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                    error={errors.variants?.[index]?.stock?.message}
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={fields.length <= 1}
                  onClick={() => remove(index)}
                  className="mt-1 text-danger hover:bg-danger-bg p-2 shrink-0"
                  aria-label="Remove variant"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add variant row button */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ size: '', stock: 0 })}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Custom Size Row
          </Button>
        </section>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-sand/60">
          <Link to="/admin/products">
            <Button type="button" variant="ghost" disabled={mutation.isPending}>
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={mutation.isPending || isSubmitting}
            className="shadow-sm min-w-[140px]"
          >
            {isEditMode ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
