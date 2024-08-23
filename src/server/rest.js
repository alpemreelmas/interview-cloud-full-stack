import express from "express";
import {connection} from "./connection.js";

const port = 4000;

export const serveRest = (data) => {
  const app = express();

  app.get("/devices", async (_, res) => res.send(
    await connection.raw("select d.id, d.name, u.admin as is_admin from devices d join users u on u.email = d.user_email where u.subscription_ends >= current_timestamp")
  ));

  app.listen(port, () =>
    console.log(`REST Server ready at http://localhost:${port}`)
  );
};
