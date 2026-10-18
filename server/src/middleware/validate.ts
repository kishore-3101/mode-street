export function validate(schemas) {
    return (req, res, next) => {
        if (schemas.params) {
            const result = schemas.params.safeParse(req.params);
            if (!result.success) {
                const message = result.error.issues
                    .map((i) => `${i.path.join('.') || 'param'}: ${i.message}`)
                    .join(', ');
                res.status(400).json({ error: message });
                return;
            }
            req.params = result.data;
        }
        if (schemas.query) {
            const result = schemas.query.safeParse(req.query);
            if (!result.success) {
                const message = result.error.issues
                    .map((i) => `${i.path.join('.') || 'query'}: ${i.message}`)
                    .join(', ');
                res.status(400).json({ error: message });
                return;
            }
            // Note: express req.query is ParsedQs
            Object.assign(req.query, result.data);
        }
        if (schemas.body) {
            const result = schemas.body.safeParse(req.body);
            if (!result.success) {
                const message = result.error.issues
                    .map((i) => `${i.path.join('.') || 'body'}: ${i.message}`)
                    .join(', ');
                res.status(400).json({ error: message });
                return;
            }
            req.body = result.data;
        }
        next();
    };
}
