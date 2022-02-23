import React from "react";
import "./App.css";
import Book, { IBook } from "./components/Book";
import Upload from "./components/Upload";
import AdminLogin from './components/AdminLogin'


type User = 'visitor' | 'admin';

function App() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [login, setLogin] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<User>('visitor');
  const [books, setBooks] = React.useState<IBook[]>();
  const [ temp, setTemp ] = React.useState<IBook[]>();
  const [book, setBook] = React.useState<IBook | null>(null);

  function filterBooks(text): void {
    if (text === '') setBooks(temp);
    setBooks(temp?.filter(book => book.title.toLowerCase().includes(text.toLowerCase()) || book.dept.toLowerCase().includes(text.toLowerCase()) || book.uploader.toLowerCase().includes(text.toLowerCase())));
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
        {books && user === 'visitor' &&
          books.filter(book => book.isVerified === true).reverse().map((book: IBook, index: number) => (
            <Book
              book={book}
              user={user}
              setOpen={setOpen}
              setBook={setBook}
              setBooks={setBooks}
              key={index}
            />
          ))}
        {books && user === 'admin' && books.reverse().map((book: IBook, index: number) => (
            <Book
              book={book}
              user={user}
              setOpen={setOpen}
              setBook={setBook}
              setBooks={setBooks}
              key={index}
            />
          ))}
        <button type="button" id="upload-btn" onClick={() => setOpen(!open)}>
          Upload EBook
        </button>
        { user === 'visitor' && <button type="button" id="upload-btn1" onClick={() => setLogin(!login)}>Login as Admin</button> }
      </div>
      {open && <Upload setOpen={setOpen} open={open} setBooks={setBooks} book={book} />}
      {login && <AdminLogin setLogin={setLogin} login={login} setUser={setUser} />}
    </div>
  );
}

export default App;
