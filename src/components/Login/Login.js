import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Login.css';
import client from '../../API/client';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const onHandleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        client.post('/login', {
            email,
            password
        }).then((response) => {
            return response.data;
        }).then((data) => {
            if (data.err) {
                setHasError(true);
                setError(data.err);
                setTimeout(() => {
                    setHasError(false);
                }, 4000);
                setIsLoading(false);
                return;
            } else if (data.token) {
                const token = data?.token;
                const result = data?.result[0];
                if (!token || !result) {
                    setHasError(true);
                    setError("Invalid Email and Password");
                    setTimeout(() => {
                        setHasError(false);
                    }, 4000);
                    setIsLoading(false);
                    return;
                }
                localStorage.setItem('auth', JSON.stringify({
                    login: true,
                    token: token
                }));
                return result.id;
            }
        }).then((id) => {
            if (id) {
                setError(false);
                document.getElementById('email').value = '';
                setEmail('');
                document.getElementById('password').value = '';
                setPassword('');
                setIsLoading(false);
                navigate(`/home/${id}`);
            }
        }).catch(err => {
            setIsLoading(false);
            setError(err.message);
        });
    }

    return (
        <div className="login form">
            <header>Login</header>
            {hasError && <div className="signup">
                <span className="error">{error}</span>
            </div>}
            <form>
                <input type="text" id="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" id="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                <Link to='/reset-password'>Forgot password?</Link>
                <input type="button" className="button" defaultValue="Login" onClick={onHandleSubmit} />
            </form>
            <div className="signup">
                <span className="signup">Don't have an account?
                    <label htmlFor="check"><Link to='/'>SignUp</Link></label>
                </span>
            </div>
        </div>
    )
}

export default Login