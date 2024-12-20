import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import userRouter from "./routers/UserRouter.js";
import productRouter from "./routers/ProductRouter.js";
import orderRouter from "./routers/orderRouter.js";
import uploadRouter from "./routers/uploadRouter.js";

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log(" mongoDb is connected");
  })
  .catch((error) => {
    console.log(error.message);
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
app.get("/api/keys/google", (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY1 || "" });
});

app.use("/api/uploads", uploadRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.get("/", (req, res) => {
  res.send("Server is ready");
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});
const port = process.env.PORT || 5002;
app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
