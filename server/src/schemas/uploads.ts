import { z } from 'zod';
export const deleteUploadSchema = z.object({
    path: z.string().trim().min(1, 'File path is required'),
});
