import React from 'react'    
    
function AdminLogin({ setLogin, setUser, login }: any) {
    const [ id, setID ] = React.useState<string>('');
    const [ password, setPassword ] = React.useState<string>('');
    const [ message, setMessage ] = React.useState<string>('');
    
    function clearInput(): void {
        setID('');
        setPassword('');
    }

    function loginAdmin(): void {
        fetch(`${process.env.REACT_APP_API as string}admin-login`, {
            method: "POST",
            body: JSON.stringify({
                id,
                password
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => {
                if (res.status === 403) {
                    setMessage('Invalid credentials!')
                    return;
                }
                setMessage('Login successfull!');
                clearInput();
                setUser('admin');
                setLogin(!login);
            })
            .catch((err) => {
                setMessage('Login error!')
                console.log(err);
            });
    }


    return (
        <div className="upload-container">
            <h1 className="upload-heading">Admin Login</h1>
            <input type="text" placeholder='admin id' onChange={e => setID(e.target.value)} value={id} />
            <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)} value={password} />

            <button type='button' onClick={() => loginAdmin()}>Continue</button>
            <button type='button' onClick={() => clearInput()}>Clear</button>
            <button type='button' className='close-btn' onClick={() => setLogin(!login)}>close</button>

            <p className="message">{ message }</p>

        </div>
    )
}

export default AdminLogin
