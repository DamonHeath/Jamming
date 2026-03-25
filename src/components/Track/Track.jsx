function Track({ track, onAction, actionSymbol }) {
  const handleClick = () => {
    if (onAction) {
      onAction(track);
    }
  };

  return (
    <div
      style={{
        borderBottom: '1px solid #444',
        padding: '1rem 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <h3 style={{ margin: 0 }}>{track.name}</h3>
        <p style={{ margin: '0.25rem 0 0', color: '#b3b3b3' }}>
          {track.artist} | {track.album}
        </p>
      </div>

      <button
        onClick={handleClick}
        style={{
          backgroundColor: '#1db954',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          fontSize: '1.2rem',
          color: 'white',
        }}
      >
        {actionSymbol}
      </button>
    </div>
  );
}

export default Track;