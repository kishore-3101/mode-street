import { Router } from 'express';
import { processAndUploadImage, deleteStorageFile } from '../lib/storage.js';
import { requireAdmin } from '../middleware/auth.js';
import { uploadImages } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { deleteUploadSchema } from '../schemas/uploads.js';

const router = Router();

// POST /api/uploads - Admin: upload up to 5 images
router.post('/', requireAdmin, uploadImages.array('images', 5), async (req: any, res: any, next: any) => {
    try {
        const files = (req.files ?? []) as any[];
        if (!Array.isArray(files) || files.length === 0) {
            res.status(400).json({ error: 'No image files provided' });
            return;
        }

        const uploadPromises = files.map((file: any) => processAndUploadImage(file.buffer, file.originalname));
        const uploaded = await Promise.all(uploadPromises);

        res.status(201).json(uploaded);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/uploads - Admin: delete an image by path
router.delete('/', requireAdmin, validate({ body: deleteUploadSchema }), async (req: any, res: any, next: any) => {
    try {
        const { path } = req.body;
        await deleteStorageFile(path);
        res.json({ message: 'File deleted successfully' });
    } catch (err) {
        next(err);
    }
});

export const uploadsRouter = router;
export default router;
