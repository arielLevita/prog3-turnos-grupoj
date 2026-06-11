export const validateContentType = (req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const contentType = req.headers['content-type'] || '';
        if (!contentType.includes('application/json') && !contentType.includes('multipart/form-data')) {
            return res.status(415).json({ 
                estado: false, 
                msg: 'Content-Type debe ser application/json o multipart/form-data' 
            });
        }
    }
    next();
}; 