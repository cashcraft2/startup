import React, { useEffect, useState } from 'react';
import './home.css';
import { Link } from 'react-router-dom';

function FriendRequestItem({ request, onAction, setNotifications }) {
    const handleAction = async (action) => {
        const endpoint = `/api/friends/${action}/${request.senderUsername}`;

        try {
            const response = await fetch(endpoint, { method: 'POST' });

            if (response.ok) {
                const result = await response.json();
                onAction(request.senderUsername, action);

                const message = `${request.senderUsername}'s request was ${action}ed.`;
                setNotifications(prev => [{id: Date.now(), message, timestamp: new Date().toISOString()}, ...prev]);
            } else {
                alert(`Failed to ${action} request: Server error.`);
            }
        } catch (error) {
            console.error(`Network error during ${action} request:`, error);
            alert('A network error occurred while processing the request.');
        }
    };

    return (
        <li key={request.id} className='notification-item friend-request-item'>
            <div className='notification-content'>
                <p>
                    Friend request from <strong>{request.senderUsername}</strong>
                </p>
                <span className='timestamp'>Received: {new Date(request.timestamp).toLocaleDateString()}</span>
            </div>
            <div className='request-actions'>
                <button
                    onClick={() => handleAction('accept')}
                    className='button btn-accept'
                >
                    Accept
                </button>
                <button
                    onClick={() => handleAction('decline')}
                    className='button btn-decline'
                >
                    Decline
                </button>
            </div>
        </li>
    );
}



export function Home({ userName, leaderboard, notifications, setNotifications, pendingRequests, setPendingRequests, onLeaderboardTypeChange }) {
    const [friendEmail, setFriendEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState(
        localStorage.getItem(`${userName}-profile-pic`) || '/placeholder.png'
    );

    const [friends, setFriends] = useState([]);

    const [leaderboardType, setLeaderboardType] = useState('global');

    const handleRemoveFriend = async (friendUsername) => {
        if (!window.confirm(`Are you sure you want to remove ${friendUsername} as a friend?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/friends/${friendUsername}`, {
                method: 'DELETE',
            });

            if (response.status === 204) {
                setFriends(prevFriends => prevFriends.filter(name => name !== friendUsername));

                const newNotification = {
                    id: Date.now() + 1,
                    message: `${friendUsername} has been removed from your friends list.`,
                    timestamp: new Date().toISOString(),
                };
                setNotifications(prevNotifs => [newNotification, ...prevNotifs]);

            } else {
                alert(`Failed to remove friend: Server error.`);
            }
        } catch (error) {
            console.error('Network error removing friend: ', error);
            alert('A network error occurred while removing the friend.');
        }
    };

    const fetchFriends = async () => {
        try {
            const response = await fetch('/api/friends');
            if (response.ok) {
                const friendList = await response.json();
                setFriends(friendList);
            } else {
                console.error("Failed to fetch friends list.");
            }
        } catch (error) {
            console.error("Network error fetching friends:", error);
        }
    };
    
    useEffect(() => {
        document.title = 'OutFishn | Home';
        fetchFriends();
    }, [userName]);

    const handleRequestAction = (senderUsername, action) => {
        setPendingRequests(prev => prev.filter(req => req.senderUsername !== senderUsername));

        if (action === 'accept') {
            fetchFriends(); // Refresh friends list if accepted
        }
    };

    const handleLeaderboardTypeChange = (newType) => {
        setLeaderboardType(newType);
        if (onLeaderboardTypeChange) {
            onLeaderboardTypeChange(newType);
        }
    };

    const handleFriendSubmit = async (event) => {
        event.preventDefault();
        const friendEmailTrimmed = friendEmail.trim();

        if (!friendEmailTrimmed || friendEmailTrimmed.length === 0) {
            alert("Please enter a friend's email.");
            return;
        }

        try{
            const response = await fetch('/api/friend/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendEmail: friendEmailTrimmed }),
            });

            const result = await response.json();

            if (response.ok) {
                const newNotification = {
                    id: Date.now(),
                    message: `Friend request sent to ${friendEmailTrimmed}!`,
                    timestamp: new Date().toISOString(),
                };

                setNotifications([newNotification, ...notifications]);
                alert(`Friend request successfully sent!`);
                setFriendEmail('');
            } else if (response.status === 404) {
                alert(`Error: ${result.msg}`);
            } else {
                alert(`Failed to send request: ${result.msg || 'Server Error'}`);
            }
        } catch (error) {
            console.error('Network error while sending friend request: ', error);
            alert('A network error occurred. Please try again.');
        }
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
                                    onChange={(e) => setFriendEmail(e.target.value)} 
                                />
                            </div>
                            <button type="submit" className="button">Submit</button>
                        </form>
                    </div>
                </div>

                <div className="right-column">
                
                    <div className="leaderboard-section box-shadow-style">
                        <h2>Leaderboard</h2>
                        <div className="leaderboard-toggle">
                            <button
                                className={`button leaderboard-btn ${leaderboardType === 'global' ? 'active-type' : ''}`}
                                onClick={() => handleLeaderboardTypeChange('global')}
                            >
                                Global
                            </button>
                            <button
                                className={`button leaderboard-btn ${leaderboardType === 'friends' ? 'active-type' : ''}`}
                                onClick={() => handleLeaderboardTypeChange('friends')}
                                disabled={friends.length === 0} 
                            >
                                Friends
                            </button>
                            {friends.length === 0 && leaderboardType === 'friends' && (
                                <span className='no-friends-warning'>Add friends to view friend leaderboard.</span>
                            )}
                        </div>
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
                                        <td>{item.weight}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="notifications-section box-shadow-style">
                        {pendingRequests && pendingRequests.length > 0 && (
                            <>
                                <h2>Pending Requests ({pendingRequests.length})</h2>
                                <ul id="friend-request-list">
                                    {pendingRequests.map(request => (
                                        <FriendRequestItem
                                            key={request.id}
                                            request={request}
                                            onAction={handleRequestAction}
                                            setNotifications={setNotifications}
                                        />
                                    ))}
                                </ul>
                                <hr style={{margin: '1em 0'}} />
                            </>
                        )}

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

                    <div className="friends-list-section box-shadow-style">
                        <h2 className="friends-header">My Friends ({friends.length})</h2>
                        <ul className="friends-list">
                            {friends.length > 0 ? (
                                friends.map((friendName, index) => (
                                    <li key={index} className="friend-item friend-item-with-button">
                                        <span>{friendName}</span>
                                        <button 
                                            className="button btn-remove-friend"
                                            onClick={() => handleRemoveFriend(friendName)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="no-friends-msg">
                                    No friends yet. Send a request!
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    </>
  );
}