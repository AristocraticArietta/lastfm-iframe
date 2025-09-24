import { DateTime } from 'luxon';

// This is the data and methods for the Alpine.js component.
// It is intended to be used with Alpine.data('lastFmPlayer', lastFmPlayer);
export default (initialState) => ({
    // Initial state from server-side render
    track: initialState.initialTrackData,
    error: initialState.initialError,
    isLoading: false,

    // Props from the Astro component
    lastfmApiKey: initialState.lastfmApiKey,
    lastfmUsername: initialState.lastfmUsername,

    // Fetch the most recent track from the Last.fm API
    async fetchTrack() {
        if (this.isLoading) return; // Prevent multiple simultaneous fetches

        this.isLoading = true;
        this.error = null;

        try {
            // Using a CORS proxy to prevent cross-origin issues on the client-side refresh
            const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.lastfmUsername}&api_key=${this.lastfmApiKey}&format=json&limit=1&extended=1`)}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                this.error = data.message;
                this.track = null; // Clear the old track if there's a new API error
            } else if (data.recenttracks && data.recenttracks.track) {
                const trackData = data.recenttracks.track[0];
                this.track = {
                    name: trackData.name,
                    artist: trackData.artist.name,
                    album: trackData.album['#text'],
                    albumCover: trackData.image.find(img => img.size === 'extralarge')['#text'] || trackData.image.find(img => img.size === 'large')['#text'] || 'https://placehold.co/300x300/4B552F/FFFFFF?text=No+Cover',
                    url: trackData.url,
                    isNowPlaying: trackData['@attr']?.nowplaying === 'true',
                    loved: trackData.loved === '1',
                    timestamp: trackData.date?.uts ? parseInt(trackData.date.uts, 10) * 1000 : null,
                };
            } else {
                this.error = 'No recent tracks found.';
                this.track = null;
            }
        } catch (e) {
            this.error = `Error fetching data: ${e.message}`;
            this.track = null;
        } finally {
            this.isLoading = false;
        }
    },

    // Calculates time passed since the track was played, or "just now"
    getTimeAgo() {
        if (!this.track || !this.track.timestamp) return '';
        const timestamp = DateTime.fromMillis(this.track.timestamp);
        return timestamp.toRelative();
    },

    // Alpine's init hook, which runs automatically
    init() {
        // Fetch the data initially when the component is mounted
        // Note: The first fetch is handled server-side, this is for client-side hydration
        // this.fetchTrack();

        // Set up the periodic refresh
        setInterval(() => {
            this.fetchTrack();
        }, 3000); // Refresh every 30 seconds
    }
});
