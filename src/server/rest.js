import express from "express";
import {connection} from "./connection.js";
import cors from 'cors'

const port = 4000;

export const serveRest = (data) => {
  const app = express();

  app.use(cors())

  app.get("/devices", async (_, res) => res.send(
    await connection.raw("select d.id, d.name as device_name, u.admin as is_admin, u.email, d.firmware_version_id as device_firmware_version from devices d join users u on u.email = d.user_email where u.subscription_ends >= current_timestamp")
  ));

  app.listen(port, () =>
    console.log(`REST Server ready at http://localhost:${port}`)
  );
};
