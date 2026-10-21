import crypto from 'node:crypto';
import sharp from 'sharp';
import { supabase } from './supabase.js';
export const BUCKET_NAME = 'products';
export async function processAndUploadImage(buffer, _filename) {
    const processedBuffer = await sharp(buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    const fileName = `${Date.now()}-${crypto.randomUUID()}.webp`;
    const storagePath = fileName;
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, processedBuffer, {
        contentType: 'image/webp',
        upsert: false,
    });
    if (error) {
        throw new Error(`Failed to upload image to storage: ${error.message}`);
    }
    const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);
    return {
        url: publicUrlData.publicUrl,
        path: storagePath,
    };
}
export async function processAndUploadHeroImage(buffer: Buffer, _filename?: string) {
    const processedBuffer = await sharp(buffer)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();
    const fileName = `hero-${Date.now()}-${crypto.randomUUID()}.webp`;
    const storagePath = fileName;
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, processedBuffer, {
        contentType: 'image/webp',
        upsert: false,
    });
    if (error) {
        throw new Error(`Failed to upload hero image to storage: ${error.message}`);
    }
    const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);
    return {
        url: publicUrlData.publicUrl,
        path: storagePath,
    };
}
export async function deleteStorageFile(path) {
    if (!path)
        return;
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
    if (error) {
        console.error(`Failed to delete storage file ${path}:`, error.message);
    }
}
export async function deleteStorageFiles(paths) {
    const validPaths = paths.filter((p) => Boolean(p && p.trim()));
    if (validPaths.length === 0)
        return;
    const { error } = await supabase.storage.from(BUCKET_NAME).remove(validPaths);
    if (error) {
        console.error('Failed to delete storage files:', error.message);
    }
}
