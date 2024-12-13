import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import data from "../data.js";
import { isAdmin, isAuth } from "../utils.js";

const productRouter = express.Router();

productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    await Product.deleteMany({});
    const createProduct = await Product.insertMany(data.products);
    res.send({ createProduct });
  })
);
productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find();
    if (products) res.send(products);
  })
);

productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: "sample name"+ Date.now(),
      slug: "sample-slug" + Date.now(),
      image: "/images/p1.png" ,
      price: 0,
      category: "sample category",
      brand: "sample brand",
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: "sample description",
    });
    const newProduct = await product.save();
    res.send({ message: "Product Created", product: newProduct });
  })
);

productRouter.put(
    "/:id",
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const product= await Product.findById(req.params.id);
      if(product){
        product.name= req.body.name;
        product.slug= req.body.slug;
        product.price= req.body.price;
        product.category= req.body.category;
        product.brand= req.body.brand;
        product.image= req.body.image;
        product.countInStock= req.body.countInStock;
        product.description= req.body.description;
        const updateProduct = await product.save();
        res.send({ message: "Product Updated", product: updateProduct });
      }else{
        res.status(404).send({ message: "Product Not Found" });
      }
      
    })
  );

export default productRouter;
