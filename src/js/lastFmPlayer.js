import { DateTime } from 'luxon';

export default () => ({
    track: null,
    error: null,
    isLoading: false,

    init() {
        // Access the element with $el and parse the data from its attributes
        this.track = JSON.parse(this.$el.dataset.initialTrackData);
        this.error = JSON.parse(this.$el.dataset.initialError);

        this.$watch('track', () => {
            if (this.track && this.track.isNowPlaying) {
                // Since the song is now playing, let's refresh more frequently
                this.startRefreshInterval(1500); // Check every 1.5 seconds
            } else if (this.track) {
                // For a scrobbled track, check less frequently
                this.startRefreshInterval(3000); // Check every 3 seconds
            }
        });

        // Start the initial refresh interval
        this.startRefreshInterval(3000);
    },

    startRefreshInterval(interval) {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(() => this.fetchTrack(), interval);
    },

    async fetchTrack() {
        this.isLoading = true;
        try {
            // The client-side fetch now points to our new, secure API route.
            const response = await fetch('/api/recent-track.json');
            const data = await response.json();

            if (data.error) {
                this.error = data.message;
                this.track = null;
            } else if (data.track) {
                this.track = data.track;
                this.error = null;
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

    getTimeAgo() {
        if (!this.track || this.track.isNowPlaying || !this.track.timestamp) {
            return '';
        }

        const then = DateTime.fromMillis(this.track.timestamp);
        return then.toRelative();
    }
});
