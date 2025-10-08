import React from 'react';

export function Log() {
  return (
    <>
        <main>
            <div className="main-content-wrapper">
                <div className="left-column">
                    <h1>Log New Catch</h1>
                    <div className="log-catch-section">
                        <form id="fish-log-form">
                            <img id="catch-photo-placeholder" src="/placeholder.png" alt="New Catch" width="150" height="150"/>
                            <label for="fish-photo-upload" className="upload-button">
                                Upload Photo
                            </label>
                            <input type="file" id="fish-photo-upload" accept="image/*" className="d-none"/>
                            <div>
                                <label for="fish-species">Species: </label>
                                <input type="text" id="fish-species" placeholder="ex. Rainbow Trout" />
                            </div>
                            <div>
                                <label for="fish-length">Length (in): </label>
                                <input type="number" id="fish-length" step="0.1" min="0" placeholder="ex. 14.5"/>
                            </div>
                            <div>
                                <label for="fish-weight">Weight (lb): </label>
                                <input type="number" id="fish-weight" step="0.01" min="0" placeholder="ex. 8.92"/>
                            </div>
                            <div>
                                <label for="bait">Bait used: </label>
                                <input type="text" id="bait" placeholder="ex. Power Bait"/>
                            </div>
                            <div>
                                <label for="catch-time">Time of Catch: </label>
                                <input type="datetime-local" id="catch-time" name="catch-time" />
                            </div>
                            <div>
                                <label for="air-temp">Temperature (F):</label>
                                <input type="number" id="air-temp" name="air-temp" step="0.1" placeholder="ex. 72.5"/>
                            </div>
                            <div>
                                <label for="sky-conditions">Sky Conditions:</label>
                                <input list="sky-options" id="sky-conditions" name="sky-conditions" placeholder="ex. Sunny"/>
                                <datalist id="sky-options">
                                <option value="Clear"></option>
                                <option value="Sunny"></option>
                                <option value="Partly Cloudy"></option>
                                <option value="Cloudy"></option>
                                <option value="Overcast"></option>
                                <option value="Rainy"></option>
                                <option value="Stormy"></option>
                                <option value="Snowing"></option>
                                </datalist>
                            </div>
                            <div>
                                <label>Location: </label>
                                <div id="map"></div>
                                <input type="hidden" id="latitude" name="latitude" />
                                <input type="hidden" id="longitude" name="longitude" />
                            </div>
                            <div>
                                <label for="notes">Notes: </label>
                                <textarea id="notes" name="notes" rows="4" placeholder="Additional observations..."></textarea>
                            </div>
                            <button type="submit">Log Catch</button>
                        </form>
                    </div>
                </div>
                <div className="right-column">
                    <h2>Fish Log</h2>
                    <table id="catches-table">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Species</th>
                                <th>Length (in)</th>
                                <th>Weight (lb)</th>
                                <th>Bait</th>
                                <th>Date/Time</th>
                                <th>Temp.(F)</th>
                                <th>Weather</th>
                                <th>Location</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>[Photo]</td>
                                <td>Rainbow Trout</td>
                                <td>10.8</td>
                                <td>9.6</td>
                                <td>Power Bait</td>
                                <td>09/23/25, 4:33PM</td>
                                <td>65.8</td>
                                <td>Sunny</td>
                                <td>[Location]</td>
                                <td>Caught on East side of the reservoir.</td>
                            </tr>
                            <tr>
                                <td>[Photo]</td>
                                <td>Largemouth Bass</td>
                                <td>12.4</td>
                                <td>10.9</td>
                                <td>None</td>
                                <td>09/08/25, 5:33AM</td>
                                <td>62.7</td>
                                <td>Partly Cloudy</td>
                                <td>[Location]</td>
                                <td>Early bird gets the worm.</td>
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