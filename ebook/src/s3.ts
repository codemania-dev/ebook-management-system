import {S3Client} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: process.env.REACT_APP_ENDPOINT,
  region: 'nyc3',
  credentials: {
    accessKeyId: process.env.REACT_APP_KEY as string,
    secretAccessKey: process.env.REACT_APP_SECRET as string
  }
})

export default s3Client;