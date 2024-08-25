export function successResponse(res, status= 200, data = null, message = "Operation has been successfully") {
    res.send({
        is_error: false,
        data,
        message: message,
    }).status(status);
}

export function errorResponse(res, status= 200, data = null, message = "Operation has been failed") {
    res.send({
        is_error: true,
        data,
        message: message,
    }).status(status);
}