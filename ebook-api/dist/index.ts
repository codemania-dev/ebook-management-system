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
  pages: number;
  date: string;
  uploader: string;
  download: string;
  dept: string;
  isVerified: boolean
}

const BookSchema = new mongoose.Schema({
  title: String,
  pages: String,
  date: String,
  uploader: String,
  download: String,
  dept: String,
  isVerified: Boolean
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

app.post("/admin-login", (req: Request, res: Response) => {
  if (req.body?.id === 'admin' && req.body?.password === 'password123') { res.send('Login successfull').status(200).end(); return }

  res.send('Incorrect details!').status(403).end();
})

app.get('/fetch-books', (req: Request, res: Response) => {
  fetchEBooksFromDb(res);
})

app.post("/upload-book", async (req: Request , res: Response) => {
  
  const book: IBook = {
    ...req.body,
    isVerified: false
  };
  const newBook = new BookModel(book);

  await newBook.save();
 
  fetchEBooksFromDb(res);
});

app.post("/update-book/:id", (req: Request , res: Response) => {
  
  const book: IBook = {
    ...req.body,
    isVerified: false
  };

  BookModel.findByIdAndUpdate(req.params.id.toString().trim(), {...book}, (err: any) => {
    if (err) throw err;
    fetchEBooksFromDb(res);
  })
  
});

app.get('/verify/:id', (req: Request, res: Response) => {
  BookModel.findByIdAndUpdate(req.params.id.toString().trim(), { isVerified: true }, (err: any) => {
    if (err) throw err;
    fetchEBooksFromDb(res);
  })
})

app.get('/delete-book/:id', async (req: Request, res: Response) => {

  const bookId = req.params.id.toString().trim();
  BookModel.findByIdAndDelete(bookId, (err: any) => {
      if (err) throw err;
      fetchEBooksFromDb(res);
  })
})

app.listen(PORT, () => {

  // console.log(process.env.MONGO_URL);
  mongoose
    .connect(process.env.MONGO_URL as string)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Connection failed", err));

  console.log(`Server is running on port ${PORT}`);
});
