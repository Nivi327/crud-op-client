import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import client from '../../API/client';
import './Signup.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handlesignup = (e) => {
        e.preventDefault();
        const emailRegex = new RegExp(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/, "gm")
        const isValidEmail = emailRegex.test(email);
        const passwordRegex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&]).{5,20}$/, "gm");
        const isPasswordValid = passwordRegex.test(password);
        if (!isValidEmail) {
            setError('Valid Email is Required');
            setTimeout(() => {
                setError('');
            }, 4000);
            return;
        }
        if (!isPasswordValid) {
            setError('Valid Password with length 5 to 20 and it should contain an uppercase letter, a lowercase letter, a dighit and some special characters is required.');
            setTimeout(() => {
                setError('');
            }, 4000);
            return;
        }
        client.post('/signup', {
            email,
            password,
        }).then((response) => {
            return response.data;
        }).then((result) => {
            if (result.result) {
                setMessage('Registration Successful.');
                setTimeout(() => {
                    navigate('/login');
                }, 500);
                return;
            }
            setError(result.err);
        }).catch((err) => {
            setError(err.message);
        })
    }

    return (
        <>
            <header>Signup</header>
            {message.length > 0 && <div className="signup">
                <span className="message">
                    <strong>{message}</strong>
                </span>
            </div>}
            {error.length > 0 && <div className='signup'>
                <span className='error'>
                    {error}
                </span>
            </div>}
            <form className="form">
                <div className="input-box">
                    <label>Email Address</label>
                    <input type="text" placeholder="Enter email address" required name="email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-box">
                    <label>Password</label>
                    <input type="password" placeholder="Enter password" required name="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button onClick={handlesignup}>Submit</button>
                <div className="signup">
                    <span className="signup">Had an account?
                        <label htmlFor="check"><Link to='/login'>Login</Link></label>
                    </span>
                </div>
            </form>
        </>
    )
}

export default Signup