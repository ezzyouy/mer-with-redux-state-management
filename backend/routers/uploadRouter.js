import multer from "multer";
import express from "express";
import { isAuth } from "../utils.js";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import config from "../config.js";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.padEnd());
  },
});

const upload = multer({ storage });

uploadRouter.post("/", isAuth, upload.single("files"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded" });
  }
  res.send(`${req.file.path}`);
});

const configuration = {
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
  region: "us-west-2",
};

const s3 = new S3Client(configuration);

const uploadS3 = multer({
  storage: multerS3({
    s3,
    bucket: "mern-2024-bucket",
    acl :"public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(req, file, cb) {
      cb(null, `uploads/${Date.now().toString()}_${file.originalname}`);
    },
  }),
});

console.log("UploadS3 ", uploadS3.single("file"));

uploadRouter.post("/s3", uploadS3.single("file"), (req, res) => {
  
  res.send(req.file.location);
});
export default uploadRouter;
