import React from 'react';
import './App.css';
import Book, {IBook} from './components/Book'

function App() {

  const books: IBook[] = [
    {
      title: 'The Art of War',
      author: 'Sun Tzu',
      pages: 654,
      date: '12/12/21',
      download: 'https://www.google.com',
      uploader: 'Jerry'
    },
    {
      title: 'Mayor of Casterbridge',
      author: 'J.R.R. Tolkien',
      pages: 701,
      date: '09/10/21',
      download: 'https://www.google.com',
      uploader: 'Jerry'
    },
    {
      title: 'Black Beauty',
      author: 'Morgan Freeman',
      pages: 443,
      date: '12/12/21',
      download: 'https://www.google.com',
      uploader: 'Jerry'
    },
    {
      title: 'After We Fell',
      author: 'Sharon Soboli',
      pages: 301,
      date: '12/12/21',
      download: 'https://www.google.com',
      uploader: 'Jerry'
    },
    {
      title: 'After We Colided',
      author: 'Sharon Soboli',
      pages: 373,
      date: '12/12/21',
      download: 'https://www.google.com',
      uploader: 'Jerry'
    },
    {
      title: 'Wolf of Wall Street',
      author: 'Terence Winter',
      pages: 899,
      date: '12/12/21',
      download: 'https://www.google.com',
      uploader: 'Jerry'
    },
    {
      title: 'Craved!',
      author: 'Morgan Rice',
      pages: 289,
      date: '12/12/21',
      download: 'https://www.google.com',
      uploader: 'Jerry'
    },
  ]

  return (
    <div className="App">
      <header className="App-header">
       <div className="logo">book<span>ie</span></div>
       <input type='search' name="search-text" id="" className="search-box" placeholder='search ebook' />
      </header>
      <div className="body">
        { books && books.map((book: IBook, index: number) => (<Book title={book.title} author={book.author} pages={book.pages} date={book.date} uploader={book.uploader} download={book.download} />)) } 
      </div>
    </div>
  );
}

export default App;
