import React, { useEffect, useState } from 'react';
import './home.css';
import { Link } from 'react-router-dom';

const MOCK_NOTIFICATIONS = [
    { id: 1, message: 'John Doe is now rank #1 in the leaderboard!', timestamp: '2 minutes ago' },
    { id: 2, message: 'You added Mike Jensen as a friend', timestamp: '5 minutes ago' },
    { id: 3, message: 'Peter Jones added a new catch', timestamp: '15 minutes ago' },
];

const getLocalData = (key, defaultValue) => {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
        console.error("Error reading from local storage", e);
        return defaultValue;
    }
};

export function Home({ userName, leaderboard }) {
    const [friendEmail, setFriendEmial] = useState('');
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [profilePicture, setProfilePicture] = useState(
        localStorage.getItem(`${userName}-profile-pic`) || '/placeholder.png'
    );
    
    useEffect(() => {
        document.title = 'OutFishn | Home';
    }, []);

    const handleFriendSubmit = (event) => {
        event.preventDefault();
        if (!friendEmail.trim) {
            alert("Please enter a friend's email.");
            return;
        }

        const newNotification = {
            id: Date.now(),
            message: `Friend request sent to ${friendEmail.trim()}. (MOCKED)`,
            timestamp: 'Just now',
        };

        setNotifications([newNotification, ...notifications]);
        alert(`MOCK: Friend request sent to ${friendEmail.trim()}!`);
        setFriendEmial('');
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
                                        <span className='timestamp'>{item.timestamp}</span>
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