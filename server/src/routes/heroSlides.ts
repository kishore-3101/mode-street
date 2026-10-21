import { Router } from 'express';
import multer from 'multer';
import { supabase } from '../lib/supabase.js';
import { processAndUploadHeroImage, deleteStorageFile } from '../lib/storage.js';
import { requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createHeroSlideSchema,
  updateHeroSlideSchema,
  heroSlideIdParamSchema,
  reorderHeroSlidesSchema,
} from '../schemas/heroSlides.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const heroUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  },
});

// ==========================================
// Public Storefront Router
// ==========================================
const publicRouter = Router();

// GET /api/hero-slides - Active slides for storefront slideshow
publicRouter.get('/', async (_req, res, next) => {
  try {
    const { data: slides, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching storefront hero slides:', error.message);
      res.status(500).json({ error: 'Failed to fetch hero slides' });
      return;
    }

    res.json(slides ?? []);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// Admin Router
// ==========================================
export const adminHeroSlidesRouter = Router();

// Require admin authentication for all routes on this router
adminHeroSlidesRouter.use(requireAdmin);

// GET /api/admin/hero-slides - List all slides (active and inactive)
adminHeroSlidesRouter.get('/', async (_req, res, next) => {
  try {
    const { data: slides, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching admin hero slides:', error.message);
      res.status(500).json({ error: 'Failed to fetch hero slides' });
      return;
    }

    res.json(slides ?? []);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/hero-slides/reorder - Reorder slides
adminHeroSlidesRouter.patch(
  '/reorder',
  validate({ body: reorderHeroSlidesSchema }),
  async (req, res, next) => {
    try {
      const { slideIds } = req.body as { slideIds: string[] };

      // Update sort_order for each slide in order
      const updatePromises = slideIds.map((id, index) =>
        supabase
          .from('hero_slides')
          .update({ sort_order: index })
          .eq('id', id)
      );

      const results = await Promise.all(updatePromises);
      const failed = results.find((r) => r.error);
      if (failed?.error) {
        console.error('Error reordering slides:', failed.error.message);
        res.status(500).json({ error: 'Failed to reorder hero slides' });
        return;
      }

      res.json({ message: 'Slides reordered successfully' });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/admin/hero-slides - Create a new slide
adminHeroSlidesRouter.post('/', heroUpload.single('image'), async (req, res, next) => {
  try {
    // 1. Enforce max 5 slides limit
    const { count, error: countError } = await supabase
      .from('hero_slides')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error checking slide count:', countError.message);
      res.status(500).json({ error: 'Database check failed' });
      return;
    }

    if ((count ?? 0) >= 5) {
      res.status(400).json({ error: 'Maximum limit of 5 hero slides reached' });
      return;
    }

    // 2. Validate input fields
    const parsed = createHeroSlideSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.issues,
      });
      return;
    }

    const { alt_text, link_url, is_active } = parsed.data;
    let imageUrl = parsed.data.image_url;
    let storagePath: string | null = null;

    // 3. Process uploaded file if present
    if (req.file) {
      const uploadResult = await processAndUploadHeroImage(
        req.file.buffer,
        req.file.originalname
      );
      imageUrl = uploadResult.url;
      storagePath = uploadResult.path;
    }

    if (!imageUrl) {
      res.status(400).json({ error: 'An image file or valid image URL is required' });
      return;
    }

    // 4. Calculate sort order
    let sortOrder = parsed.data.sort_order;
    if (sortOrder === undefined) {
      const { data: maxOrderData } = await supabase
        .from('hero_slides')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();

      sortOrder = maxOrderData ? (maxOrderData.sort_order ?? 0) + 1 : 0;
    }

    // 5. Insert new slide
    const { data: newSlide, error: insertError } = await supabase
      .from('hero_slides')
      .insert({
        image_url: imageUrl,
        storage_path: storagePath,
        alt_text: alt_text || null,
        link_url: link_url || null,
        sort_order: sortOrder,
        is_active: is_active ?? true,
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Error creating hero slide:', insertError.message);
      if (storagePath) {
        await deleteStorageFile(storagePath);
      }
      res.status(500).json({ error: 'Failed to create hero slide' });
      return;
    }

    res.status(201).json(newSlide);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/hero-slides/:id - Update a slide
adminHeroSlidesRouter.patch(
  '/:id',
  validate({ params: heroSlideIdParamSchema }),
  heroUpload.single('image'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // 1. Fetch existing slide
      const { data: existing, error: fetchErr } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchErr) {
        console.error('Error fetching slide to update:', fetchErr.message);
        res.status(500).json({ error: 'Database query failed' });
        return;
      }

      if (!existing) {
        res.status(404).json({ error: 'Hero slide not found' });
        return;
      }

      // 2. Validate input fields
      const parsed = updateHeroSlideSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues,
        });
        return;
      }

      const updates: Record<string, any> = {};

      if (parsed.data.alt_text !== undefined) {
        updates.alt_text = parsed.data.alt_text || null;
      }
      if (parsed.data.link_url !== undefined) {
        updates.link_url = parsed.data.link_url || null;
      }
      if (parsed.data.sort_order !== undefined) {
        updates.sort_order = parsed.data.sort_order;
      }

      // 3. Handle is_active toggle and ensure at least 1 active slide remains
      if (parsed.data.is_active !== undefined) {
        const nextActive = Boolean(parsed.data.is_active);
        if (!nextActive && existing.is_active) {
          const { count: otherActiveCount, error: activeErr } = await supabase
            .from('hero_slides')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true)
            .neq('id', id);

          if (activeErr) {
            console.error('Error checking active slide count:', activeErr.message);
            res.status(500).json({ error: 'Database check failed' });
            return;
          }

          if ((otherActiveCount ?? 0) < 1) {
            res.status(400).json({
              error: 'At least one slide must remain active. You cannot deactivate the only active slide.',
            });
            return;
          }
        }
        updates.is_active = nextActive;
      }

      // 4. Handle image replacement if a new file is uploaded
      let newStoragePath: string | null = null;
      if (req.file) {
        const uploadResult = await processAndUploadHeroImage(
          req.file.buffer,
          req.file.originalname
        );
        updates.image_url = uploadResult.url;
        updates.storage_path = uploadResult.path;
        newStoragePath = uploadResult.path;
      } else if (parsed.data.image_url) {
        updates.image_url = parsed.data.image_url;
      }

      // 5. Update database
      const { data: updatedSlide, error: updateErr } = await supabase
        .from('hero_slides')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (updateErr) {
        console.error('Error updating hero slide:', updateErr.message);
        if (newStoragePath) {
          await deleteStorageFile(newStoragePath);
        }
        res.status(500).json({ error: 'Failed to update hero slide' });
        return;
      }

      // If new image was saved and old storage file exists, clean up old file
      if (newStoragePath && existing.storage_path) {
        await deleteStorageFile(existing.storage_path);
      }

      res.json(updatedSlide);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/admin/hero-slides/:id - Delete a slide
adminHeroSlidesRouter.delete(
  '/:id',
  validate({ params: heroSlideIdParamSchema }),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // 1. Fetch existing slide
      const { data: existing, error: fetchErr } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchErr) {
        console.error('Error fetching slide to delete:', fetchErr.message);
        res.status(500).json({ error: 'Database query failed' });
        return;
      }

      if (!existing) {
        res.status(404).json({ error: 'Hero slide not found' });
        return;
      }

      // 2. Enforce minimum slide requirements:
      // Prevent deleting if it's the only slide or the only active slide
      const { count: totalCount, error: countErr } = await supabase
        .from('hero_slides')
        .select('*', { count: 'exact', head: true });

      if (countErr) {
        console.error('Error checking slide count:', countErr.message);
        res.status(500).json({ error: 'Database check failed' });
        return;
      }

      if ((totalCount ?? 0) <= 1) {
        res.status(400).json({
          error: 'Cannot delete the only slide. At least one slide must remain.',
        });
        return;
      }

      if (existing.is_active) {
        const { count: activeCount, error: activeErr } = await supabase
          .from('hero_slides')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        if (activeErr) {
          console.error('Error checking active count:', activeErr.message);
          res.status(500).json({ error: 'Database check failed' });
          return;
        }

        if ((activeCount ?? 0) <= 1) {
          res.status(400).json({
            error: 'Cannot delete the only active slide. At least one active slide is required.',
          });
          return;
        }
      }

      // 3. Delete from database
      const { error: deleteErr } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);

      if (deleteErr) {
        console.error('Error deleting hero slide:', deleteErr.message);
        res.status(500).json({ error: 'Failed to delete hero slide' });
        return;
      }

      // 4. Delete file from storage if it exists
      if (existing.storage_path) {
        await deleteStorageFile(existing.storage_path);
      }

      res.json({ message: 'Slide deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
);

export default publicRouter;
