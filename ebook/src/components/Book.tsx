import React from 'react'

export interface IBook {
    _id: string,
    title: string,
    pages: number,
    date: string,
    download?: string,
    uploader: string,
    isVerified: boolean,
    dept: string
}

export interface BookParams {
    book: IBook,
    user: User,
    setBook: (book: IBook) => any,
    setBooks: (books: IBook[]) => any,
    setOpen: (state: boolean) => any
}

type User = 'visitor' | 'admin'

function Book(params: BookParams) {
    const { _id, title, pages, date, download, uploader, isVerified, dept } = params.book;
    const { user, setBook, setBooks, setOpen } = params;

    function deleteEBook(id: string): void {
        fetch(`${process.env.REACT_APP_API as string}delete-book/${id}`)
            .then((res) => res.json())
            .then((res: IBook[]) => {
                // set books
                setBooks(res);
            })
            .catch((err) => {
                console.log(err);
            });
        }

    function verifyEBook(id: string) {
        fetch(`${process.env.REACT_APP_API as string}verify/${id}`)
        .then((res) => res.json())
        .then((res: IBook[]) => {
            // set books
            setBooks(res);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
    return (
        <div className="book" style={{ backgroundColor: isVerified ? '#282c34' : "#bdb40f" }}>
            <div className="book-title">
                {title}
            </div>
            <div className="book-details">
                <p className="book-pages">Page(s): <span>{pages}</span></p>
                <p className="book-uploader">Upoaded By: <span>{uploader}</span></p>
                <p className="book-uploader">Level: <span>{dept}</span></p>
                <p className="book-date">Date Upoaded: <span>{date}</span></p>
                <a href={download} className='download-btn' target="_blank" rel="noopener noreferrer"  download>Download</a>
                <button className="download-btn" onClick={() => { setBook(params.book); setOpen(true) }}>
                    Edit
                </button>
                {user === 'admin' && !isVerified && <button type="button" className='download-btn' onClick={() => verifyEBook(_id)}>Verify</button>}
                {user === 'admin' && <button className="download-btn" onClick={() => deleteEBook(_id)}>Delete</button>}
                
            </div>
        </div>
    )
}

export default Book
