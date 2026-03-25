import Track from '../Track/Track';

function TrackList({ tracks, onAction, actionSymbol }) {
  if (!tracks.length) {
    return <p style={{ color: '#b3b3b3' }}>No tracks to display.</p>;
  }

  return (
    <div>
      {tracks.map((track) => (
        <Track
          key={track.id}
          track={track}
          onAction={onAction}
          actionSymbol={actionSymbol}
        />
      ))}
    </div>
  );
}

export default TrackList;