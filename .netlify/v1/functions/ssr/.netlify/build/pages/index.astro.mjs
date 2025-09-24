import { c as createComponent, d as createAstro, i as renderScript, f as addAttribute, r as renderTemplate, m as maybeRenderHead, j as renderComponent, k as renderHead } from '../chunks/astro/server_Jc1gI1Yr.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$BaseHead = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BaseHead;
  return renderTemplate`${renderScript($$result, "/home/violette/personal/neocities/lastfm-iframe/src/components/baseHead.astro?astro&type=script&index=0&lang.ts")} <!-- Global Metadata --><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Last.fm Widget</title>`;
}, "/home/violette/personal/neocities/lastfm-iframe/src/components/baseHead.astro", void 0);

const $$Astro = createAstro();
const $$Lastfm = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Lastfm;
  const { lastfmApiKey, lastfmUsername } = Astro2.props;
  let initialTrackData = null;
  let initialError = null;
  try {
    if (!lastfmApiKey || !lastfmUsername || lastfmApiKey === "---REPLACE_WITH_YOUR_API_KEY---" || lastfmUsername === "---REPLACE_WITH_YOUR_USERNAME---") {
      throw new Error("Please configure your Last.fm API key and username in the component props.");
    }
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastfmUsername}&api_key=${lastfmApiKey}&format=json&limit=1&extended=1`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) {
      initialError = data.message;
    } else if (data.recenttracks && data.recenttracks.track) {
      const trackData = data.recenttracks.track[0];
      initialTrackData = {
        name: trackData.name,
        artist: trackData.artist.name,
        album: trackData.album["#text"],
        albumCover: trackData.image.find((img) => img.size === "extralarge")["#text"] || trackData.image.find((img) => img.size === "large")["#text"] || "https://placehold.co/300x300/4B5563/FFFFFF?text=No+Cover",
        url: trackData.url,
        isNowPlaying: trackData["@attr"]?.nowplaying === "true",
        loved: trackData.loved === "1",
        timestamp: trackData.date?.uts ? parseInt(trackData.date.uts, 10) * 1e3 : null
      };
    } else {
      initialError = "No recent tracks found.";
    }
  } catch (e) {
    initialError = `Error fetching data: ${e.message}`;
  }
  return renderTemplate`<!-- This script block runs on the client to provide interactivity -->${renderScript($$result, "/home/violette/personal/neocities/lastfm-iframe/src/components/lastfm.astro?astro&type=script&index=0&lang.ts")} ${maybeRenderHead()}<div class="flex justify-center items-center h-full w-full bg-teal-dark"${addAttribute(`lastFmPlayer({
    initialTrackData: JSON.parse('${JSON.stringify(initialTrackData)}'),
    initialError: JSON.parse('${JSON.stringify(initialError)}'),
    lastfmApiKey: '${lastfmApiKey}',
    lastfmUsername: '${lastfmUsername}'
  })`, "x-data")}> <div class="bg-teal text-light-grey h-[90%] w-[80%] rounded-xl shadow-lg border border-light-grey font-display font-bold flex flex-col justify-center items-center"> <!-- Initial server-side rendered content will be visible immediately. --> <div x-show="!track && isLoading"> <p>Initializing...</p> </div> <div x-show="!track && error" class="text-center text-red-400"> <p>Error:</p> <p x-text="error"></p> </div> <template x-if="track && !error"> <div class="w-full h-full flex flex-col items-center text-center justify-around"> <img class="rounded-lg shadow-xl border border-light-grey h-[40%] aspect-square object-cover" :src="track.albumCover" alt="Album Cover"> <div class="w-full h-fit text-light-grey flex flex-col items-center"> <p class="text-2xl m-0 p-0 wrap-normal h-full flex flex-col justify-between items-center"> <span x-text="track.name"></span> <span x-show="track.loved" class="text-red-500 ml-2" title="Loved track"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block -mt-1" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path> </svg> </span> </p> <p class="text-lg  m-0 p-0">
by <span x-text="track.artist"></span> </p> <p class="text-md italic m-0 p-0">
from "<span x-text="track.album"></span>"
</p> </div> <div class="text-md"> <span x-text="track.isNowPlaying ? 'Currently playing' : getTimeAgo()"></span> </div> <a :href="track.url" target="_blank" rel="noopener noreferrer" class="px-4 py-2 text-md text-accent-dark bg-teal-light rounded-lg shadow-md hover:bg-light-grey transition-colors">
View on Last.fm
</a> </div> </template> </div> </div>`;
}, "/home/violette/personal/neocities/lastfm-iframe/src/components/lastfm.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en"> <head>${renderComponent($$result, "BaseHead", $$BaseHead, {})}${renderHead()}</head> <body class="m-0 p-0 w-svw h-svh flex justify-center items-center font-display"> ${renderComponent($$result, "LastFM", $$Lastfm, { "lastfmApiKey": "e1f7f832dee91f81142babf6386fc5c3", "lastfmUsername": "Frisk_Dreemurr" })} </body></html>`;
}, "/home/violette/personal/neocities/lastfm-iframe/src/pages/index.astro", void 0);

const $$file = "/home/violette/personal/neocities/lastfm-iframe/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
