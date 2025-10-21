import React, { useEffect, useState } from 'react';
import './home.css';
import { Link } from 'react-router-dom';

const MOCK_LEADERBOARD = [
    { rank: 1, angler: 'John Doe', species: 'Largemouth Bass', weight: 16.3 },
    { rank: 2, angler: 'Jane Doe', species: 'Largemouth Bass', weight: 15.1 },
    { rank: 3, angler: 'Peter Jones', species: 'Rainbow Trout', weight: 14.8 },
    { rank: 4, angler: 'Mike Jensen', species: 'Rainbow Trout', weight: 14.3 },
    { rank: 5, angler: 'Josh Holmes', species: 'Striped Bass', weight: 12.9 },
    { rank: 6, angler: 'Daman Rodriguez', species: 'Brown Trout', weight: 12.6 },
    { rank: 7, angler: 'Nick Brown', species: 'Rainbow Trout', weight: 10.8 },
    { rank: 8, angler: 'Mike Jensen', species: 'Channel Catfish', weight: 8.7 },
    { rank: 9, angler: 'John Doe', species: 'Smallmouth Bass', weight: 8.6 },
    { rank: 10, angler: 'Josh Holmes', species: 'Striped Bass', weight: 7.5 },
];

const MOCK_NOTIFICATIONS = [
    { id: 1, message: 'John Doe is now rank #1 in the leaderboard!', timestamp: '2 minutes ago' },
    { id: 2, message: 'You added Mike Jensen as a friend', timestamp: '5 minutes ago' },
    { id: 3, message: 'Peter Jones added a new catch', timestamp: '15 minutes ago' },
];

export function Home() {

    useEffect(() => {
        document.title = 'OutFishn | Home';
    }, []);

  return (
    <>
        <main>
            <div className="main-content-wrapper">
            
                <div className="left-column">
                
                    <div className="profile-section box-shadow-style">
                        <form id="profile-picture-form">
                            <img id="profile-picture-placeholder" src="/placeholder.png" alt="Profile Picture" width="150" height="150"/>
                            <label for="profile-picture-upload" className="button">
                                Change Profile Picture
                            </label>
                            <input type="file" id="profile-picture-upload" accept="image/*" className="d-none"/>
                        </form>

                        <div className="user">
                            Welcome,
                            <span className="username">[Username]</span>
                        </div>

                        <nav className="action-buttons">
                            <Link to="/log" className="button action-button">Fish Log</Link>
                            <Link to="/plan" className="button action-button">Plan a Trip</Link>
                        </nav>
                    </div>

                    <div className="add-friend-section box-shadow-style">
                        <h3>Add a Friend:</h3>
                        <form id="add-friend">
                            <div>
                                <span>Email: </span>
                                <input type="text" placeholder="their@email.com" />
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
                                <tr><td>1</td><td>John Doe</td><td>Largemouth Bass</td><td>16.3</td></tr>
                                <tr><td>2</td><td>Jane Doe</td><td>Largemouth Bass</td><td>15.1</td></tr>
                                <tr><td>3</td><td>Peter Jones</td><td>Rainbow Trout</td><td>14.8</td></tr>
                                <tr><td>4</td><td>Mike Jensen</td><td>Rainbow Trout</td><td>14.3</td></tr>
                                <tr><td>5</td><td>Josh Holmes</td><td>Striped Bass</td><td>12.9</td></tr>
                                <tr><td>6</td><td>Daman Rodriguez</td><td>Brown Trout</td><td>12.6</td></tr>
                                <tr><td>7</td><td>Nick Brown</td><td>Rainbow Trout</td><td>10.8</td></tr>
                                <tr><td>8</td><td>Mike Jensen</td><td>Channel Catfish</td><td>8.7</td></tr>
                                <tr><td>9</td><td>John Doe</td><td>Smallmouth Bass</td><td>8.6</td></tr>
                                <tr><td>10</td><td>Josh Holmes</td><td>Striped Bass</td><td>7.5</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="notifications-section box-shadow-style">
                        <h2>Notifications</h2>
                        <ul id="notification-list">
                            <li className="notification-item">
                                <div className="notification-content">
                                    <p>John Doe is now rank #1 in the leaderboard!</p>
                                    <span className="timestamp"> 2 minutes ago</span>
                                </div>
                            </li>
                            <li className="notification-item">
                                <div className="notification-content">
                                    <p>You added Mike Jensen as a friend</p>
                                    <span className="timestamp"> 5 minutes ago</span>
                                </div>
                            </li>
                            <li className="notification-item">
                                <div className="notification-content">
                                    <p>Peter Jones added a new catch</p>
                                    <span className="timestamp"> 15 minutes ago</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    </>
  );
}