import axios from 'axios';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [ passphrase, setPassphrase ] = useState("");
    const [ error, setError ] = useState();

    const navigate = useNavigate();

    function submit(e) {
        e.preventDefault();

        axios.post("http://127.0.0.1:8000/api/validate-passphrase", {
            passphrase: passphrase
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            localStorage.setItem("token", res.data.token);
            navigate("/admin");
        }).catch(e => {
            setError(e.response.data.error);
        });
    }

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={submit}>
                {error && <p className='error'>{error}</p>}
                <div>
                    <label htmlFor='passphrase'>Passphrase</label>
                    <input type='text' id='passphrase' value={passphrase} onChange={(e) => {setPassphrase(e.target.value)}} />
                </div>
                <button type='submit'>Submit</button>
            </form>
        </>
    )
}

export default Login