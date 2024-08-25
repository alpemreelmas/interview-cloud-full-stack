import express from "express";
import cors from 'cors'
import {
    deviceHandlerWithPagination,
    deviceHandlerWithSortingAndPagination
} from "./controllers/deviceHandlers.js";
import registerExceptionHandler from "./controllers/registerExceptionHandler.js";

const port = 4000;

export const serveRest = async (data) => {
    const app = express();

    app.use(cors())

    app.get("/devices", deviceHandlerWithPagination);
    app.get("/devices-with-sorting", deviceHandlerWithSortingAndPagination);

    registerExceptionHandler(app);

    app.listen(port, () =>
        console.log(`REST Server ready at http://localhost:${port}`)
    );
};
