import React, { useEffect, useState } from 'react';
import './log.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationMarker({ setLocation }) {
    const [position, setPosition] = useState(null);
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            setLocation({ lat: e.latlng.lat, lng: e.latlng.lng});
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
}

export function Log({ onCatchLogged, catches, userName }) {
    const [species, setSpecies] = useState('');
    const [length, setLength] = useState('');
    const [weight, setWeight] = useState('');
    const [bait, setBait] = useState('');
    const [catchTime, setCatchTime] = useState('');
    const [airTemp, setAirTemp] = useState('');
    const [skyConditions, setSkyConditions] = useState('');
    const [notes, setNotes] = useState('');
    const [location, setLocation] = useState({ lat: 40.7608, lng: -111.8910 });
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        document.title = 'OutFishn | Fish Log';
    }, []);

    const position = [location.lat, location.lng];
    const mapStyle = {
      height: '250px',
      width: '100%',
      marginTop: '10px',
      border: '1px solid #ccc',
      borderRadius: '12px'
    };

    const handleCatchSubmit = (event) => {
        event.preventDefault();

        if (!species || !weight || !length) {
            alert('Please fill out Species, Length, and Weight');
            return;
        }

        const newCatch = {
            id: Date.now(),
            photo: photo,
            species: species.trim(),
            length: parseFloat(length),
            weight: parseFloat(weight),
            bait: bait.trim(),
            catchTime: catchTime || new Date().toISOString().slice(0,16),
            airTemp: airTemp ? parseFloat(airTemp) : null,
            skyConditions: skyConditions.trim(),
            location: location,
            notes: notes.trim(),
            angler: userName,
        };

        onCatchLogged(newCatch);

        setSpecies('');
        setLength('');
        setWeight('');
        setBait('');
        setCatchTime('');
        setAirTemp('');
        setSkyConditions('');
        setNotes('');
        setPhoto(null);
        alert('Catch successfully logged!');
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

  return (
    <>
        <main>
            <div className="main-content-wrapper">
                <div className="left-column">
                    <h1>Log New Catch</h1>
                    <div className="log-catch-section">
                        <form id="fish-log-form" onSubmit={handleCatchSubmit}>
                            <img id="catch-photo-placeholder" src={photo || "/placeholder.png"} alt="New Catch" width="150" height="150"/>
                            <label htmlFor="fish-photo-upload" className="upload-button">
                                Upload Photo
                            </label>
                            <input 
                                type="file" 
                                id="fish-photo-upload" 
                                accept="image/*" 
                                className="d-none"
                                onChange={handlePhotoChange}
                            />
                            <div>
                                <label htmlFor="fish-species">Species: </label>
                                <input type="text" id="fish-species" placeholder="ex. Rainbow Trout" value={species} onChange={(e) => setSpecies(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="fish-length">Length (in): </label>
                                <input type="number" id="fish-length" step="0.1" min="0" placeholder="ex. 14.5" value={length} onChange={(e) => setLength(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="fish-weight">Weight (lb): </label>
                                <input type="number" id="fish-weight" step="0.01" min="0" placeholder="ex. 8.92" value={weight} onChange={(e) => setWeight(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="bait">Bait used: </label>
                                <input type="text" id="bait" placeholder="ex. Power Bait" value={bait} onChange={(e) => setBait(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="catch-time">Time of Catch: </label>
                                <input type="datetime-local" id="catch-time" name="catch-time" value={catchTime} onChange={(e) => setCatchTime(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="air-temp">Temperature (F):</label>
                                <input type="number" id="air-temp" name="air-temp" step="0.1" placeholder="ex. 72.5" value={airTemp} onChange={(e) => setAirTemp(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="sky-conditions">Sky Conditions:</label>
                                <input list="sky-options" id="sky-conditions" name="sky-conditions" placeholder="ex. Sunny" value={skyConditions} onChange={(e) => setSkyConditions(e.target.value)} />
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
                                <MapContainer
                                    center={position}
                                    zoom={8}
                                    scrollWheelZoom={false}
                                    style={mapStyle}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <LocationMarker setLocation={setLocation} />
                                </MapContainer>
                            </div>
                            <div>
                                <label htmlFor="notes">Notes: </label>
                                <textarea id="notes" name="notes" rows="4" placeholder="Additional observations..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
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
                            {catches.map((catchItem) => (
                                <tr key={catchItem.id}>
                                    <td><img src={catchItem.photo || '/placeholder.png'} alt="Catch" width="50" height="50"/></td>
                                    <td>{catchItem.species}</td>
                                    <td>{catchItem.length.toFixed(1)}</td>
                                    <td>{catchItem.weight.toFixed(2)}</td>
                                    <td>{catchItem.bait}</td>
                                    <td>{formatDate(catchItem.catchTime)}</td>
                                    <td>{catchItem.airTemp !== null ? catchItem.airTemp.toFixed(1) : 'N/A'}</td>
                                    <td>{catchItem.skyConditions}</td>
                                    <td>{`Lat: ${catchItem.location.lat.toFixed(4)}, Lng: ${catchItem.location.lng.toFixed(4)}`}</td>
                                    <td>{catchItem.notes}</td>
                                </tr>
                            ))}
                            {catches.length === 0 && (
                                <tr><td colSpan="9" style={{textAlign: 'center'}}>No fish logged yet. Go fishing!</td></tr>
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