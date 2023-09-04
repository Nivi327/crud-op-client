import React, { useState } from 'react';
import './FP.css';

import { Link, useNavigate } from 'react-router-dom';
import client from '../../API/client';

const FP = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const [updated, isUpdated] = useState(false);

    const naviagte = useNavigate();

    const onChnagePassword = () => {
        if (password !== confirmPassword) {
            setHasError(true);
            setError('Passwords not matched');
            return;
        }
        client.post('/login/reset-password', {
            email,
            password
        }).then((response) => {
            return response.data;
        }).then((result) => {
            if (result.err) {
                setHasError(true);
                setError(result.err);
                setTimeout(() => {
                    setHasError(false);
                }, 4000);
            } else if (result.result) {
                const res = result.result;
                isUpdated(true);
                setError(false);
                document.getElementById('email').value = '';
                setEmail('');
                document.getElementById('password').value = '';
                setPassword('');
                document.getElementById('confirmPassword').value = '';
                setConfirmPassword('');
                setTimeout(() => {
                    isUpdated(false);
                }, 4000);
                naviagte('/login');
            }
        }).catch(err => console.log(err));
    }

    return (
        <div className="login form">
            <header>Reset Password</header>
            {hasError && <div className="signup">
                <span className="error">{error}</span>
            </div>}
            {updated && <div>
                <span className="success">Password updated successfully.</span>
            </div>}
            <form>
                <input type="text" id="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" id="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                <input type="password" id="confirmPassword" placeholder="Confirm your password" onChange={(e) => setConfirmPassword(e.target.value)} />
                <input type="button" className="button" defaultValue="Reset Password" onClick={onChnagePassword} />
            </form>
            <div className="signup">
                <span className="signup">Got Your Password?
                    <label htmlFor="check"><Link to='/login'>Login</Link></label>
                </span>
            </div>
        </div>
    )
}

export default FP;