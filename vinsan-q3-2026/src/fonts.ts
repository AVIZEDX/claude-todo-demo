import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/inter-tight/index.css";
import { continueRender, delayRender } from "remotion";

// Block rendering until the brand fonts are ready — avoids any frame
// being captured with a fallback font.
const handle = delayRender("Loading fonts");
Promise.all([
  document.fonts.load("700 100px 'Archivo Variable'", "Q3 2026 ₹−%"),
  document.fonts.load("600 20px 'Inter Tight Variable'", "VINSAN ₹"),
])
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));
