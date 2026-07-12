export const validate = (schema) => async (req, res, next) => {
    try {
    
        const parseResult = await schema.safeParseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        
        if (!parseResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                
                errors: parseResult.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        
        // console.log(parseResult.error.errors)
        
        // Overwrite the request objects with Zod's cleaned data (like the .toLowerCase() emails){Optional}
        if (parseResult.data.body) req.body = parseResult.data.body;
        if (parseResult.data.query) req.query = parseResult.data.query;
        if (parseResult.data.params) req.params = parseResult.data.params;

        
        next();
        
    } catch (error) {
        
        next(error); 
    }
};