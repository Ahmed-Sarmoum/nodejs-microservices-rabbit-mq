import * as express from "express";
import * as cors from "cors";
import { createConnection } from "typeorm";

createConnection().then((db) => {
  const app = express();
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://localhost:4200",
      ],
    })
  );
  app.use(express.json());

  console.log("server listening to port: 8001");

  app.listen(8001);
});
