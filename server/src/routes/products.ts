import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { generateUniqueSlug } from '../lib/slug.js';
import { deleteStorageFiles } from '../lib/storage.js';
import { requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createProductSchema, updateProductSchema, updateStockSchema, productIdParamSchema, productSlugParamSchema, productQuerySchema, adminProductQuerySchema, } from '../schemas/products.js';
export const productsRouter = Router();
export const adminProductsRouter = Router();
// Helper to format product with sorted images
function formatProduct(product: any) {
    if (product.images && Array.isArray(product.images)) {
        product.images.sort((a: any, b: any) => a.position - b.position);
    }
    return product;
}
// Handler for Admin listing all products (including inactive)
async function handleAdminListProducts(req: any, res: any, next: any) {
    try {
        const search = typeof req.query.search === 'string' ? req.query.search : undefined;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        let query = supabase
            .from('products')
            .select('*, category:categories(id, name, slug), images:product_images(id, url, path, position), variants:product_variants(id, size, stock)', { count: 'exact' });
        if (search) {
            const sanitized = search.trim();
            query = query.or(`name.ilike.%${sanitized}%,description.ilike.%${sanitized}%`);
        }
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data: products, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);
        if (error) {
            console.error('Error fetching admin products:', error.message);
            res.status(500).json({ error: 'Failed to fetch products' });
            return;
        }
        res.setHeader('X-Total-Count', count ?? 0);
        const formatted = (products ?? []).map((p: any) => formatProduct(p));
        res.json(formatted);
    }
    catch (err) {
        next(err);
    }
}
// Admin products router (mounted at /api/admin/products)
adminProductsRouter.get('/', requireAdmin, validate({ query: adminProductQuerySchema }), handleAdminListProducts);
// Also alias on productsRouter just in case
productsRouter.get('/admin', requireAdmin, validate({ query: adminProductQuerySchema }), handleAdminListProducts);
// GET /api/products - Public: list active products
productsRouter.get('/', validate({ query: productQuerySchema }), async (req, res, next) => {
    try {
        const category = typeof req.query.category === 'string' ? req.query.category : undefined;
        const search = typeof req.query.search === 'string' ? req.query.search : undefined;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        let categoryId = null;
        if (category) {
            const { data: cat, error: catError } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', category)
                .maybeSingle();
            if (catError) {
                console.error('Error fetching category by slug:', catError.message);
                res.status(500).json({ error: 'Failed to fetch products' });
                return;
            }
            if (!cat) {
                res.setHeader('X-Total-Count', 0);
                res.json([]);
                return;
            }
            categoryId = cat.id;
        }
        let query = supabase
            .from('products')
            .select('*, category:categories(id, name, slug), images:product_images(id, url, path, position), variants:product_variants(id, size, stock)', { count: 'exact' })
            .eq('is_active', true);
        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }
        if (search) {
            const sanitized = search.trim();
            query = query.or(`name.ilike.%${sanitized}%,description.ilike.%${sanitized}%`);
        }
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data: products, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);
        if (error) {
            console.error('Error fetching products:', error.message);
            res.status(500).json({ error: 'Failed to fetch products' });
            return;
        }
        res.setHeader('X-Total-Count', count ?? 0);
        const formatted = (products ?? []).map((p) => formatProduct(p));
        res.json(formatted);
    }
    catch (err) {
        next(err);
    }
});
// GET /api/products/:slug - Public: get product by slug
productsRouter.get('/:slug', validate({ params: productSlugParamSchema }), async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const { data: product, error } = await supabase
            .from('products')
            .select('*, category:categories(id, name, slug), images:product_images(id, url, path, position), variants:product_variants(id, size, stock)')
            .eq('slug', slug)
            .eq('is_active', true)
            .maybeSingle();
        if (error) {
            console.error('Error fetching product by slug:', error.message);
            res.status(500).json({ error: 'Failed to fetch product' });
            return;
        }
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json(formatProduct(product));
    }
    catch (err) {
        next(err);
    }
});
// POST /api/products - Admin: create product
productsRouter.post('/', requireAdmin, validate({ body: createProductSchema }), async (req, res, next) => {
    let createdProductId = null;
    try {
        const body = req.body;
        // Verify category exists
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .eq('id', body.category_id)
            .maybeSingle();
        if (catError || !category) {
            res.status(400).json({ error: 'Category does not exist' });
            return;
        }
        const slug = await generateUniqueSlug('products', body.name);
        // Step 1: Insert product row
        const { data: product, error: productError } = await supabase
            .from('products')
            .insert({
            category_id: body.category_id,
            name: body.name,
            slug,
            description: body.description ?? null,
            price: body.price,
            is_active: body.is_active ?? true,
        })
            .select('*')
            .single();
        if (productError || !product) {
            console.error('Error creating product row:', productError?.message);
            res.status(500).json({ error: 'Failed to create product' });
            return;
        }
        createdProductId = product.id;
        // Step 2: Insert variants
        if (body.variants && body.variants.length > 0) {
            const variantRows = body.variants.map((v) => ({
                product_id: product.id,
                size: v.size,
                stock: v.stock,
            }));
            const { error: variantError } = await supabase
                .from('product_variants')
                .insert(variantRows);
            if (variantError) {
                console.error('Error creating product variants, rolling back:', variantError.message);
                await supabase.from('products').delete().eq('id', product.id);
                res.status(500).json({ error: 'Failed to create product variants' });
                return;
            }
        }
        // Step 3: Insert images
        if (body.images && body.images.length > 0) {
            const imageRows = body.images.map((img, index) => ({
                product_id: product.id,
                url: img.url,
                path: img.path,
                position: index,
            }));
            const { error: imageError } = await supabase
                .from('product_images')
                .insert(imageRows);
            if (imageError) {
                console.error('Error creating product images, rolling back:', imageError.message);
                await supabase.from('products').delete().eq('id', product.id);
                res.status(500).json({ error: 'Failed to create product images' });
                return;
            }
        }
        // Fetch created product with relations
        const { data: fullProduct, error: fetchError } = await supabase
            .from('products')
            .select('*, category:categories(id, name, slug), images:product_images(id, url, path, position), variants:product_variants(id, size, stock)')
            .eq('id', product.id)
            .single();
        if (fetchError || !fullProduct) {
            console.error('Error fetching created product:', fetchError?.message);
            res.status(500).json({ error: 'Failed to fetch created product' });
            return;
        }
        res.status(201).json(formatProduct(fullProduct));
    }
    catch (err) {
        if (createdProductId) {
            await supabase.from('products').delete().eq('id', createdProductId);
        }
        next(err);
    }
});
// PUT /api/products/:id - Admin: update product
productsRouter.put('/:id', requireAdmin, validate({ params: productIdParamSchema, body: updateProductSchema }), async (req, res, next) => {
    try {
        const id = String(req.params.id);
        const body = req.body;
        // Check if product exists
        const { data: existing, error: findError } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (findError) {
            console.error('Error checking product existence:', findError.message);
            res.status(500).json({ error: 'Failed to update product' });
            return;
        }
        if (!existing) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        // Verify category if changed
        if (body.category_id && body.category_id !== existing.category_id) {
            const { data: category, error: catError } = await supabase
                .from('categories')
                .select('id')
                .eq('id', body.category_id)
                .maybeSingle();
            if (catError || !category) {
                res.status(400).json({ error: 'Category does not exist' });
                return;
            }
        }
        const updateData: any = {
            updated_at: new Date().toISOString(),
        };
        if (body.name !== undefined) {
            updateData.name = body.name;
            if (body.name !== existing.name) {
                updateData.slug = await generateUniqueSlug('products', body.name, id);
            }
        }
        if (body.description !== undefined) {
            updateData.description = body.description;
        }
        if (body.price !== undefined) {
            updateData.price = body.price;
        }
        if (body.category_id !== undefined) {
            updateData.category_id = body.category_id;
        }
        if (body.is_active !== undefined) {
            updateData.is_active = body.is_active;
        }
        // Update product row
        const { error: updateError } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', id);
        if (updateError) {
            console.error('Error updating product:', updateError.message);
            res.status(500).json({ error: 'Failed to update product' });
            return;
        }
        // Sync variants by size (insert new, update existing, delete removed)
        if (body.variants !== undefined) {
            const { data: existingVariants, error: vError } = await supabase
                .from('product_variants')
                .select('*')
                .eq('product_id', id);
            if (vError) {
                console.error('Error fetching existing variants:', vError.message);
                res.status(500).json({ error: 'Failed to sync variants' });
                return;
            }
            const existingMap = new Map((existingVariants ?? []).map((v) => [v.size, v]));
            const newSizes = new Set(body.variants.map((v) => v.size));
            // Delete variants not in new list
            const toDeleteIds = [];
            for (const [size, variant] of existingMap.entries()) {
                if (!newSizes.has(size)) {
                    toDeleteIds.push(variant.id);
                }
            }
            if (toDeleteIds.length > 0) {
                await supabase.from('product_variants').delete().in('id', toDeleteIds);
            }
            // Update existing or insert new
            for (const v of body.variants) {
                const existingVariant = existingMap.get(v.size);
                if (existingVariant) {
                    await supabase
                        .from('product_variants')
                        .update({ stock: v.stock, updated_at: new Date().toISOString() })
                        .eq('id', existingVariant.id);
                }
                else {
                    await supabase
                        .from('product_variants')
                        .insert({
                        product_id: id,
                        size: v.size,
                        stock: v.stock,
                    });
                }
            }
        }
        // Sync images (delete the storage files of removed images)
        if (body.images !== undefined) {
            const { data: existingImages, error: imgError } = await supabase
                .from('product_images')
                .select('*')
                .eq('product_id', id);
            if (imgError) {
                console.error('Error fetching existing images:', imgError.message);
                res.status(500).json({ error: 'Failed to sync images' });
                return;
            }
            const newPaths = new Set(body.images.map((img) => img.path));
            const removedPaths = [];
            for (const img of existingImages ?? []) {
                if (!newPaths.has(img.path)) {
                    removedPaths.push(img.path);
                }
            }
            // Delete removed storage files
            if (removedPaths.length > 0) {
                await deleteStorageFiles(removedPaths);
            }
            // Remove old rows and insert new ones with positions
            await supabase.from('product_images').delete().eq('product_id', id);
            if (body.images.length > 0) {
                const newRows = body.images.map((img, index) => ({
                    product_id: id,
                    url: img.url,
                    path: img.path,
                    position: index,
                }));
                await supabase.from('product_images').insert(newRows);
            }
        }
        // Return updated product
        const { data: updatedProduct, error: fetchError } = await supabase
            .from('products')
            .select('*, category:categories(id, name, slug), images:product_images(id, url, path, position), variants:product_variants(id, size, stock)')
            .eq('id', id)
            .single();
        if (fetchError || !updatedProduct) {
            console.error('Error fetching updated product:', fetchError?.message);
            res.status(500).json({ error: 'Failed to fetch updated product' });
            return;
        }
        res.json(formatProduct(updatedProduct));
    }
    catch (err) {
        next(err);
    }
});
// DELETE /api/products/:id - Admin: delete product
productsRouter.delete('/:id', requireAdmin, validate({ params: productIdParamSchema }), async (req, res, next) => {
    try {
        const id = req.params.id;
        // Check if product exists
        const { data: existing, error: findError } = await supabase
            .from('products')
            .select('id')
            .eq('id', id)
            .maybeSingle();
        if (findError) {
            console.error('Error checking product existence:', findError.message);
            res.status(500).json({ error: 'Failed to delete product' });
            return;
        }
        if (!existing) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        // Fetch images to delete from storage first
        const { data: images } = await supabase
            .from('product_images')
            .select('path')
            .eq('product_id', id);
        if (images && images.length > 0) {
            const paths = images.map((i) => i.path).filter(Boolean);
            await deleteStorageFiles(paths);
        }
        // Delete product row (cascade deletes child variants and images)
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (deleteError) {
            console.error('Error deleting product:', deleteError.message);
            res.status(500).json({ error: 'Failed to delete product' });
            return;
        }
        res.json({ message: 'Product deleted successfully' });
    }
    catch (err) {
        next(err);
    }
});
// PATCH /api/products/:id/stock - Admin: update inventory per variant
productsRouter.patch('/:id/stock', requireAdmin, validate({ params: productIdParamSchema, body: updateStockSchema }), async (req, res, next) => {
    try {
        const id = req.params.id;
        const { variants } = req.body;
        // Check if product exists
        const { data: existing, error: findError } = await supabase
            .from('products')
            .select('id')
            .eq('id', id)
            .maybeSingle();
        if (findError || !existing) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        for (const item of variants) {
            const { error: updateError } = await supabase
                .from('product_variants')
                .update({
                stock: item.stock,
                updated_at: new Date().toISOString(),
            })
                .eq('id', item.id)
                .eq('product_id', id);
            if (updateError) {
                console.error('Error updating variant stock:', updateError.message);
                res.status(500).json({ error: 'Failed to update stock' });
                return;
            }
        }
        // Return updated variants
        const { data: updatedVariants, error: fetchError } = await supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', id)
            .order('size', { ascending: true });
        if (fetchError) {
            console.error('Error fetching updated variants:', fetchError.message);
            res.status(500).json({ error: 'Failed to fetch updated variants' });
            return;
        }
        res.json(updatedVariants ?? []);
    }
    catch (err) {
        next(err);
    }
});
export default productsRouter;
