# Beyond the Numbers — Podcast Website

**Humanizing Healthcare Through Digital Technology & AI**

A university group research podcast about how digital tools (CGMs, insulin pumps, mobile health apps, and AI) are changing diabetes management, and the risks of relying on them.

The site uses plain HTML, CSS, and vanilla JavaScript. There is no build step and there are no frameworks.

## Project structure

```
index.html          Page markup (all sections)
css/styles.css      All styles; colors live at the top as CSS variables
js/episodes.js      Episode + topic data: the single source of truth
js/main.js          Player, modal, filters, animations, accessibility toolbar
js/fx.js            Decorative effects: hero particles, floating medical icons, card glow
audio/              Put your MP3s here (see audio/README.txt)
assets/             SVG illustrations, favicon; put photos here too
```

## Run it locally

Pick one:

- **Double-click `index.html`.** Everything works. The live equalizer in the player falls back to an animated one, because browsers block audio analysis on `file://` pages.
- **`npx serve`** in this folder, then open the URL it prints (usually http://localhost:3000). This needs Node.js.
- **VS Code Live Server:** right-click `index.html` → *Open with Live Server*.

## Add an episode's audio

1. Name the file `episode-1.mp3`, `episode-2.mp3`, and so on.
2. Put it in the `audio/` folder.
3. Refresh the page.

The "Coming Soon" badge disappears and the duration fills in from the MP3. No code changes are needed.

## Edit episode text

Open `js/episodes.js`. Each episode is one object:

| Field | What it does |
|---|---|
| `title`, `description` | Shown on the card (keep the description to about 2 sentences) |
| `host` | Shown as "Hosted by …" on the card, popup and player |
| `longDescription` | Show notes in the "Episode details" popup |
| `keyQuestions` | Numbered list in the popup |
| `guests` | "Voices in this episode" chips |
| `topic` | Must match an `id` in `TOPICS` at the top of the file |
| `audio` | Path to the MP3 |
| `image` | Card / player artwork |
| `transcript` | Paste the transcript here. Empty shows "Transcript coming soon." |

Keep the quotes and commas. If the page goes blank after editing, a missing comma or quote is the usual cause. Open the browser console (F12) to see the line.

## Swap in real images

1. Add the photo to `assets/`, for example `assets/episode-1.jpg`.
2. Change that episode's `image` value in `js/episodes.js`.

Photos (`.jpg`, `.png`, `.webp`) fill the card. `.svg` files are treated as illustrations and sit centered on the gradient. If an image fails to load, the card falls back to its gradient and icon.

The two hero cards use `assets/hero-1.svg` and `assets/hero-2.svg`. Change the `src` in `index.html` to use photos there.

## Change the colors

Edit the variables at the top of `css/styles.css`:

```css
:root {
  --primary:      #0E7C86;  /* clinical teal */
  --secondary:    #1F6FB2;  /* medical blue */
  --accent:       #FF6B6B;  /* soft coral */
  ...
}
```

## Before you submit

- **Testimonials:** the "What Our Listeners Are Saying" quotes are **sample placeholders** and are labeled that way on the page. Replace them with real listener responses (search for `<figure class="slide"` in `index.html`). Once they're real, remove the `[Sample]` prefixes and the yellow "Sample feedback" caption.
- **Newsletter form:** front-end only. It shows a confirmation but sends and stores nothing.

## Player features

- Persistent bottom player that slides up on first play
- Skip back 15s / forward 30s, seek bar with hover time, speed (0.75x–2x), volume and mute, previous/next
- Live equalizer (Web Audio API) when served over http, animated fallback otherwise
- Keyboard: **Space** play/pause, **← / →** seek 5s, **M** mute
- Remembers your last episode, position, volume and speed
- Lock-screen / OS media controls (Media Session API)

## Accessibility

- Skip link, semantic landmarks, visible focus rings, ARIA labels, live announcements for player state
- Accessibility button (bottom-left): larger text, high contrast, reduce motion. Settings are remembered.
- Respects the operating system's "reduce motion" setting
- Keyboard-operable everywhere, including the episode popup (Tab is trapped inside; Esc closes it)

---

*This podcast is for educational purposes only and is not medical advice. Always consult a qualified healthcare professional about your care.*
