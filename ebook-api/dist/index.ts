import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

dotenv.config();

const PORT: string | number = (process.env.PORT as string) || 5000;

interface IBook {
  title: string;
  author: string;
  pages: number;
  date: string;
  uploader: string;
  download: string;
}

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  pages: String,
  date: String,
  uploader: String,
  file: String
});

const BookModel = mongoose.model("Book", BookSchema);

function fetchEBooksFromDb(res: Response): void {
   BookModel.find({ current: true }, (err, books: IBook[]) => {
     if (err) {
      console.log(err);
      return;
     }

     res.json(books);
     res.end();
   });
}

app.get('/fetch-books', (req: Request, res: Response) => {
  fetchEBooksFromDb(res);
})

app.post("/upload-book", async (req: Request , res: Response) => {
  
  const book: IBook = {
    ...req.body
  };
  const newBook = new BookModel(book);

  await newBook.save();
 
  fetchEBooksFromDb(res);
});

app.listen(PORT, () => {

  // console.log(process.env.MONGO_URL);
  mongoose
    .connect(process.env.MONGO_URL as string)
    .then(() => console.log("Connected to MongoDB"))
    .catch(() => console.log("Connection failed"));

  console.log(`Server is running on port ${PORT}`);
});
