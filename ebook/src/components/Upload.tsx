import React from 'react'

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

import { IBook } from './Book';
import storage from '../firebase';

function Upload({setOpen, open, setBooks, book}) {

    const [ title, setTitle ] = React.useState<string>('');
    const [dept, setDept] = React.useState<string>('');
    const [ pages, setPages ] = React.useState<number>(0);
    const [ uploader, setUploader ] = React.useState<string>('');
    const [ name, setName ] = React.useState<string>('');
    const [ message, setMessage ] = React.useState<string>('');
    const [ file, setFile ] = React.useState<File>();

  function checkFormat(name: string[]): boolean {
    return ['pdf'].includes(name.pop()?.toLocaleLowerCase() as string);
  }
  function selectFile(e: React.ChangeEvent<HTMLInputElement>): void {

    const file: File | undefined = e.target.files?.[0];

    if (!file || file === undefined) {
      setMessage('no file selected!')
      return;
    }

    if (file?.size && file?.size > 10_000_000) {
      setMessage('file too large!')
      return;
    }

    if (file?.name && !checkFormat(file?.name.split('.'))) {
      setMessage('wrong file format!')
      return;
    }

    setName(file?.name.slice(0, 25) as string + ((file?.name as string)?.length < 25 ? "" : "..."));

    setFile(file);

    return;
  }

    function clearInput(): void {
        setTitle('');
        setDept('');
        setPages(0);
        setUploader('');
    }

    function uploadEbook(): void {
        if ([ title, dept, uploader ].includes('') || pages === 0 || file === undefined) {
            setMessage('please fill out all fields!')
            return;
        }

        const fileRef = ref(storage, `${Date.now()}.pdf`);

        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {setMessage("Saving...");},
          (error) => {
            setMessage('Error occurred!');
            return;
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              
                fetch(`${process.env.REACT_APP_API as string}upload-book`, {
                  method: "POST",
                  body: JSON.stringify({
                    title,
                    dept,
                    pages: pages.toString(),
                    uploader,
                    download: downloadURL,
                    date: new Date(Date.now()).toLocaleDateString(),
                  }),
                  headers: { "Content-Type": "application/json" },
                })
                  .then((res) => res.json())
                  .then((res: IBook[]) => {
                    // set books
                    setBooks(res);
                    clearInput();
                    setOpen(!open);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
            });
          }
        );

    }

  function updateEbook(): void {

    if ([title, dept, uploader].includes('') || pages === 0) {
      setMessage('please fill out all fields!')
      return;
    }

    fetch(`${process.env.REACT_APP_API as string}update-book/${book._id}`, {
      method: "POST",
      body: JSON.stringify({
        title,
        dept,
        pages: pages.toString(),
        uploader
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res: IBook[]) => {
        // set books
        setBooks(res);
        clearInput();
        setOpen(!open);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  React.useState(() => {
    if (book) {
      setTitle(book.title);
      setDept(book.dept);
      setPages(book.pages);
      setUploader(book.uploader);
    }
  })

    return (
      <div className="upload-container">
        <h1 className="upload-heading">{book ? "Update" : "Upload"} EBook</h1>
        <input
          type="text"
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <input
          type="number"
          placeholder="number of pages"
          onChange={(e) => setPages(parseInt(e.target.value.toString()))}
          value={pages as number}
        />
        <select name="" id="" onChange={(e) => setDept(e.target.value)}>
          <option value="" hidden disabled selected>
            Level
          </option>
          <option value="ND1">ND1</option>
          <option value="ND2">ND2</option>
        </select>
        <input
          type="text"
          placeholder="your name"
          onChange={(e) => setUploader(e.target.value)}
          value={uploader}
        />
        {!book && (
          <label htmlFor="file-upload" >
            {name ? name : "select file [pdf <= 10mb]"}
          </label>
        )}
        <input
          type="file"
          id="file-upload"
          onChange={selectFile}
          hidden={true}
        />

        {!book ? (
          <button type="button" onClick={() => uploadEbook()}>
            Upload
          </button>
        ) : (
          <button type="button" onClick={() => updateEbook()}>
            Update
          </button>
        )}

        <button type="button" onClick={() => clearInput()}>
          Clear
        </button>
        <button
          type="button"
          className="close-btn"
          onClick={() => setOpen(!open)}
        >
          close
        </button>

        <p className="message">{message}</p>
      </div>
    )
}

export default Upload
