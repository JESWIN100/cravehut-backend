// asyncHandler.js
export const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (err) {
        // Handle errors here, for example, check if the error is related to Joi validation
        if (err.isJoi) err.status = 408;
        res.status(err.status || 500).send({ status: false, message: err.message ,error:err || "Internal server error" });
    
        
    }
}; 