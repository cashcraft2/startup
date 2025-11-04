import React, {useCallback, useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Signin } from './signin/signin';
import { Home } from './home/home';
import { Log } from './log/log';
import { Plan } from './plan/plan';
import { AuthState } from './signin/authState';


const initialCatches = [
    { id: 101, photo: null, species: 'Largemouth Bass', length: 12.4, weight: 10.9, bait: 'None', catchTime: '2025-09-08T05:33', airTemp: 62.7, skyConditions: 'Partly Cloudy', location: {lat: 40, lng: -110}, notes: 'Early bird gets the worm.', angler: 'Jane Doe' },
    { id: 102, photo: null, species: 'Rainbow Trout', length: 10.8, weight: 9.6, bait: 'Power Bait', catchTime: '2025-09-23T16:33', airTemp: 65.8, skyConditions: 'Sunny', location: {lat: 41, lng: -112}, notes: 'Caught on East side of the reservoir.', angler: 'Mike Jensen' },
];

const initialNotifications = [
    {id: 1, message: "Welcome to OutFishn! Start logging your catches.", timestamp: new Date().toISOString()},
];

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

    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

    const location = useLocation();
    const isSigninPage = location.pathname === '/';

    const [allCatches, setAllCatches] = useState(
        JSON.parse(localStorage.getItem('fishLog')) || initialCatches
    );

    const leaderboard = calculateLeaderboard(allCatches);

    const [notifications, setNotifications] = useState(
        JSON.parse(localStorage.getItem('appNotifications')) || initialNotifications
    );

    useEffect(() => {
        localStorage.setItem('appNotifications', JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem('fishLog', JSON.stringify(allCatches));

    }, [allCatches]);

    const handleNewCatch = useCallback((newCatch) => {
        setAllCatches(prevCatches => {
            const updatedCatches = [newCatch, ...prevCatches];
            const currentLeaderboard = calculateLeaderboard(updatedCatches);
            const madeLeaderboard = currentLeaderboard.some(item => 
                item.angler === newCatch.angler && item.weight === newCatch.weight
            );

            if(madeLeaderboard) {
                const rank = currentLeaderboard.findIndex(item => item.weight === newCatch.weight) + 1;
                const notification = {
                    id: Date.now() + 1,
                    message: `${newCatch.angler}'s new catch is now rank #${rank} in the leaderboard! 🏆`,
                    timestamp: new Date().toISOString(),
                };

                setNotifications(prevNotifs => [notification, ...prevNotifs]);
            }

            return updatedCatches;
        });
    }, []);

    async function signout() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: DELETE,
            });

            if (response.status == 204) {
                localStorage.removeItem('userName');
                setAuthState(AuthState.Unauthenticated);
                setUserName('');
                navigate('/');
            } else {
                console.error('Logout failed on server but state reset anyway.');
                localStorage.removeItem('userName');
                setAuthState(AuthState.Unauthenticated);
                setUserName('');
                navigate('/');
            }
        } catch (error) {
            console.error('Network error during logout: ', error);
            localStorage.removeItem('userName');
            setAuthState(AuthState.Unauthenticated);
            setUserName('');
            navigate('/');
        }
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