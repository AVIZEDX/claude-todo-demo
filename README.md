# claude-todo-demo

## HyperFrames video editing

This repo is set up with [HyperFrames](https://github.com/heygen-com/hyperframes), HeyGen's tool for building videos out of HTML, CSS and GSAP animations and rendering them to MP4.

**Requirements:** Node.js 22+ and FFmpeg.

### What's included

- `.claude/skills/`: HyperFrames skills for Claude Code (`skills-lock.json` pins their versions)
  - `/hyperframes`: start here; it picks the right workflow for your request
  - `/embedded-captions`: add captions or subtitles to existing footage
  - `/talking-head-recut`: add lower-thirds, callouts, titles and picture-in-picture to talking-head or podcast video
  - `/motion-graphics`, `/general-video`: titles, logo stings, multi-scene edits
  - `/hyperframes-core`, `-animation`, `-keyframes`, `-creative`, `-audio`, `-cli`, `-registry`, `/media-use`: building blocks the workflows use (media, TTS, transcription, background removal, mixing)
- `my-video/`: a starter composition (`index.html`)

### Usage

Open Claude Code in this repo and ask, for example:

> Using /hyperframes, add animated captions to my-video/assets/interview.mp4

> Using /talking-head-recut, add lower-thirds and a title card to my clip

Or run the CLI yourself:

```bash
cd my-video
npm run dev      # live preview in the browser
npm run check    # lint and validate the composition
npm run render   # render to MP4
```

To start from your own footage: `npx hyperframes init my-edit --video path/to/clip.mp4` (this also transcribes it with Whisper).

Update the skills: `npx skills add heygen-com/hyperframes` or `npx hyperframes skills update`.
