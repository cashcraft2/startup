import React, { useEffect, useState } from 'react';
import './plan.css'


export function Plan({ userName }) {
    const [tripName, setTripName] = useState('');
    const [tripLocation, setTripLocation] = useState('');
    const [tripDate, setTripDate] = useState('');
    const [tripGuests, setTripGuests] = useState('');
    const [tripNotes, setTripNotes] = useState('');

    const [trips, setTrips] = useState([]);

    const fetchTrips = async () => {
        try {
            const response = await fetch('/api/trip/user'); 
            if (response.ok) {
                const data = await response.json();
                const mappedTrips = data.map(trip => ({ ...trip, id: trip._id }));
                setTrips(mappedTrips);
            } else if (response.status === 401) {
                console.error("User not authorized or logged out.");
                setTrips([]);
            } else {
                console.error("Failed to fetch trips:", response.statusText);
            }
        } catch (e) {
            console.error("Error fetching trips:", e);
        }
    };

    useEffect(() => {
        document.title = 'OutFishn | Trip Planner';
        fetchTrips();
    }, []);


    const formatDate = (isoString) => {
        if (!isoString) return '';
        if (!isoString.includes('-')) return isoString;
        const [year, month, day] = isoString.split('-');
        return `${month}/${day}/${year}`;
    };

    const handleTripSubmit = async (event) => {
        event.preventDefault();

        if (!tripName || !tripLocation || !tripDate) {
            alert("Trip name, location, and date required.");
            return;
        }

        const newTripData = {
            name: tripName.trim(),
            location: tripLocation.trim(),
            date: tripDate,
            guests: tripGuests.trim(),
            notes: tripNotes.trim(),
        };

        try {
            const response = await fetch('/api/trip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTripData),
            });

            if (response.ok) {
                const addedTrip = await response.json();
                setTrips(prevTrips => [...prevTrips, addedTrip].sort((a, b) => new Date(a.date) - new Date(b.date)));
                
                setTripName('');
                setTripLocation('');
                setTripDate('');
                setTripGuests('');
                setTripNotes('');
            } else {
                alert(`Failed to plan trip: ${response.statusText}`);
            }
        } catch (e) {
            console.error("Error creating trip:", e);
            alert("An error occurred while connecting to the server.");
        }
    };

    const handleDeleteTrip = async (id) => {
        if (window.confirm("Are you sure you want to delete this trip?")) {
            try {
                const response = await fetch(`/api/trip/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok || response.status === 204) {
                    setTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
                } else {
                    alert(`Failed to delete trip: ${response.statusText}`);
                }
            } catch (e) {
                console.error("Error deleting trip:", e);
                alert("An error occurred while connecting to the server.");
            }
        }
    };

  return (
    <>
        <main>
            <div className="main-content-wrapper">
                <div className="left-column">
                    <h1>Plan A Trip</h1>
                    <div className="trip-plan-section box-shadow-style">
                        <form onSubmit={handleTripSubmit} id="trip-form">
                            <div>
                                <label htmlFor="trip-name">Trip Name: </label>
                                <input type="text" id="trip-name" placeholder="ex. The Boy's Trip" value={tripName} onChange={(e) => setTripName(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="trip-location">Location: </label>
                                <input type="text" id="trip-location" placeholder="Strawberry Reservoir" value={tripLocation} onChange={(e) => setTripLocation(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="trip-date">Date: </label>
                                <input type="date" id="trip-date" name="trip-date" value={tripDate} onChange={(e) => setTripDate(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="trip-guests">Friends: </label>
                                <textarea id="trip-guests" name="trip-guests" rows="3" placeholder="List who you'd like to tag along here..." value={tripGuests} onChange={(e) => setTripGuests(e.target.value)}></textarea>
                            </div>
                            <div>
                                <label htmlFor="trip-notes">Notes: </label>
                                <textarea id="trip-notes" name="trip-notes" rows="5" placeholder="Other important trip information..." value={tripNotes} onChange={(e) => setTripNotes(e.target.value)}></textarea>
                            </div>
                            <button type="submit" disabled={!tripName || !tripLocation || !tripDate}>Plan Trip</button>
                        </form>
                    </div>
                </div>
                <div className="right-column">
                    <h2>My Trips</h2>
                    <table id="trips-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Friends</th>
                                <th>Notes</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trips.map((trip) => (
                                <tr key={trip.id}>
                                    <td>{trip.name}</td>
                                    <td>{trip.location}</td>
                                    <td>{formatDate(trip.date)}</td>
                                    <td>{trip.guests || 'None'}</td>
                                    <td>{trip.notes}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleDeleteTrip(trip.id)} 
                                            className="delete-button"
                                            title="Delete Trip"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {trips.length === 0 && (
                                <tr><td colSpan="6" style={{textAlign: 'center'}}>No trips planned yet. Time to plan one!</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
        <div className="logo-placeholder">
            <img src="/pics/logo/outfishn_logo_only.png" alt="OutFishin Logo"/>
        </div>
    </>
  );
}