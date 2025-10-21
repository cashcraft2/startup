import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { AuthState } from './authState';


export function Signin() {
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');

    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayError, setDisplayError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'OutFishn';
    }, []);

    async function handleSignIn(event) {
        event.preventDefault();

        if (!signInEmail || !signInPassword) {
            setDisplayError("Please enter both email and password.");
            return;
        }

        // **Placeholder for API call**

        //Simulated sign-in:
        onAuthChange(signInEmail, AuthState.Authenticated);

        localStorage.setItem('userName', signInEmail);

        navigate('/home');

    }

  return (
    <main>
        <div className="outfishn-main-logo">
            <img src="/pics/logo/outfishn_cropped_logo.png" alt="OutFishn Logo"/>
        </div>
        <div className="register-sign-in">
            <div className="register-section">
                <h1>Register</h1>
                <form method="get" action="home.html">
                    <div>
                        <span>Email: </span>
                        <input type="text" placeholder="your@email.com" />
                    </div>
                    <div>
                        <span>Password: </span>
                        <input type="password" placeholder="password" />
                    </div>
                    <div>
                        <span>Confirm Password: </span>
                        <input type="password" placeholder="password" />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
            <div className="sign-in-section">
                <h1>Sign In</h1>
                <form method="get" action="home.html">
                    <div>
                        <span>Email: </span>
                        <input type="text" placeholder="your@email.com" />
                    </div>
                    <div>
                        <span>Password: </span>
                        <input type="password" placeholder="password" />
                    </div>
                    <button type="submit">Sign In</button>
                </form>
            </div>
        </div>
    </main>
  );
}