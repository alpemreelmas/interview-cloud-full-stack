import express from "express";
import cors from 'cors'
import {deviceHandler} from "./handlers/deviceHandlers.js";
import registerExceptionHandler from "./handlers/registerExceptionHandler.js";

const port = 4000;

export const serveRest = async (data) => {
    const app = express();

    app.use(cors())

    app.get("/devices", deviceHandler);

    registerExceptionHandler(app);

    app.listen(port, () =>
        console.log(`REST Server ready at http://localhost:${port}`)
    );
};
