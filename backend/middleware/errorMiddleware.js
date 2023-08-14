const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    return res.status(statusCode).json({
        success: false,
        message: error.message,
        statusCode,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack
    })
}

const notFound = (req, res, next) => {
    const error = new Error(`Route does not exist - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

export { errorHandler, notFound }