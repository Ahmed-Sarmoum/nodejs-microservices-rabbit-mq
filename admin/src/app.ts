import * as express from "express";
import * as cors from "cors";
import { Request, Response } from "express";
import { createConnection } from "typeorm";
import { Product } from "./entity/Product";

//amqps://uupjjhlr:7a5KaROAFuN4c6vlz9gM2Pr1CSHmjX0S@gull.rmq.cloudamqp.com/uupjjhlr

createConnection().then((db) => {
  const productRepository = db.getRepository(Product);
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

  app.get("/api/products", async (req: Request, res: Response) => {
    const products = await productRepository.find();
    res.json(products);
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    const product = await productRepository.create(req.body);
    const result = await productRepository.save(product);

    return res.send(result);
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    const product = await productRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    res.json(product);
  });

  app.put("/api/products/:id", async (req: Request, res: Response) => {
    const product = await productRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    productRepository.merge(product, req.body);
    const result = await productRepository.save(product);

    return res.send(result);
  });

  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    const result = await productRepository.delete(req.params.id);

    return res.send(result);
  });

  app.post("/api/products/:id/like", async (req: Request, res: Response) => {
    const product = await productRepository.findOne({
      where: { id: Number(req.params.id) },
    });
    product.likes++;

    const result = await productRepository.save(product);
    return res.send(result);
  });

  console.log("server listening to port: 8000");

  app.listen(8000);
});
