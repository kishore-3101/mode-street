import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { generateUniqueSlug } from '../lib/slug.js';
import { deleteStorageFile } from '../lib/storage.js';
import { requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCategorySchema, updateCategorySchema, categoryIdParamSchema, categorySlugParamSchema, } from '../schemas/categories.js';
const router = Router();
// GET /api/categories - Public: list all categories
router.get('/', async (_req, res, next) => {
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });
        if (error) {
            console.error('Error fetching categories:', error.message);
            res.status(500).json({ error: 'Failed to fetch categories' });
            return;
        }
        res.json(categories ?? []);
    }
    catch (err) {
        next(err);
    }
});
// GET /api/categories/:slug - Public: get category by slug
router.get('/:slug', validate({ params: categorySlugParamSchema }), async (req, res, next) => {
    try {
        const { slug } = req.params;
        const { data: category, error } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();
        if (error) {
            console.error('Error fetching category by slug:', error.message);
            res.status(500).json({ error: 'Failed to fetch category' });
            return;
        }
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        res.json(category);
    }
    catch (err) {
        next(err);
    }
});
// POST /api/categories - Admin: create category
router.post('/', requireAdmin, validate({ body: createCategorySchema }), async (req, res, next) => {
    try {
        const body = req.body;
        const slug = await generateUniqueSlug('categories', body.name);
        const { data: category, error } = await supabase
            .from('categories')
            .insert({
            name: body.name,
            slug,
            image_url: body.image_url ?? null,
            image_path: body.image_path ?? null,
        })
            .select('*')
            .single();
        if (error) {
            console.error('Error creating category:', error.message);
            res.status(500).json({ error: 'Failed to create category' });
            return;
        }
        res.status(201).json(category);
    }
    catch (err) {
        next(err);
    }
});
// PUT /api/categories/:id - Admin: update category
router.put('/:id', requireAdmin, validate({ params: categoryIdParamSchema, body: updateCategorySchema }), async (req, res, next) => {
    try {
        const id = req.params.id;
        const body = req.body;
        // Check if category exists
        const { data: existing, error: findError } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (findError) {
            console.error('Error checking category existence:', findError.message);
            res.status(500).json({ error: 'Failed to update category' });
            return;
        }
        if (!existing) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        const updateData = {};
        if (body.name !== undefined) {
            updateData.name = body.name;
            if (body.name !== existing.name) {
                updateData.slug = await generateUniqueSlug('categories', body.name, id);
            }
        }
        if (body.image_url !== undefined) {
            updateData.image_url = body.image_url;
        }
        if (body.image_path !== undefined) {
            // If image_path changed, delete previous image from storage
            if (existing.image_path && existing.image_path !== body.image_path) {
                await deleteStorageFile(existing.image_path);
            }
            updateData.image_path = body.image_path;
        }
        const { data: updated, error: updateError } = await supabase
            .from('categories')
            .update(updateData)
            .eq('id', id)
            .select('*')
            .single();
        if (updateError) {
            console.error('Error updating category:', updateError.message);
            res.status(500).json({ error: 'Failed to update category' });
            return;
        }
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
});
// DELETE /api/categories/:id - Admin: delete category
router.delete('/:id', requireAdmin, validate({ params: categoryIdParamSchema }), async (req, res, next) => {
    try {
        const id = req.params.id;
        // Check if category exists
        const { data: existing, error: findError } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (findError) {
            console.error('Error checking category existence:', findError.message);
            res.status(500).json({ error: 'Failed to delete category' });
            return;
        }
        if (!existing) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        // Check if category still has products
        const { count, error: countError } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .eq('category_id', id);
        if (countError) {
            console.error('Error checking products in category:', countError.message);
            res.status(500).json({ error: 'Failed to delete category' });
            return;
        }
        if (count !== null && count > 0) {
            res.status(409).json({ error: 'Cannot delete category that still has products' });
            return;
        }
        // Delete storage file if associated
        if (existing.image_path) {
            await deleteStorageFile(existing.image_path);
        }
        const { error: deleteError } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);
        if (deleteError) {
            console.error('Error deleting category:', deleteError.message);
            res.status(500).json({ error: 'Failed to delete category' });
            return;
        }
        res.json({ message: 'Category deleted successfully' });
    }
    catch (err) {
        next(err);
    }
});
export default router;
