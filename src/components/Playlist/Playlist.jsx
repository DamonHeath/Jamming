import TrackList from '../TrackList/TrackList';

function Playlist() {
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
        defaultValue="New Playlist"
        style={{
          width: '100%',
          padding: '0.5rem',
          fontSize: '1rem',
          marginBottom: '1rem',
          borderRadius: '4px',
          border: '1px solid #444',
        }}
      />

      <TrackList />

      <button
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