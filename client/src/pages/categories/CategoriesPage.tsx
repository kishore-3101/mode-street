import { useState, useRef, type ChangeEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Layers, UploadCloud, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from '../../api/categories.js';
import { uploadImagesApi } from '../../api/uploads.js';
import {
  Button,
  Input,
  Modal,
  ConfirmDialog,
  PageHeader,
  EmptyState,
  Skeleton,
} from '../../components/ui/index.js';
import { getApiErrorMessage } from '../../lib/utils.js';
import type { Category } from '../../types/index.js';

export function CategoriesPage() {
  const queryClient = useQueryClient();

  // Queries
  const { data: categories = [], isLoading, isError, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesApi,
  });

  // Modal & Dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setImageUrl(null);
    setImagePath(null);
    setSelectedFile(null);
    setFilePreview(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setImageUrl(category.image_url);
    setImagePath(category.image_path);
    setSelectedFile(null);
    setFilePreview(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }

    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }

    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    setImageUrl(null);
    setImagePath(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      let finalUrl = imageUrl;
      let finalPath = imagePath;

      if (selectedFile) {
        const uploadResult = await uploadImagesApi([selectedFile]);
        const first = uploadResult[0];
        if (first) {
          finalUrl = first.url;
          finalPath = first.path;
        }
      }

      return createCategoryApi({
        name: name.trim(),
        image_url: finalUrl,
        image_path: finalPath,
      });
    },
    onSuccess: (newCat) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(`Category "${newCat.name}" created successfully`);
      handleCloseModal();
    },
    onError: (err) => {
      const msg = getApiErrorMessage(err, 'Failed to create category');
      setFormError(msg);
      toast.error(msg);
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editingCategory) return;

      let finalUrl = imageUrl;
      let finalPath = imagePath;

      if (selectedFile) {
        const uploadResult = await uploadImagesApi([selectedFile]);
        const first = uploadResult[0];
        if (first) {
          finalUrl = first.url;
          finalPath = first.path;
        }
      }

      return updateCategoryApi(editingCategory.id, {
        name: name.trim(),
        image_url: finalUrl,
        image_path: finalPath,
      });
    },
    onSuccess: (updatedCat) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(`Category "${updatedCat?.name}" updated successfully`);
      handleCloseModal();
    },
    onError: (err) => {
      const msg = getApiErrorMessage(err, 'Failed to update category');
      setFormError(msg);
      toast.error(msg);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategoryApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
      setDeletingCategory(null);
    },
    onError: (err) => {
      const msg = getApiErrorMessage(err, 'Failed to delete category');
      toast.error(msg);
      setDeletingCategory(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Category name is required');
      return;
    }
    setFormError(null);

    if (editingCategory) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const currentPreview = filePreview || imageUrl;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Categories"
        subtitle="Organize garments into collections and departments"
        action={
          <Button onClick={handleOpenCreate} className="gap-2 shadow-xs">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        }
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-cream-surface p-4 rounded-xl border border-sand/60 space-y-3">
              <Skeleton className="h-36 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && isError && (
        <div className="p-4 rounded-xl bg-danger-bg border border-[#E8C6C3] text-danger text-sm">
          Failed to load categories: {getApiErrorMessage(error)}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && categories.length === 0 && (
        <EmptyState
          icon={<Layers className="w-10 h-10 text-camel stroke-[1.5]" />}
          title="No categories yet"
          description="Create categories like Tops, Outerwear, or Dresses to categorize your apparel catalog."
          action={
            <Button onClick={handleOpenCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              Create First Category
            </Button>
          }
        />
      )}

      {/* Category Grid */}
      {!isLoading && !isError && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-cream-surface rounded-xl border border-sand/70 overflow-hidden shadow-2xs flex flex-col justify-between transition-all duration-150 hover:shadow-xs hover:border-camel"
            >
              <div>
                {/* Image Banner */}
                <div className="relative aspect-4/3 w-full bg-sand/20 overflow-hidden border-b border-sand/40">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover object-center transition-transform duration-200 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-espresso/40">
                      <Layers className="w-8 h-8 stroke-[1.2]" />
                      <span className="text-xs mt-1 italic font-serif">No cover image</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 text-left">
                  <h3 className="font-serif text-lg font-semibold text-espresso">
                    {category.name}
                  </h3>
                  <p className="text-xs font-mono text-espresso/60 mt-0.5">
                    /{category.slug}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-cream/40 border-t border-sand/40 flex items-center justify-end gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(category)}
                  className="gap-1.5 text-xs text-espresso/80 hover:text-espresso"
                >
                  <Edit2 className="w-3.5 h-3.5 text-camel" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingCategory(category)}
                  className="gap-1.5 text-xs text-danger hover:bg-danger-bg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        description={
          editingCategory
            ? 'Update category name or replace the visual banner'
            : 'Enter collection name and optionally attach an image banner'
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-danger-bg border border-[#E8C6C3] flex items-center gap-2 text-xs text-danger">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <Input
            label="Category Name"
            placeholder="e.g. Summer Essentials"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          {/* Optional Category Banner Upload */}
          <div className="text-left space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-espresso/80">
              Banner Image (Optional)
            </label>

            {currentPreview ? (
              <div className="relative aspect-16/9 rounded-lg overflow-hidden border border-sand bg-sand/20">
                <img
                  src={currentPreview}
                  alt="Category preview"
                  className="w-full h-full object-cover object-center"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  aria-label="Remove image"
                  className="absolute top-2 right-2 p-1.5 bg-espresso/80 text-cream rounded-full hover:bg-danger transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-sand rounded-lg bg-cream/30 hover:bg-cream/60 hover:border-camel cursor-pointer transition-colors"
              >
                <UploadCloud className="w-6 h-6 text-camel mb-1.5" />
                <span className="text-xs font-medium text-espresso">
                  Click to choose banner image
                </span>
                <span className="text-[11px] text-espresso/60 mt-0.5">
                  PNG, JPG, WebP up to 5MB
                </span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-sand/40">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={() => {
          if (deletingCategory) {
            deleteMutation.mutate(deletingCategory.id);
          }
        }}
        title="Delete Category"
        description={`Are you sure you want to delete "${deletingCategory?.name}"? If this category contains active products, deletion will be prevented.`}
        confirmLabel="Delete Category"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
