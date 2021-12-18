import React from 'react'

function Upload({setOpen, open}) {

    const [ title, setTitle ] = React.useState<string>('');
    const [ author, setAuthor ] = React.useState<string>('');
    const [ pages, setPages ] = React.useState<number>(0);
    const [ uploader, setUploader ] = React.useState<string>('');
    const [ name, setName ] = React.useState<string>('');
    const [ message, setMessage ] = React.useState<string>('');

    function selectFile(e: React.ChangeEvent<HTMLInputElement>): File | null {
       const file: File = e.target.files?.[0] as File;

       if (!file) {
           setMessage('no file selected!')
           return null;
       }

       if (file?.size && file?.size > 10_000_000) {
           setMessage('file too large!')
           return null;
       }
       if (file?.name && ![ 'pdf', "PDF" ].includes(file?.name.split('.').at(-1) as string)) {
           setMessage('wrong file format!')
           return null;
       }

       setName(file?.name.split('.').at(0)?.slice(0, 25) as string + ((file?.name.split('.').at(0) as string)?.length < 25 ? "" : "..."));

       return file;
    }

    function clearInput(): void {
        setTitle('');
        setAuthor('');
        setPages(0);
        setUploader('');
    }

    function uploadEbook(): void {

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
