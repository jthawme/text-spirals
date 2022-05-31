const path = require("path");
const fs = require("fs");
const TextToSvg = require("text-to-svg");

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const font = "GT-America-Trial-Extended-Black.otf";

const tts = TextToSvg.loadSync(path.join(__dirname, "../", "public", font));

const folder = path.join(__dirname, "../", "public", font.split(".")[0]);

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}

chars.forEach((c) => {
  const fileName =
    c === c.toUpperCase(c) ? `${c.toLowerCase()}-upper.svg` : `${c}.svg`;
  fs.writeFileSync(
    path.join(folder, fileName),
    tts.getSVG(c, {
      anchor: "top",
      x: 0,
      y: 0,
    })
  );
});
