import React, { useEffect } from 'react';
import './plan.css'

export function Plan() {

    useEffect(() => {
        document.title = 'OutFishn | Trip Planner';
    }, []);

  return (
    <>
        <main>
            <div className="main-content-wrapper">
                <div className="left-column">
                    <h1>Plan A Trip</h1>
                    <form id="trip-form">
                        <div>
                            <label for="trip-name">Trip Name: </label>
                            <input type="text" id="trip-name" placeholder="ex. The Boy's Trip" />
                        </div>
                        <div>
                            <label for="trip-location">Location: </label>
                            <input type="text" id="trip-location" placeholder="Strawberry Reservoir" />
                        </div>
                        <div>
                            <label for="trip-date">Date: </label>
                            <input type="date" id="trip-date" name="trip-date" />
                        </div>
                        <div>
                            <label for="trip-guests">Friends: </label>
                            <textarea id="trip-guests" name="trip-guests" rows="3" placeholder="List who you'd like to tag along here..."></textarea>
                        </div>
                        <div>
                            <label for="trip-notes">Notes: </label>
                            <textarea id="trip-notes" name="trip-notes" rows="5" placeholder="Other important trip information..."></textarea>
                        </div>
                        <button type="submit">Plan Trip</button>
                    </form>
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
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Boy's Trip</td>
                                <td>Strawberry Reservoir</td>
                                <td>10/18/2025</td>
                                <td>Jack Mann, John Doe, Jake Smith</td>
                                <td>Jake is driving. Meet at Walmart</td>
                            </tr>
                            <tr>
                                <td>Family Trip</td>
                                <td>Silver Lake</td>
                                <td>10/26/2025</td>
                                <td>Invite all family.</td>
                                <td>Bring extra layers. It'll be cold.</td>
                            </tr>
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