import {errorResponse} from "../utils.js";

export default function registerExceptionHandler(app){
    app.use((req, res, next) => {
        errorResponse(res, 404, "Not found");
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        errorResponse(res, 500, "Something went wrong");
    });
}