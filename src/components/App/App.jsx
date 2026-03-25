import { useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

function App() {
  const [searchResults] = useState([
    { id: 1, name: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours' },
    { id: 2, name: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia' },
    { id: 3, name: 'As It Was', artist: 'Harry Styles', album: 'Harry’s House' },
  ]);

  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');

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

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Jammming</h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <SearchBar />
      </div>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <SearchResults tracks={searchResults} onAdd={addTrack} />
        <Playlist
          tracks={playlistTracks}
          onRemove={removeTrack}
          playlistName={playlistName}
          onNameChange={updatePlaylistName}
        />
      </div>
    </div>
  );
}

export default App;