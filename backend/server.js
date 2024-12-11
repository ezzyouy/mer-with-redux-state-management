import express from "express";
import data from './data.js'
import dotenv from 'dotenv'
import mongoose from "mongoose";
import userRouter from "./routers/UserRouter.js";
import productRouter from "./routers/ProductRouter.js";
import orderRouter from "./routers/orderRouter.js";

dotenv.config()
const app = express();


mongoose.connect(process.env.MONGO_DB_URI)
.then(()=>{
    console.log(" mongoDb is connected");
    
}).catch((error)=>{
    console.log(error.message);
    
});
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

app.get("/", (req, res) => {
    res.send("Server is ready")
})

// eslint-disable-next-line no-unused-vars
app.use((err, req,res,next)=>{
    res.status(500).send({message:err.message});
})
const port = process.env.PORT || 5002
app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);

})