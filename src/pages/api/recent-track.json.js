// src/pages/api/recent-track.json.js
// This API endpoint runs on the server and is used by the client to get the latest track.

// This file is a great example of a server-side route in Astro.
// It will never be exposed to the client's browser.

export const GET = async ({ url }) => {
    let response;
    
    // Get the API key and username from the server's environment variables
    const lastfmApiKey = process.env.LASTFM_API_KEY;
    const lastfmUsername = process.env.LASTFM_USERNAME;

    try {
        if (!lastfmApiKey || !lastfmUsername) {
            throw new Error('Server environment variables are not set.');
        }

        const lastfmUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastfmUsername}&api_key=${lastfmApiKey}&format=json&limit=1&extended=1`;
        
        const fetchResponse = await fetch(lastfmUrl);
        const data = await fetchResponse.json();

        if (data.error) {
            response = {
                status: 500,
                body: JSON.stringify({ message: `API Error: ${data.message}` })
            };
        } else if (data.recenttracks && data.recenttracks.track) {
            const trackData = data.recenttracks.track[0];
            const track = {
                name: trackData.name,
                artist: trackData.artist.name,
                album: trackData.album['#text'],
                albumCover: trackData.image.find(img => img.size === 'extralarge')['#text'] || trackData.image.find(img => img.size === 'large')['#text'] || 'https://placehold.co/300x300/4B5563/FFFFFF?text=No+Cover',
                url: trackData.url,
                isNowPlaying: trackData['@attr']?.nowplaying === 'true',
                loved: trackData.loved === '1',
                timestamp: trackData.date?.uts ? parseInt(trackData.date.uts, 10) * 1000 : null,
            };

            response = {
                status: 200,
                body: JSON.stringify({ track })
            };
        } else {
            response = {
                status: 404,
                body: JSON.stringify({ message: 'No recent tracks found.' })
            };
        }
    } catch (e) {
        response = {
            status: 500,
            body: JSON.stringify({ message: `Server Error: ${e.message}` })
        };
    }

    // Return the response as a JSON object
    return new Response(response.body, {
        status: response.status,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
