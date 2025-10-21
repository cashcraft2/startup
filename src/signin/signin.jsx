import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { AuthState } from './authState';


export function Signin({ onAuthChange, AuthState }) {
    const [signInUsername, setSignInUsername] = useState('');
    const [signInPassword, setSignInPassword] = useState('');

    const [registerEmail, setRegisterEmail] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayError, setDisplayError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'OutFishn';
    }, []);

    async function handleSignIn(event) {
        event.preventDefault();

        if (!signInUsername || !signInPassword) {
            setDisplayError("Please enter both username and password.");
            return;
        }

        // **Placeholder for Sign In API call**

        //Simulated sign-in:
        onAuthChange(signInUsername, AuthState.Authenticated);

        localStorage.setItem('userName', signInUsername);

        navigate('/home');
    }

    async function handleRegister(event) {
        event.preventDefault();

        if (!registerEmail || !registerUsername || !registerPassword || !confirmPassword) {
            setDisplayError('All fields required for registration.');
            return;
        }

        if (registerPassword !== confirmPassword) {
            setDisplayError('Passwords do not match.');
            return;
        }

        //**Placeholder for Register API call**

        //Simulated user registration:
        onAuthChange(registerUsername, AuthState.Authenticated);

        localStorage.setItem('userName', registerUsername);

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
                            <span>Create Username: </span>
                            <input type="text" placeholder='Username324'
                                    value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} />
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
                            disabled={!registerEmail || !registerUsername || !registerPassword || ! confirmPassword}
                        >
                            Register
                        </Button>
                    </form>
                </div>

                <div className="sign-in-section">
                    <h1>Sign In</h1>
                    <form onSubmit={handleSignIn}>
                        <div>
                            <span>Username: </span>
                            <input type="text" placeholder="Username324"
                                    value={signInUsername} onChange={(e) => setSignInUsername(e.target.value)} />
                        </div>
                        <div>
                            <span>Password: </span>
                            <input type="password" placeholder="password"
                                    value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} />
                        </div>
                        <Button
                            variant="primary" 
                            type="submit"
                            disabled={!signInUsername || !signInPassword}
                        >
                            Sign In
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    );
}