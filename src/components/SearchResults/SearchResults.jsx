import TrackList from '../TrackList/TrackList';

function SearchResults({ tracks, onAdd }) {
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
      <h2>Search Results</h2>
      <TrackList tracks={tracks} onAction={onAdd} actionSymbol="+" />
    </div>
  );
}

export default SearchResults;