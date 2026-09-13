# saimon2066 portfolio

Personal portfolio site. React + Vite, no framework beyond that, deployed to GitHub Pages.

## Run it locally

```bash
npm install
npm run dev
```

Opens on http://localhost:5173. `npm run build` writes the production files to `dist/`,
`npm run preview` serves that build so you can check it before pushing.

## Putting it on GitHub Pages

Once, from scratch:

1. **Create the repository on GitHub, empty** — no README, no .gitignore, GitHub adds
   its own and it gets in the way. Name it `saimon2066.github.io` to serve the site from
   `https://saimon2066.github.io`. Any other name serves it from a subfolder, e.g.
   `https://saimon2066.github.io/portfolio`.

2. **Set `base` in `vite.config.js` to match.** This is the one thing that silently
   breaks everything: the wrong value gives a blank page with 404s on every JS and CSS
   file, and nothing in the browser tells you why.
   - repo `saimon2066.github.io` → `base: '/'` (what it is set to now)
   - repo `portfolio` → `base: '/portfolio/'`

3. **Push it.** From the project folder:

   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/saimon2066/saimon2066.github.io.git
   git push -u origin main
   ```

   `node_modules` and `dist` are already in `.gitignore`, so they stay out; GitHub builds
   the site itself.

4. **Turn Pages on.** In the repo: *Settings* → *Pages* → *Build and deployment* →
   *Source* → **GitHub Actions**. Not "Deploy from a branch". The workflow at
   `.github/workflows/deploy.yml` handles the rest.

5. **Watch the first run** under the *Actions* tab. It takes a minute or two. When it is
   green, the URL appears under Settings → Pages.

After that, every `git push` to `main` rebuilds and republishes. There is nothing to run
by hand and `dist/` never gets committed.

### When something is wrong

- **Blank page, console full of 404s** — `base` does not match the repo name. Fix it,
  commit, push.
- **Actions run fails on `npm ci`** — `package-lock.json` is out of sync with
  `package.json`. Run `npm install` locally, commit the updated lock file.
- **Old version keeps showing** — hard reload with Ctrl+F5; Pages caches aggressively.
- **404 on the whole site** — Pages source is still set to a branch instead of GitHub
  Actions.

## Changing the content

You should not have to touch the components for normal edits.

| What | Where |
|---|---|
| Projects (name, copy, tags, links, gallery shots) | `src/data/projects.js` |
| Email, GitHub, itch.io | `src/data/profile.js` |
| Tool logos in the marquee | `src/data/profile.js` |
| About text, hero text | `src/sections/About.jsx`, `src/sections/Hero.jsx` |
| The four facts under the about text | `facts` in `src/data/profile.js` |
| Reveal timing (`delay` props) | wherever `<Reveal>` is used |
| Colors, type scale, spacing | the `:root` block in `src/styles/global.css` |

Three amber tokens exist on purpose: `--amber` for interactive or stateful things,
`--amber-dim` for their quieter edges, `--amber-deep` for decoration (project numbers,
bullet markers, scramble churn). Reaching for `--amber` on decoration is what flattens
the page, since an accent used everywhere stops being one.

### Images

Project screenshots live in `public/images/` as 1600px-wide webp. Each project's `shots`
array drives the gallery: the first entry is the big one, the rest become thumbnails.
Add or reorder entries there and the gallery follows. The frame takes the shape of whatever
you give it, so shots are never cropped, but mixing aspect ratios inside one gallery
makes the block jump in height when you switch thumbnails. Keep one ratio per project.

Each shot exists at three widths — `name.webp` (1600), `name-800.webp`, `name-400.webp`
— and the gallery builds a `srcset` from that naming, so a phone pulls the 800px file
for the main shot and the 400px one for thumbnails instead of the full size. That takes
a phone from about 835 kB of images to 264 kB.

To add a screenshot: export a PNG from Unity, save it as a 1600px-wide webp in
`public/images/`, then run

```bash
pip install pillow          # once
python scripts/make-image-variants.py
```

which writes the two smaller files beside it. Dense detail (the wireframe shot) balloons
in size, so check the full-size file is not over a few hundred kB and drop quality if it
is.

`public/images/placeholder-photo.svg` is still a blank white stand-in for the portrait
in the about section. Replace the file and update the `src` in `src/sections/About.jsx`. Use a 4:5 portrait; it renders greyscale, so contrast matters
more than colour, and it is small on screen so a tight crop of the head and shoulders
works better than a full body shot. Whatever ratio you give it, the frame follows.

## Structure

```
src/
  components/
    FaultyTerminal.jsx   React Bits, CRT shader background (WebGL via ogl)
    LogoLoop.jsx         React Bits, tool logo marquee
    Reveal.jsx           fades content in as it scrolls into view
    ActiveSection.jsx    scroll spy: which section the nav and rail highlight
    Scramble.jsx         scrambles a heading into place on first view
    PixelCard.jsx        React Bits, pixel hover frame on the portrait and project shots
    Gallery.jsx          main shot plus thumbnails for one project
    Nav.jsx              fixed top bar
    Section.jsx          section wrapper with the ~/path rail label
  sections/              Hero, About (+ skills), Projects, Contact
  data/                  all editable content
  styles/global.css      design tokens and every layout rule
```

### Tool logos

The marquee is driven by `toolLogos`. Icons come from `react-icons/si` (simple-icons). Add one by putting its
export name in `toolLogos` in `src/data/profile.js` and importing it in
`src/sections/About.jsx`. Not everything has an icon: simple-icons dropped VS Code over
trademark issues, so VS Code comes from `react-icons/vsc` instead. C# and Reaper have no
icon in any set, so those two are brand SVGs in `src/assets/logos/`, referenced with `svg`
instead of `icon`. Their fills were rewritten to `currentColor`, with near-white detail
swapped for `var(--bg)`, so they inherit the same colour and hover state as every other
logo. If you add another brand SVG, do the same or it will hover in its own colours.

### Motion

`Reveal` wraps a block, watches it with one IntersectionObserver and toggles
`is-visible` as it enters the viewport, so the animation replays on the way back up. It
only re-hides when the block leaves *downwards*: re-hiding on the way up as well meant a
block parked on the threshold flipped state on every small scroll, which looked like
flickering. Pass `once` to fade a block in a single time and leave it.

The framed galleries drift vertically as they cross the screen (`useParallax` in
`Projects.jsx`). It is one rAF-throttled scroll listener, and only cards currently on
screen get their transform touched. The whole card moves rather than the image inside
it, so nothing has to be scaled up and cropped to hide the edges.

Section headings scramble into place the first time they are seen (`Scramble.jsx`, with
unsettled characters tinted so the churn is visible) and
flicker on like a phosphor tube. The nav link plus the `~/path` rail light up for
whichever section is crossing the middle of the viewport (`ActiveSection.jsx`: one
observer with a `-45%` band top and bottom, and when two sections touch that band at
once the one filling more of it wins, which is what makes the last section reachable).
Two spots are ambiguous from geometry alone and are handled explicitly in
`ActiveSection.jsx`: at maximum scroll the last section is forced active (nothing can
scroll further, so the band may still sit on the section above it), and clicking any
in-page link pins its target until the reader scrolls by hand, because clicking a short
section near the end lands at that same maximum scroll with a different intent. The
footer also carries deep bottom padding so sections can reach the band at all. A
hairline under the nav tracks scroll progress.

Project galleries keep every shot mounted and stacked in one grid cell and switch by
opacity. Swapping `src` on a single `img` instead showed a black gap while the browser
decoded the next file.

The hero animates on load rather than on scroll since it is already visible. Everything
here is switched off under `prefers-reduced-motion`.

## Notes on the React Bits components

Both are MIT licensed and copied into the repo, so they are yours to modify.
Two changes from the upstream source, both marked with `TWEAK` comments in
`FaultyTerminal.jsx`:

1. `gridMul` is passed as an array literal from JSX, which is a new reference on every
   render, which re-created the entire WebGL context. Now memoised on a primitive key.
2. The render loop pauses via `IntersectionObserver` when the hero scrolls out of view.
   Without it the shader keeps running the whole time someone reads the rest of the page.

`PixelCard` got an `amber` variant matching the palette, and it skips canvas setup
entirely on touch devices where the hover effect can never fire. It frames the portrait and the
project screenshots as a 9px border, never sitting under body text where the shimmer
made it hard to read.

Two more React Bits ideas are in the CSS rather than as components: the hover sweep on
buttons is GlareHover's angled-gradient-plus-background-position trick (the component
itself is a fixed-size card wrapper with its own border and background, which would
fight the button styles), and the moving highlight on the hero role line is ShinyText's
gradient-clipped-to-text, both without the `motion` dependency those components pull in.

`LogoLoop` also stops its loop off-screen, keeps its hover state in a ref rather than
React state (re-rendering on hover tore down the rAF loop and made the deceleration
stutter), reads its refs inside the resize effect instead of taking an array literal as
a dependency (which rebuilt both ResizeObservers on every render), and caps its copy
count at 12. Anything wrapping it needs `min-width: 0`: the track is max-content wide,
so a parent that sizes to its content grows with it, asks for more copies, and grows
again. Without
the cap, a parent that sizes itself to content and a track that grows with the copy
count feed each other and stretch the page sideways forever.

The hero shader fades its cells in over two seconds on load. If that ever reads as slow,
it is the animation and not the loading: on a production build the canvas is painted
about 200ms after load. Judge it with `npm run build && npm run preview`, never with the
dev server.

The hero shader does not load at all on screens under 720px, on anything without a fine
pointer (which keeps it off phones and tablets in landscape too, where the pattern would
be squashed into a letterbox and the mouse reaction means nothing), when WebGL is
unavailable, or when the visitor has reduced motion turned on. A static gradient stands in.
`ogl` is a lazy chunk (~16 kB gzipped) so it is not in the initial bundle.

### Fonts

JetBrains Mono is self-hosted through `@fontsource`, imported in `main.jsx` — only the
two weights in use and only the `latin` and `latin-ext` subsets. `latin-ext` is not
optional: it carries Š, ľ and č. Pulling it from Google Fonts instead costs an extra DNS
lookup, an extra TLS handshake and a third-party render block.

Things deliberately not done: `content-visibility: auto` on off-screen sections. Measured
over five runs each way it made no difference here, because the whole document is only
about 430 nodes.

## Interface sounds

`src/lib/sound.js` synthesises the blips with WebAudio: no audio files, no requests.
Delegated listeners in `App.jsx` cover hover and click on anything interactive. Two
rules decide which voice plays: the firm click is reserved for links that leave the page
(external, new tab or `mailto:`), and everything else — in-page anchors, buttons,
hovers — gets the quiet blip. The gallery plays its own quiet blip when the picture
changes, so its thumbs are excluded from both delegated listeners; otherwise a switch
sounded twice at once.

The hover voice is about a quarter the volume of a click and half as long, and only
plays where `(pointer: fine)` matches, so a tap on a phone does not fire both a
synthetic hover and a click. Sound is off on every load and the choice is deliberately not remembered, so nobody
arrives to a page that makes noise at them. Browsers refuse to start audio outside a user gesture, and a context
created during a hover stays suspended permanently, so `sound.js` builds and resumes the
context on the first pointerdown/keydown/touchstart and `play()` stays quiet until then
instead of firing oscillators into a dead context.

## Size

Roughly 56 kB gzipped for the main bundle plus 16 kB for the shader chunk. Keep an eye
on this if you add more animated components, it is the easiest thing to ruin.
