import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { AuthState } from './authState';


export function Signin({ onAuthChange, AuthState }) {
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

        // **Placeholder for Sign In API call**

        //Simulated sign-in:
        onAuthChange(signInEmail, AuthState.Authenticated);

        localStorage.setItem('userName', signInEmail);

        navigate('/home');
    }

    async function handleRegister(event) {
        event.preventDefault();

        if (!registerEmail || !registerPassword || !confirmPassword) {
            setDisplayError('All fields required for registration.');
            return;
        }

        if (registerPassword !== confirmPassword) {
            setDisplayError('Passwords do not match.');
            return;
        }

        //**Placeholder for Register API call**

        //Simulated user registration:
        onAuthChange(registerEmail, AuthState.Authenticated);

        localStorage.setItem('userName', registerEmail);

        navigate('/home');
    }



    return (
        <main>
            <div className="outfishn-main-logo">
                <img src="/pics/logo/outfishn_cropped_logo.png" alt="OutFishn Logo"/>
            </div>

            {displayError && (
                <div className='alert alert-problem' role='alert'>
                    {displayError}
                </div>
            )}

            <div className="register-sign-in">
                <div className="register-section">
                    <h1>Register</h1>
                    <form onSubmit={handleRegister}>
                        <div>
                            <span>Email: </span>
                            <input type="text" placeholder="your@email.com"
                                    value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                        </div>
                        <div>
                            <span>Password: </span>
                            <input type="password" placeholder="password"
                                    value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                        </div>
                        <div>
                            <span>Confirm Password: </span>
                            <input type="password" placeholder="password"
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <Button 
                            variant="primary"
                            type="submit"
                            disabled={!registerEmail || !registerPassword || ! confirmPassword}
                        >
                            Register
                        </Button>
                    </form>
                </div>
                <div className="sign-in-section">
                    <h1>Sign In</h1>
                    <form onSubmit={handleSignIn}>
                        <div>
                            <span>Email: </span>
                            <input type="text" placeholder="your@email.com"
                                    value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} />
                        </div>
                        <div>
                            <span>Password: </span>
                            <input type="password" placeholder="password"
                                    value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} />
                        </div>
                        <Button
                            variant="primary" 
                            type="submit"
                            disabled={!signInEmail || !signInPassword}
                        >
                            Sign In
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    );
}