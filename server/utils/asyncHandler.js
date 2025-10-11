const asyncHandler = (request) => (req, res, next) => {
    Promise.resolve(request(req, res, next)).catch(next);
};

export default asyncHandler;
