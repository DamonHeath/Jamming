import { useEffect, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import {
  redirectToSpotifyLogin,
  getAccessToken,
  getStoredAccessToken,
  logoutSpotify,
  searchSpotify,
} from '../../utils/spotify';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [accessToken, setAccessToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const initialiseAuth = async () => {
      try {
        const storedToken = getStoredAccessToken();

        if (storedToken) {
          setAccessToken(storedToken);
          setAuthLoading(false);
          return;
        }

        const tokenFromCode = await getAccessToken();

        if (tokenFromCode) {
          setAccessToken(tokenFromCode);
        }
      } catch (error) {
        setAuthError(error.message || 'Spotify login failed.');
      } finally {
        setAuthLoading(false);
      }
    };

    initialiseAuth();
  }, []);

  const addTrack = (track) => {
    const trackAlreadyAdded = playlistTracks.some(
      (savedTrack) => savedTrack.id === track.id
    );

    if (trackAlreadyAdded) {
      return;
    }

    setPlaylistTracks((prevTracks) => [...prevTracks, track]);
  };

  const removeTrack = (track) => {
    setPlaylistTracks((prevTracks) =>
      prevTracks.filter((savedTrack) => savedTrack.id !== track.id)
    );
  };

  const updatePlaylistName = (newName) => {
    setPlaylistName(newName);
  };

  const savePlaylist = () => {
    const trackUris = playlistTracks.map((track) => track.uri);
    console.log('Saving playlist:', playlistName, trackUris);
  };

  const handleSpotifyLogin = async () => {
    setAuthError('');
    await redirectToSpotifyLogin();
  };

  const handleSpotifyLogout = () => {
    logoutSpotify();
    setAccessToken(null);
    setSearchResults([]);
  };

  const handleSearch = async (searchTerm) => {
    if (!accessToken) {
      setSearchError('Please connect Spotify before searching.');
      return;
    }

    try {
      setSearchError('');
      setSearchLoading(true);

      const results = await searchSpotify(searchTerm, accessToken);
      setSearchResults(results);
    } catch (error) {
      setSearchError(error.message || 'Search failed.');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Jammming</h1>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        {authLoading ? (
          <p>Checking Spotify login...</p>
        ) : accessToken ? (
          <>
            <p style={{ color: '#1db954', fontWeight: 'bold' }}>
              Spotify connected
            </p>
            <button
              onClick={handleSpotifyLogout}
              style={{
                padding: '0.6rem 1rem',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Disconnect Spotify
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSpotifyLogin}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#1db954',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Connect Spotify
            </button>
            {authError ? (
              <p style={{ color: '#ff6b6b', marginTop: '0.75rem' }}>
                {authError}
              </p>
            ) : null}
          </>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <SearchBar onSearch={handleSearch} />
      </div>

      {searchLoading ? (
        <p style={{ textAlign: 'center' }}>Searching Spotify...</p>
      ) : null}

      {searchError ? (
        <p style={{ textAlign: 'center', color: '#ff6b6b' }}>{searchError}</p>
      ) : null}

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <SearchResults tracks={searchResults} onAdd={addTrack} />
        <Playlist
          tracks={playlistTracks}
          onRemove={removeTrack}
          playlistName={playlistName}
          onNameChange={updatePlaylistName}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

export default App;