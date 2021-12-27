import React from 'react'

export interface IBook {
    title: string,
    author: string,
    pages: number,
    date: string,
    download?: string,
    uploader: string
}

function Book({title, author, pages, date, download, uploader}: IBook) {

    console.log(download);
    return (
        <div className="book">
            <div className="book-title">
                {title}
            </div>
            <div className="book-details">
                <p className="book-author">Author: <span>{author}</span></p>
                <p className="book-pages">Page(s): <span>{pages}</span></p>
                <p className="book-uploader">Upoaded By: <span>{uploader}</span></p>
                <p className="book-date">Date Upoaded: <span>{date}</span></p>
                <a href={download} className='download-btn' download>Download</a>
            </div>
        </div>
    )
}

export default Book
