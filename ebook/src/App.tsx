import React from "react";
import "./App.css";
import Book, { IBook } from "./components/Book";
import Upload from "./components/Upload";

function App() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [books, setBooks] = React.useState<IBook[]>();
  const [ temp, setTemp ] = React.useState<IBook[]>();

  function filterBooks(text): void {
    if (text === '') setBooks(temp);
    setBooks(temp?.filter(book => book.title.toLowerCase().includes(text.toLowerCase()) || book.author.toLowerCase().includes(text.toLowerCase()) || book.uploader.toLowerCase().includes(text.toLowerCase())));
  }

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_API as string}fetch-books`)
      .then((res) => res.json())
      .then((res: IBook[]) => {
        setBooks(res);
        setTemp(res);
      })
      .catch((err) => console.log(err));

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo">
          book<span>ie</span>
        </div>
        <input
          type="search"
          name="search-text"
          onChange={(e) => {
            filterBooks(e.currentTarget.value);
          }}
          className="search-box"
          placeholder="search ebook"
        />
      </header>
      <div className="body">
        {books &&
          books.map((book: IBook, index: number) => (
            <Book
              title={book.title}
              author={book.author}
              pages={book.pages}
              date={book.date}
              uploader={book.uploader}
              download={book.download}
              key={index}
            />
          ))}
        <button type="button" id="upload-btn" onClick={() => setOpen(!open)}>
          Upload EBook
        </button>
      </div>
      {open && <Upload setOpen={setOpen} open={open} setBooks={setBooks} />}
    </div>
  );
}

export default App;
