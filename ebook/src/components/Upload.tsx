import React from 'react'

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

import { IBook } from './Book';
import storage from '../firebase';

function Upload({setOpen, open, setBooks}) {

    const [ title, setTitle ] = React.useState<string>('');
    const [ author, setAuthor ] = React.useState<string>('');
    const [ pages, setPages ] = React.useState<number>(0);
    const [ uploader, setUploader ] = React.useState<string>('');
    const [ name, setName ] = React.useState<string>('');
    const [ message, setMessage ] = React.useState<string>('');
    const [ file, setFile ] = React.useState<File>();

    function selectFile(e: React.ChangeEvent<HTMLInputElement>): void {
       const file: File = e.target.files?.[0] as File;

       if (!file) {
           setMessage('no file selected!')
           return;
       }

       if (file?.size && file?.size > 10_000_000) {
           setMessage('file too large!')
           return;
       }
       if (file?.name && ![ 'pdf', "PDF" ].includes(file?.name.split('.').at(-1) as string)) {
           setMessage('wrong file format!')
           return;
       }

       setName(file?.name.split('.').at(0)?.slice(0, 25) as string + ((file?.name.split('.').at(0) as string)?.length < 25 ? "" : "..."));

        setFile(file);

       return;
    }

    function clearInput(): void {
        setTitle('');
        setAuthor('');
        setPages(0);
        setUploader('');
    }

    function uploadEbook(): void {
        if ([ title, author, uploader ].includes('') || pages === 0 || file === undefined) {
            setMessage('please fill out all fields!')
            return;
        }

        const fileRef = ref(storage, `${Date.now()}.pdf`);

        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            setMessage('Error occurred!');
            return;
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              
                fetch('http://localhost:5000/upload-book', {
                    method: 'POST',
                    body: JSON.stringify({
                        title,
                        author,
                        pages: pages.toString(),
                        uploader,
                        download: downloadURL,
                        date: new Date(Date.now()).toLocaleDateString()
                    }),
                    headers: {"Content-Type": "application/json"}
                })
                .then((res) => res.json())
                .then((res: IBook[]) => {
                    // set books
                    setBooks(res);
                    clearInput();
                    setOpen(!open);
                })
                .catch(err => {console.log(err)})
            });
          }
        );

    }

    return (
        <div className="upload-container">
            <h1 className="upload-heading">Upload EBook</h1>
            <input type="text" placeholder='title' onChange={e => setTitle(e.target.value)} value={title} />
            <input type="text" placeholder="author's name" onChange={e => setAuthor(e.target.value)} value={author} />
            <input type="number" placeholder='number of pages' onChange={e => setPages(parseInt(e.target.value.toString()))} value={pages as number}/>
            <input type="text" placeholder='your name' onChange={e => setUploader(e.target.value)} value={uploader} />
            <label htmlFor="file-upload">{ name ? name : 'select file [pdf <= 10mb]' }</label>
            <input type="file" id="file-upload" onChange={selectFile} accept='.pdf, .PDF' hidden={true}/>

            <button type='button' onClick={() => uploadEbook()}>Upload</button>
            <button type='button' onClick={() => clearInput()}>Clear</button>
            <button type='button' className='close-btn' onClick={() => setOpen(!open)}>close</button>

            <p className="message">*{ message }</p>

        </div>
    )
}

export default Upload
