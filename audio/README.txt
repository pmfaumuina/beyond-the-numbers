BEYOND THE NUMBERS — AUDIO FOLDER
==============================

Drop your episode MP3s in this folder, named exactly:

    episode-1.mp3
    episode-2.mp3
    episode-3.mp3
    episode-4.mp3
    episode-5.mp3

That's it. No code changes are needed.

What happens automatically:
  * The "Coming Soon" badge disappears from that episode's card.
  * The episode's duration is read from the MP3 and shown on the site.
  * The play buttons, the bottom player, and "Start Listening" pick it up.

Tips:
  * Use lowercase names with a hyphen, exactly as above. "Episode 1.mp3" or
    "episode1.mp3" will not be found.
  * MP3 at 96–128 kbps mono is plenty for speech and keeps files small.
  * Using a different file name or format (e.g. .m4a)? Change that episode's
    `audio` value in js/episodes.js to match.
  * After adding a file, refresh the page (Ctrl+F5 / Cmd+Shift+R if your
    browser cached the old state).
