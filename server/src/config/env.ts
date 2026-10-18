import dotenv from 'dotenv';
import { z } from 'zod';
// Load environment variables from .env file
dotenv.config();
const envSchema = z.object({
    SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
    SUPABASE_SECRET_KEY: z.string().min(1, 'SUPABASE_SECRET_KEY is required'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    CLIENT_URL: z.string().min(1, 'CLIENT_URL is required'),
    PORT: z.coerce.number().default(5000),
    ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email'),
    ADMIN_PASSWORD: z.string().min(1, 'ADMIN_PASSWORD is required'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('Environment validation failed:');
    for (const issue of parsed.error.issues) {
        console.error(` - ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
}
export const env = parsed.data;
