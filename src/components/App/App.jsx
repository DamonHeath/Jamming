import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Jammming</h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <SearchBar />
      </div>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <SearchResults />
        <Playlist />
      </div>
    </div>
  );
}

export default App;