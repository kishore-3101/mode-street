import { supabase } from './supabase.js';
export function createBaseSlug(text: string) {
    const slug = text
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with -
        .replace(/^-+|-+$/g, ''); // remove leading/trailing -
    return slug || 'item';
}
export async function generateUniqueSlug(table: any, name: string, excludeId?: string) {
    const baseSlug = createBaseSlug(name);
    let candidate = baseSlug;
    let counter = 1;
    while (true) {
        let query = supabase
            .from(table)
            .select('id')
            .eq('slug', candidate);
        if (excludeId) {
            query = query.neq('id', excludeId);
        }
        const { data, error } = await query.maybeSingle();
        if (error) {
            throw error;
        }
        if (!data) {
            return candidate;
        }
        candidate = `${baseSlug}-${counter}`;
        counter++;
    }
}
