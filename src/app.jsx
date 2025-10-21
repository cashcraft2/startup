import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Signin } from './signin/signin';
import { Home } from './home/home';
import { Log } from './log/log';
import { Plan } from './plan/plan';
import { AuthState } from './signin/authState';


function AppContent() {
    const navigate = useNavigate();

    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

    const location = useLocation();
    const isSigninPage = location.pathname === '/';

    function signout() {
        localStorage.removeItem('userName');

        setAuthState(authState.Unauthenticated);
        setUserName('');

        navigate('/');
    }

    return (
        <div className="app-container">
            <header>
                <nav>
                    <menu>
                        {authState !== AuthState.Authenticated && (
                            <li className='nav-sign-in'>
                                <NavLink className="nav-sign-in" to="/">Sign In</NavLink>
                            </li>
                        )}
                        {authState === AuthState.Authenticated && (
                            <li className='nav-sign-in'>
                                <NavLink className="nav-sign-in" to="/" onClick={signout}>Sign Out</NavLink>
                            </li>
                        )}
                        {authState === AuthState.Authenticated && (
                            <li className='nav-sign-in'>
                                <NavLink className="nav-sign-in" to="home">Home</NavLink>
                            </li>
                        )}
                        {authState === AuthState.Authenticated && (
                            <li className='nav-sign-in'>
                                <NavLink className="nav-sign-in" to="log">Fish Log</NavLink>
                            </li>
                        )}
                        {authState === AuthState.Authenticated && (
                            <li className='nav-sign-in'>
                                <NavLink className="nav-sign-in" to="plan">Trip Planner</NavLink>
                            </li>
                        )}
                    </menu>
                </nav>
            </header>

            {!isSigninPage && (
                <div className="logo-placeholder">
                    <img src="/pics/logo/outfishn_logo_only.png" alt="OutFishin Logo"/>
                </div>
            )}

            <Routes>
                <Route 
                    path='/' 
                    element={
                        <Signin
                            AuthState={AuthState}
                            onAuthChange={(userName, authState) => {
                                setAuthState(authState);
                                setUserName(userName);
                            }}
                        />
                    } 
                    exact 
                />
                <Route path='/home' element={<Home userName={userName} />} />
                <Route path='/log' element={<Log />} />
                <Route path='/plan' element={<Plan />} />
                <Route path='*' element={<NotFound />} />
            </Routes>

            <footer>
                <div>
                    <span className="author"> Author: </span>
                    <NavLink to="https://github.com/cashcraft2/startup">Cotter Ashcraft</NavLink>
                </div>
            </footer>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}