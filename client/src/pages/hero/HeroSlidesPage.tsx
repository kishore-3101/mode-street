import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  UploadCloud,
  X,
  ExternalLink,
  Sliders,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getAdminHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
} from '../../api/heroSlides.js';
import {
  Button,
  Input,
  Modal,
  ConfirmDialog,
  PageHeader,
  Badge,
  EmptyState,
  Skeleton,
  Switch,
} from '../../components/ui/index.js';
import { getApiErrorMessage } from '../../lib/utils.js';
import type { HeroSlide } from '../../types/index.js';

const MAX_SLIDES = 5;

export function HeroSlidesPage() {
  const queryClient = useQueryClient();

  // Queries
  const { data: slides = [], isLoading, isError, error } = useQuery({
    queryKey: ['adminHeroSlides'],
    queryFn: getAdminHeroSlides,
  });

  // Modal & Dialog state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [deletingSlide, setDeletingSlide] = useState<HeroSlide | null>(null);

  // Form state
  const [altText, setAltText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Invalidate queries helper
  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['adminHeroSlides'] });
    queryClient.invalidateQueries({ queryKey: ['storefrontHeroSlides'] });
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    if (slides.length >= MAX_SLIDES) {
      toast.error(`Maximum ${MAX_SLIDES} slides reached`);
      return;
    }
    setEditingSlide(null);
    setAltText('');
    setLinkUrl('');
    setIsActive(true);
    setSelectedFile(null);
    setFilePreview(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setAltText(slide.alt_text ?? '');
    setLinkUrl(slide.link_url ?? '');
    setIsActive(slide.is_active);
    setSelectedFile(null);
    setFilePreview(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFormError('Only JPEG, PNG, or WebP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size exceeds 5MB limit.');
      return;
    }

    setFormError(null);
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  // Drag and drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFormError('Only JPEG, PNG, or WebP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size exceeds 5MB limit.');
      return;
    }

    setFormError(null);
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleRemoveSelectedFile = () => {
    if (filePreview && !filePreview.startsWith('http')) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) {
        throw new Error('Please select an image file to upload.');
      }
      const formData = new FormData();
      formData.append('image', selectedFile);
      if (altText.trim()) formData.append('alt_text', altText.trim());
      if (linkUrl.trim()) formData.append('link_url', linkUrl.trim());
      formData.append('is_active', String(isActive));
      return createHeroSlide(formData);
    },
    onSuccess: () => {
      invalidateQueries();
      toast.success('Hero slide created successfully');
      setIsModalOpen(false);
    },
    onError: (err) => {
      const msg = getApiErrorMessage(err);
      setFormError(msg);
      toast.error(msg);
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editingSlide) return;
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      formData.append('alt_text', altText.trim());
      formData.append('link_url', linkUrl.trim());
      formData.append('is_active', String(isActive));
      return updateHeroSlide(editingSlide.id, formData);
    },
    onSuccess: () => {
      invalidateQueries();
      toast.success('Hero slide updated successfully');
      setIsModalOpen(false);
    },
    onError: (err) => {
      const msg = getApiErrorMessage(err);
      setFormError(msg);
      toast.error(msg);
    },
  });

  // Toggle Active Mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: boolean }) => {
      return updateHeroSlide(id, { is_active: newStatus });
    },
    onSuccess: () => {
      invalidateQueries();
      toast.success('Slide status updated');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteHeroSlide(id);
    },
    onSuccess: () => {
      invalidateQueries();
      toast.success('Hero slide deleted successfully');
      setDeletingSlide(null);
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  // Reorder Mutation
  const reorderMutation = useMutation({
    mutationFn: async (newOrderIds: string[]) => {
      return reorderHeroSlides(newOrderIds);
    },
    onSuccess: () => {
      invalidateQueries();
      toast.success('Slides reordered successfully');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    const newOrderIds = newSlides.map((s) => s.id);
    reorderMutation.mutate(newOrderIds);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (editingSlide) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isLimitReached = slides.length >= MAX_SLIDES;

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Hero Slideshow"
        subtitle="Curate up to 5 full-bleed photographic slides for the storefront homepage."
        action={
          <div className="flex items-center gap-3">
            {isLimitReached && (
              <span className="hidden sm:inline-block text-xs text-camel font-medium px-2.5 py-1 rounded bg-sand/30 border border-sand">
                Max 5 slides reached
              </span>
            )}
            <Button
              type="button"
              variant="primary"
              onClick={handleOpenCreate}
              disabled={isLimitReached}
              title={isLimitReached ? 'Maximum 5 slides reached' : undefined}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Slide
            </Button>
          </div>
        }
      />

      {/* Slide Limit Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-[6px] border border-sand bg-cream-surface text-xs text-espresso/80">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-camel" />
          <span>
            <strong>{slides.length}</strong> of <strong>{MAX_SLIDES}</strong> slides configured.
          </span>
          <span className="text-espresso/50">|</span>
          <span>At least 1 slide must always remain active.</span>
        </div>
        {isLimitReached && (
          <span className="text-xs font-medium text-camel">
            Maximum limit reached. Remove a slide to upload a new one.
          </span>
        )}
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-[6px] border border-sand bg-cream-surface p-4 space-y-4">
              <Skeleton className="aspect-16/9 w-full rounded-[4px]" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center rounded-[6px] border border-sand bg-cream-surface space-y-3">
          <AlertCircle className="mx-auto h-8 w-8 text-espresso/40" />
          <p className="text-sm text-espresso">
            Failed to load slides: {getApiErrorMessage(error)}
          </p>
          <Button variant="secondary" onClick={() => queryClient.invalidateQueries({ queryKey: ['adminHeroSlides'] })}>
            Retry
          </Button>
        </div>
      ) : slides.length === 0 ? (
        <EmptyState
          icon={<Sliders className="w-10 h-10 text-camel stroke-[1.5]" />}
          title="No hero slides yet"
          description="Add your first full-bleed photograph to welcome visitors on the homepage."
          action={
            <Button variant="primary" onClick={handleOpenCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Slide
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide, index) => {
              const isFirst = index === 0;
              const isLast = index === slides.length - 1;

              return (
                <div
                  key={slide.id}
                  className="group relative flex flex-col justify-between rounded-[6px] border border-sand bg-cream-surface overflow-hidden shadow-xs hover:border-espresso/40 transition-colors"
                >
                  {/* Image Preview */}
                  <div className="relative aspect-16/9 w-full bg-sand/30 overflow-hidden border-b border-sand">
                    <img
                      src={slide.image_url}
                      alt={slide.alt_text ?? `Hero Slide ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Order badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-espresso/80 text-cream backdrop-blur-xs">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Active Status Badge */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <Badge variant={slide.is_active ? 'success' : 'neutral'}>
                        {slide.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-3 grow">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-espresso/60">
                        Alt Text
                      </p>
                      <p className="text-sm text-espresso line-clamp-1">
                        {slide.alt_text || (
                          <span className="italic text-espresso/40">No alt text (decorative)</span>
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-espresso/60">
                        Link URL
                      </p>
                      {slide.link_url ? (
                        <p className="text-xs text-camel truncate flex items-center gap-1 font-mono">
                          {slide.link_url}
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </p>
                      ) : (
                        <p className="text-xs italic text-espresso/40">No link (image only)</p>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-3 bg-cream/50 border-t border-sand flex items-center justify-between gap-2">
                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(index, 'up')}
                        disabled={isFirst || reorderMutation.isPending}
                        title="Move Up"
                        aria-label="Move slide up"
                        className="p-1.5 rounded hover:bg-sand/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-espresso"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(index, 'down')}
                        disabled={isLast || reorderMutation.isPending}
                        title="Move Down"
                        aria-label="Move slide down"
                        className="p-1.5 rounded hover:bg-sand/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-espresso"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Active Toggle & Edit & Delete */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          toggleActiveMutation.mutate({
                            id: slide.id,
                            newStatus: !slide.is_active,
                          })
                        }
                        title={slide.is_active ? 'Deactivate slide' : 'Activate slide'}
                        disabled={toggleActiveMutation.isPending}
                        className="p-1.5 rounded hover:bg-sand/40 transition-colors text-espresso"
                      >
                        {slide.is_active ? (
                          <Eye className="h-4 w-4 text-emerald-700" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-espresso/40" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(slide)}
                        title="Edit slide"
                        className="p-1.5 rounded hover:bg-sand/40 transition-colors text-espresso"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingSlide(slide)}
                        title="Delete slide"
                        className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Slide Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSaving && setIsModalOpen(false)}
        title={editingSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="p-3 rounded-[4px] bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Image Upload / Preview Area */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-espresso">
              Slide Image {!editingSlide && <span className="text-red-600">*</span>}
            </label>

            {filePreview || (editingSlide && editingSlide.image_url) ? (
              <div className="relative aspect-16/9 w-full rounded-[4px] overflow-hidden border border-sand bg-sand/20">
                <img
                  src={filePreview || editingSlide?.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveSelectedFile}
                  className="absolute top-2 right-2 p-1 rounded-full bg-espresso/80 text-cream hover:bg-espresso transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
                {editingSlide && !filePreview && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-espresso/80 text-cream text-[10px] uppercase tracking-wider">
                    Current Image
                  </div>
                )}
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-[4px] cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-camel bg-sand/20'
                    : 'border-sand hover:border-espresso/40 bg-cream-surface'
                }`}
              >
                <UploadCloud className="h-8 w-8 text-espresso/40 mb-2" />
                <p className="text-xs font-medium text-espresso">
                  Drag and drop an image, or click to browse
                </p>
                <p className="text-[11px] text-espresso/50 mt-1">
                  JPEG, PNG, or WebP up to 5MB (1920×1080 recommended)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />

            {editingSlide && (
              <p className="text-[11px] text-espresso/60">
                To replace the current image, click the X or browse a new file.
              </p>
            )}
          </div>

          {/* Alt Text Input */}
          <div>
            <Input
              label="Alt Text (accessibility)"
              placeholder="e.g. New season linen shirts in natural sunlight"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              helperText="Describe the image content for screen readers."
            />
          </div>

          {/* Link URL Input */}
          <div>
            <Input
              label="Target Link (optional)"
              placeholder="e.g. /shop, /shop?category=apparel, or https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              helperText="Clicking the slide on the storefront navigates to this URL."
            />
          </div>

          {/* Active Switch */}
          <div className="pt-2">
            <Switch
              checked={isActive}
              onChange={setIsActive}
              label="Active on Storefront"
              description="Inactive slides are hidden from the homepage slideshow."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sand">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              disabled={!editingSlide && !selectedFile}
            >
              {editingSlide ? 'Save Changes' : 'Create Slide'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingSlide)}
        onClose={() => setDeletingSlide(null)}
        onConfirm={() => {
          if (deletingSlide) {
            deleteMutation.mutate(deletingSlide.id);
          }
        }}
        title="Delete Hero Slide"
        description="Are you sure you want to delete this hero slide? The image and its configuration will be permanently removed. At least 1 active slide must remain."
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default HeroSlidesPage;
