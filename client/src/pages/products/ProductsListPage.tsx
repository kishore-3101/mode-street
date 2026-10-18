import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Shirt,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { getAdminProductsApi, deleteProductApi } from '../../api/products.js';
import { getCategoriesApi } from '../../api/categories.js';
import {
  Button,
  Input,
  Select,
  Badge,
  PageHeader,
  EmptyState,
  TableRowSkeleton,
  CardSkeleton,
  Pagination,
  ConfirmDialog,
} from '../../components/ui/index.js';
import { formatCurrency, getApiErrorMessage } from '../../lib/utils.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import type { Product } from '../../types/index.js';

export function ProductsListPage() {
  const queryClient = useQueryClient();

  // Queries
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => getAdminProductsApi(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesApi,
  });

  // Filter & Search states
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 250);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Delete State
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Filtered Products computation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (categoryFilter !== 'all' && p.category_id !== categoryFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === 'active' && !p.is_active) return false;
      if (statusFilter === 'inactive' && p.is_active) return false;

      // Search filter
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase().trim();
        const nameMatch = p.name.toLowerCase().includes(query);
        const descMatch = (p.description || '').toLowerCase().includes(query);
        const slugMatch = p.slug.toLowerCase().includes(query);
        if (!nameMatch && !descMatch && !slugMatch) return false;
      }

      return true;
    });
  }, [products, categoryFilter, statusFilter, debouncedSearch]);

  // Paginated slice
  const paginatedProducts = useMemo(() => {
    const from = (currentPage - 1) * pageSize;
    return filteredProducts.slice(from, from + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProductApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
      setDeletingProduct(null);
    },
    onError: (err) => {
      const msg = getApiErrorMessage(err, 'Failed to delete product');
      toast.error(msg);
      setDeletingProduct(null);
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Products"
        subtitle="Manage apparel items, sizes, photography and stock"
        action={
          <Link to="/admin/products/new">
            <Button className="gap-2 shadow-xs">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        }
      />

      {/* Filter & Search Toolbar */}
      <div className="bg-cream-surface p-4 rounded-xl border border-sand/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Search by name, slug or details..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setCurrentPage(1);
            }}
            leftElement={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Category Filter */}
          <div className="w-full sm:w-48">
            <Select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'all', label: 'All Categories' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-40">
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'all' | 'active' | 'inactive');
                setCurrentPage(1);
              }}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active only' },
                { value: 'inactive', label: 'Inactive only' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {isError && (
        <div className="p-4 rounded-xl bg-danger-bg border border-[#E8C6C3] text-danger text-sm">
          Failed to load products: {getApiErrorMessage(error)}
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoadingProducts && (
        <>
          <div className="hidden lg:block bg-cream-surface rounded-xl border border-sand/80 overflow-hidden shadow-2xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-sand/30 border-b border-sand">
                  <th className="py-3.5 px-4 text-xs font-semibold text-espresso">Item</th>
                  <th className="py-3.5 px-4 text-xs font-semibold text-espresso">Category</th>
                  <th className="py-3.5 px-4 text-xs font-semibold text-espresso">Price</th>
                  <th className="py-3.5 px-4 text-xs font-semibold text-espresso">Stock</th>
                  <th className="py-3.5 px-4 text-xs font-semibold text-espresso">Status</th>
                  <th className="py-3.5 px-4 text-xs font-semibold text-espresso text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={6} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!isLoadingProducts && !isError && filteredProducts.length === 0 && (
        <EmptyState
          icon={<Shirt className="w-10 h-10 text-camel stroke-[1.5]" />}
          title={products.length === 0 ? 'No products in catalog' : 'No matching products'}
          description={
            products.length === 0
              ? 'Add your first garment with size variants, pricing and photography.'
              : 'Try clearing or changing your search criteria and filters.'
          }
          action={
            products.length === 0 ? (
              <Link to="/admin/products/new">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add First Product
                </Button>
              </Link>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchInput('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )
          }
        />
      )}

      {/* Data Presentation (Desktop Table + Mobile Cards) */}
      {!isLoadingProducts && !isError && filteredProducts.length > 0 && (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-cream-surface rounded-xl border border-sand/80 overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sand/30 border-b border-sand text-xs font-semibold uppercase tracking-wider text-espresso/80">
                  <th className="py-3.5 px-4">Garment</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Sizes & Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/50 text-sm">
                {paginatedProducts.map((product) => {
                  const coverImage = product.images?.[0]?.url;
                  const totalStock = (product.variants || []).reduce(
                    (acc, v) => acc + v.stock,
                    0
                  );

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-sand/15 transition-colors duration-150"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 rounded-md bg-sand/20 overflow-hidden shrink-0 border border-sand flex items-center justify-center">
                            {coverImage ? (
                              <img
                                src={coverImage}
                                alt={product.name}
                                className="w-full h-full object-cover object-center"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-espresso/40" />
                            )}
                          </div>
                          <div>
                            <Link
                              to={`/admin/products/${product.id}/edit`}
                              className="font-serif font-semibold text-base text-espresso hover:text-camel transition-colors block"
                            >
                              {product.name}
                            </Link>
                            <span className="text-xs font-mono text-espresso/60">
                              /{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-espresso/80 font-medium">
                        {product.category?.name || 'Unassigned'}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-espresso">
                        {formatCurrency(product.price)}
                      </td>

                      {/* Total Stock & Variant sizes */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span
                            className={`font-semibold font-mono text-xs ${
                              totalStock === 0
                                ? 'text-danger'
                                : totalStock <= 5
                                ? 'text-warning'
                                : 'text-espresso'
                            }`}
                          >
                            {totalStock} units
                          </span>
                          <span className="text-[11px] text-espresso/60 truncate max-w-[180px]">
                            {(product.variants || [])
                              .map((v) => `${v.size}: ${v.stock}`)
                              .join(', ') || 'No variants'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge variant={product.is_active ? 'success' : 'neutral'} size="sm">
                          {product.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/admin/products/${product.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-espresso/80 hover:text-espresso"
                              aria-label={`Edit ${product.name}`}
                            >
                              <Edit2 className="w-4 h-4 text-camel" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingProduct(product)}
                            className="h-8 px-2 text-danger hover:bg-danger-bg"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards View (No horizontal scroll!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {paginatedProducts.map((product) => {
              const coverImage = product.images?.[0]?.url;
              const totalStock = (product.variants || []).reduce(
                (acc, v) => acc + v.stock,
                0
              );

              return (
                <div
                  key={product.id}
                  className="bg-cream-surface rounded-xl border border-sand/80 p-4 shadow-2xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-20 rounded-md bg-sand/20 overflow-hidden shrink-0 border border-sand flex items-center justify-center">
                      {coverImage ? (
                        <img
                          src={coverImage}
                          alt={product.name}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-espresso/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <Badge
                          variant={product.is_active ? 'success' : 'neutral'}
                          size="sm"
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="font-mono font-bold text-sm text-espresso">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="font-serif font-semibold text-base text-espresso truncate block hover:text-camel"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-espresso/70 mt-0.5">
                        {product.category?.name || 'Unassigned'}
                      </p>
                    </div>
                  </div>

                  {/* Stock info */}
                  <div className="bg-cream/40 p-2.5 rounded-lg border border-sand/40 text-left text-xs flex justify-between items-center">
                    <span className="text-espresso/70">Total Stock:</span>
                    <span
                      className={`font-semibold font-mono ${
                        totalStock === 0
                          ? 'text-danger'
                          : totalStock <= 5
                          ? 'text-warning'
                          : 'text-espresso'
                      }`}
                    >
                      {totalStock} units
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-sand/40">
                    <Link to={`/admin/products/${product.id}/edit`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full gap-1.5">
                        <Edit2 className="w-3.5 h-3.5 text-camel" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingProduct(product)}
                      className="text-danger hover:bg-danger-bg px-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredProducts.length}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => {
          if (deletingProduct) {
            deleteMutation.mutate(deletingProduct.id);
          }
        }}
        title="Delete Product"
        description={`Are you sure you want to delete "${deletingProduct?.name}"? All associated variants, images and inventory records will be permanently removed.`}
        confirmLabel="Delete Product"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
