const validateGetAllPostsRequest = (req, res, next) => {
    const allowedParams = ['page', 'limit', 'sort', 'keyword', 'tag'];
    const requestParams = Object.keys(req.query);
    
    const invalidParams = requestParams.filter(param => !allowedParams.includes(param));
    
    if (invalidParams.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'BAD_REQUEST',
        message: `Invalid parameters: ${invalidParams.join(', ')}`
      });
    }
    
    next();
  };
  
  module.exports = {
    validateGetAllPostsRequest
  };