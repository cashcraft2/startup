import React, { useEffect, useState } from 'react';
import './home.css';
import { Link } from 'react-router-dom';

export function Home({ userName, leaderboard, notifications, setNotifications }) {
    const [friendEmail, setFriendEmial] = useState('');
    const [profilePicture, setProfilePicture] = useState(
        localStorage.getItem(`${userName}-profile-pic`) || '/placeholder.png'
    );
    
    useEffect(() => {
        document.title = 'OutFishn | Home';
    }, []);

    const handleFriendSubmit = (event) => {
        event.preventDefault();
        if (!friendEmail || friendEmail.trim().length === 0) {
            alert("Please enter a friend's email.");
            return;
        }

        const newNotification = {
            id: Date.now(),
            message: `Friend request sent to ${friendEmail.trim()} (MOCKED)`,
            timestamp: new Date().toISOString(),
        };

        setNotifications([newNotification, ...notifications]);
        alert(`MOCK: Friend request sent to ${friendEmail.trim()}!`);
        setFriendEmial('');
    };

    const formatTimestamp = (isoString) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return date.toLocaleDateString();
    };

    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
                localStorage.setItem(`${userName}-profile-pic`, reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

  return (
    <>
        <main>
            <div className="main-content-wrapper">
            
                <div className="left-column">
                
                    <div className="profile-section box-shadow-style">
                        <form id="profile-picture-form">
                            <img 
                                id="profile-picture-placeholder" 
                                src={profilePicture} 
                                alt="Profile Picture" 
                                width="150" 
                                height="150"
                            />
                            <label htmlFor="profile-picture-upload" className="button">
                                Change Profile Picture
                            </label>
                            <input 
                                type="file" 
                                id="profile-picture-upload" 
                                accept="image/*" 
                                className="d-none"
                                onChange={handleProfilePictureChange}
                            />
                        </form>

                        <div className="user">
                            Welcome, 
                            <span className="username"> {userName}</span>
                        </div>

                        <nav className="action-buttons">
                            <Link to="/log" className="button action-button">Fish Log</Link>
                            <Link to="/plan" className="button action-button">Plan a Trip</Link>
                        </nav>
                    </div>

                    <div className="add-friend-section box-shadow-style">
                        <h3>Add a Friend:</h3>
                        <form onSubmit={handleFriendSubmit}>
                            <div>
                                <span>Email: </span>
                                <input 
                                    type="text" 
                                    placeholder="their@email.com"
                                    value={friendEmail}
                                    onChange={(e) => setFriendEmial(e.target.value)} 
                                />
                            </div>
                            <button type="submit" className="button">Submit</button>
                        </form>
                    </div>
                </div>

                <div className="right-column">
                
                    <div className="leaderboard-section box-shadow-style">
                        <h2>Leaderboard</h2>
                        <table className="leaderboard">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Angler</th>
                                    <th>Species</th>
                                    <th>Weight (lbs)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((item) => (
                                    <tr key={item.rank}>
                                        <td>{item.rank}</td>
                                        <td>{item.angler}</td>
                                        <td>{item.species}</td>
                                        <td>{item.weight.toFixed(1)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="notifications-section box-shadow-style">
                        <h2>Notifications</h2>
                        <ul id="notification-list">
                            {notifications.map((item) => (
                                <li key={item.id} className='notification-item'>
                                    <div className='notification-content'>
                                        <p>{item.message}</p>
                                        <span className='timestamp'>{formatTimestamp(item.timestamp)}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    </>
  );
}