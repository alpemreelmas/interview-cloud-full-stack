import express from "express";
import {connection} from "./connection.js";
import cors from 'cors'

const port = 4000;

export const serveRest = async (data) => {
    const app = express();

    app.use(cors())

    app.get("/devices", async (_, res) => {
        const devicesWithAllData = await connection.raw("select d.id, d.name as device_name, u.admin as is_admin, u.email, (fv.major || '.' || fv.minor || '.' || fv.patch) as version, upt.last_update from devices d join users u on u.email = d.user_email join firmware_versions fv on d.firmware_version_id = fv.id left join ( select upt.device_id, MAX(upt.finished) as last_update from updates upt group by upt.device_id) upt on d.id = upt.device_id where u.subscription_ends >= current_timestamp")
        const lastFirmwareVersion = await connection.raw("select (firmware_versions.major || '.' || firmware_versions.minor || '.' || firmware_versions.patch) as latest_version from firmware_versions order by id desc limit 1")
        res.send({deviceWithAllData: devicesWithAllData, lastFirmwareVersion: lastFirmwareVersion[0].latest_version});
    });


    app.listen(port, () =>
        console.log(`REST Server ready at http://localhost:${port}`)
    );
};
