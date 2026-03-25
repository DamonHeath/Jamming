import TrackList from '../TrackList/TrackList';

function Playlist({ tracks, onRemove, playlistName, onNameChange, onSave }) {
  const handleNameChange = (event) => {
    onNameChange(event.target.value);
  };

  return (
    <div
      style={{
        width: '300px',
        minHeight: '400px',
        backgroundColor: '#1e1e1e',
        padding: '1rem',
        borderRadius: '8px',
      }}
    >
      <input
        type="text"
        value={playlistName}
        onChange={handleNameChange}
        style={{
          width: '100%',
          padding: '0.5rem',
          fontSize: '1rem',
          marginBottom: '1rem',
          borderRadius: '4px',
          border: '1px solid #444',
        }}
      />

      <TrackList tracks={tracks} onAction={onRemove} actionSymbol="-" />

      <button
        onClick={onSave}
        style={{
          marginTop: '1rem',
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#1db954',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
        }}
      >
        SAVE TO SPOTIFY
      </button>
    </div>
  );
}

export default Playlist;