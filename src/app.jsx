import React, {useCallback, useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Signin } from './signin/signin';
import { Home } from './home/home';
import { Log } from './log/log';
import { Plan } from './plan/plan';
import { AuthState } from './signin/authState';



const calculateLeaderboard = (allCatches) => {
    const sortedCatches = [...allCatches].sort((a, b) => b.weight - a.weight);

    const leaderboard = sortedCatches.map((catchItem, index) => ({
        rank: index + 1,
        angler: catchItem.angler,
        species: catchItem.species,
        weight: catchItem.weight,
    }));

    return leaderboard.slice(0, 10);
};

function AppContent() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = useState(currentAuthState);

    const location = useLocation();
    const isSigninPage = location.pathname === '/';

    const [allCatches, setAllCatches] = useState([]);

    const leaderboard = calculateLeaderboard(allCatches);

    const [notifications, setNotifications] = useState([]);

    const signout = useCallback(async (silent = false) => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'DELETE',
            });

            if (response.status !== 204 && !silent) {
                console.error('Logout failed on server.');
            } 
        } catch (error) {
            if (!silent) console.error('Network error during logout: ', error);
        } finally {
            localStorage.removeItem('userName');
            setAuthState(AuthState.Unauthenticated);
            setUserName('');
            setAllCatches([]);
            setNotifications([]);
            navigate('/');
        }
    }, [navigate]);
    
    const fetchUserData = useCallback(async () => {
        try {
            let response = await fetch('/api/user');
            if (!response.ok) {
                throw new Error('Failed to fetch user data.');
            }
            const userData = await response.json();
            setUserName(userData.username);

            response = await fetch('/api/catches');
            if (response.ok) {
                const catches = await response.json();
                setAllCatches(catches);
            }
            
            if (notifications.length === 0) {
                setNotifications([{id: Date.now(), message: `Data loaded for ${userData.username}.`, timestamp: new Date().toISOString()}]);
            }
        } catch (error) {
            console.error('Error fetching initial data: ', error);
            await signout(true);
        }
    }, [notifications.length, signout]);

    useEffect(() => {
        if (authState === AuthState.Authenticated) {
            fetchUserData();
        }
    }, [authState, fetchUserData]);

    const handleNewCatch = useCallback(async (newCatch) => {
        try{
            const response = await fetch('/api/catch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCatch),
            });

            if (response.ok) {
                const savedCatch = await response.json();

                setAllCatches(prevCatches => {
                    const updatedCatches = [savedCatch, ...prevCatches];
                    const currentLeaderboard = calculateLeaderboard(updatedCatches);

                    const madeLeaderboard = currentLeaderboard.some(item => 
                        item.angler === savedCatch.angler && item.weight === savedCatch.weight
                    );
        
                    if (madeLeaderboard) {
                        const rank = currentLeaderboard.findIndex(item => item.angler === savedCatch.angler && item.weight === savedCatch.weight) + 1;
                        const notification = {
                            id: Date.now() + 1,
                            message: `${savedCatch.angler}'s new catch is now rank #${rank} in the leaderboard! 🏆`,
                            timestamp: new Date().toISOString(),
                        };
        
                        setNotifications(prevNotifs => [notification, ...prevNotifs]);
                    }
        
                    return updatedCatches;
                });
                return true;
            } else {
                console.error('Failed to log catch: ', response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Network error when logging catch: ', error);
            return false;
        }
        
    }, []);

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
                <Route
                    path='/home' 
                    element={<Home 
                        userName={userName} 
                        leaderboard={leaderboard}
                        notifications={notifications}
                        setNotifications={setNotifications}
                    />} 
                />
                <Route path='/log' element={<Log userName={userName} catches={allCatches} onCatchLogged={handleNewCatch} />} />
                <Route path='/plan' element={<Plan userName={userName}/>} />
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