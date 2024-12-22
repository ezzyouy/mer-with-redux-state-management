import dotenv from 'dotenv'

dotenv.config()

export default{
    accessKeyId: process.env.AccessKeyId || "accessKeyId",
    secretAccessKey: process.env.Secret_Access_Key || "secretAccessKey",
}