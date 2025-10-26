import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';

import userImg from '../assets/icons/profile.png';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface GeoData {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
}

// Recenter map
function MapUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function Home() {
  const [geo, setGeo] = useState<GeoData | null>(null);
  const [ip, setIp] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'history' | 'account'>(
    'search'
  );
  const [popup, setPopup] = useState('');
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('history');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedHistory, setSelectedHistory] = useState<string[]>([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch initial IP info
  useEffect(() => {
    fetch('https://ipinfo.io/geo')
      .then((res) => res.json())
      .then((data) => setGeo(data));
  }, []);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  const showPopup = (message: string) => {
    setPopup(message);
    setTimeout(() => setPopup(''), 3000);
  };

  const handleSearch = async () => {
    const ipPattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(ip)) {
      showPopup('Invalid IP address');
      return;
    }
    try {
      const res = await fetch(`https://ipinfo.io/${ip}/geo`);
      const data = await res.json();
      setGeo(data);
      setHistory((prev) => (prev.includes(ip) ? prev : [...prev, ip]));
      setIp('');
    } catch (err) {
      showPopup('Error fetching IP info');
    }
  };

  const handleClear = async () => {
    setIp('');
    const res = await fetch('https://ipinfo.io/geo');
    const data = await res.json();
    setGeo(data);
  };

  const handleSelectHistory = async (selectedIp: string) => {
    const res = await fetch(`https://ipinfo.io/${selectedIp}/geo`);
    const data = await res.json();
    setGeo(data);
    setActiveTab('search');
  };

  const toggleSelectHistory = (ip: string) => {
    setSelectedHistory((prev) =>
      prev.includes(ip) ? prev.filter((item) => item !== ip) : [...prev, ip]
    );
  };

  const handleDeleteSelected = () => {
    const updated = history.filter((ip) => !selectedHistory.includes(ip));
    setHistory(updated);
    setSelectedHistory([]);
    localStorage.setItem('history', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const getLatLng = (): LatLngExpression => {
    if (!geo) return [0, 0];
    const [lat, lng] = geo.loc.split(',').map(Number);
    return [lat, lng];
  };

  return (
    <div className="relative w-full h-screen">
      {/* Map */}
      <MapContainer
        center={getLatLng()}
        zoom={13}
        className="absolute top-0 left-0 w-full h-full z-0"
        key={geo?.loc}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geo && (
          <Marker position={getLatLng()}>
            <Popup>
              {geo.city}, {geo.region}, {geo.country} <br /> IP: {geo.ip}
            </Popup>
          </Marker>
        )}
        <MapUpdater center={getLatLng()} />
      </MapContainer>

      {/* Panel */}
      <div className="absolute top-4 right-4 w-80 bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-lg p-4 flex flex-col z-50">
        {/* Tabs */}
        <div className="flex justify-between mb-4 border-b border-gray-300">
          <button
            className={`py-2 px-3 ${
              activeTab === 'search' ? 'border-b-2 border-blue-500' : ''
            }`}
            onClick={() => setActiveTab('search')}
          >
            Search
          </button>
          <button
            className={`py-2 px-3 ${
              activeTab === 'history' ? 'border-b-2 border-blue-500' : ''
            }`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button
            className={`py-2 px-3 ${
              activeTab === 'account' ? 'border-b-2 border-blue-500' : ''
            }`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'search' && (
          <div className="flex flex-col gap-2">
            <input
              id="ip_input"
              type="text"
              placeholder="Enter IP address"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Search
              </button>
              <button
                onClick={handleClear}
                className="flex-1 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
              >
                Clear
              </button>
            </div>

            {geo && (
              <div className="mt-2 text-sm space-y-1">
                <p>
                  <b>IP:</b> {geo.ip}
                </p>
                <p>
                  <b>City:</b> {geo.city}
                </p>
                <p>
                  <b>Region:</b> {geo.region}
                </p>
                <p>
                  <b>Country:</b> {geo.country}
                </p>
                <p>
                  <b>Location:</b> {geo.loc}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex flex-col max-h-64 overflow-y-auto text-sm">
            {history.length === 0 ? (
              <p className="text-gray-500 text-center">No history yet.</p>
            ) : (
              <>
                {/* Delete toggle */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Search History</h3>
                  <button
                    onClick={() => setDeleteMode(!deleteMode)}
                    className={`text-sm px-2 py-1 rounded ${
                      deleteMode
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {deleteMode ? 'Cancel' : 'Delete'}
                  </button>
                </div>

                {/* History list */}
                <div className="flex flex-col gap-1">
                  {history.map((item, i) => (
                    <label
                      key={i}
                      className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded"
                    >
                      <div className="flex items-center gap-2 w-full">
                        {deleteMode && (
                          <input
                            type="checkbox"
                            checked={selectedHistory.includes(item)}
                            onChange={() => toggleSelectHistory(item)}
                          />
                        )}
                        <button
                          disabled={deleteMode}
                          onClick={() => handleSelectHistory(item)}
                          className={`text-left w-full ${
                            deleteMode
                              ? 'cursor-not-allowed text-gray-400'
                              : 'cursor-pointer'
                          }`}
                        >
                          {item}
                        </button>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Delete button */}
                {deleteMode && selectedHistory.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Delete Selected ({selectedHistory.length})
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'account' && (
          <div className="flex flex-col gap-2 text-sm">
            <img
              src={userImg}
              alt="User Profile"
              className="w-20 h-20 rounded-full border border-gray-300 shadow-sm mx-auto"
            />
            <p>
              <b>Name:</b> {user?.user?.name}
            </p>
            <p>
              <b>Email:</b> {user?.user?.email}
            </p>
            <button
              onClick={handleLogout}
              className="mt-2 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Popup Notification */}
      {popup && (
        <div className="fixed bottom-5 right-5 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {popup}
        </div>
      )}
    </div>
  );
}

export default Home;
