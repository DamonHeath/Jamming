const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

const scopes = ['playlist-modify-public', 'playlist-modify-private'].join(' ');

function generateRandomString(length) {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64UrlEncode(arrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export async function redirectToSpotifyLogin() {
  const verifier = generateRandomString(64);
  const challenge = base64UrlEncode(await sha256(verifier));

  localStorage.setItem('spotify_code_verifier', verifier);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken() {
  const currentUrl = new URL(window.location.href);
  const code = currentUrl.searchParams.get('code');

  if (!code) {
    return null;
  }

  const verifier = localStorage.getItem('spotify_code_verifier');

  if (!verifier) {
    throw new Error('Missing PKCE code verifier.');
  }

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to obtain Spotify access token. ${errorText}`);
  }

  const data = await response.json();

  localStorage.setItem('spotify_access_token', data.access_token);

  if (data.refresh_token) {
    localStorage.setItem('spotify_refresh_token', data.refresh_token);
  }

  if (data.expires_in) {
    const expiresAt = Date.now() + data.expires_in * 1000;
    localStorage.setItem('spotify_token_expires_at', String(expiresAt));
  }

  window.history.replaceState({}, document.title, '/');

  return data.access_token;
}

export function getStoredAccessToken() {
  const token = localStorage.getItem('spotify_access_token');
  const expiresAt = localStorage.getItem('spotify_token_expires_at');

  if (!token || !expiresAt) {
    return null;
  }

  if (Date.now() > Number(expiresAt)) {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expires_at');
    return null;
  }

  return token;
}

export function logoutSpotify() {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expires_at');
  localStorage.removeItem('spotify_code_verifier');
}

export async function searchSpotify(searchTerm, accessToken) {
  if (!searchTerm.trim()) {
    return [];
  }

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      searchTerm
    )}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Spotify search failed. ${errorText}`);
  }

  const data = await response.json();

  return data.tracks.items.map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artists.map((artist) => artist.name).join(', '),
    album: track.album.name,
    uri: track.uri,
  }));
}