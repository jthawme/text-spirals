import { useEffect, useState } from "react";
// import TextToSVG from "text-to-svg";
import SVG from "@svgdotjs/svg.js";

// const svgLoadFont = (url: string): Promise<TextToSVG> => {
//   return new Promise((resolve, reject) => {
//     TextToSVG.load(url, function (err, textToSVG) {
//       if (err || !textToSVG) {
//         reject(err || "No svg");
//       } else {
//         resolve(textToSVG);
//       }
//     });
//   });
// };

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const loadLetter = (
  fontDir: string,
  letter: string
): Promise<string | null> => {
  const url = `${fontDir}/${
    letter === letter.toUpperCase()
      ? `${letter.toLowerCase()}-upper.svg`
      : `${letter}.svg`
  }`;
  return fetch(url)
    .then((resp) => resp.text())
    .then((text) => {
      const div = document.createElement("div");
      div.innerHTML = text;
      return (div.querySelector("path") as SVGPathElement).getAttribute("d");
    });
};

export const useFontLoad = (fontDir: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [font, setFont] = useState<Record<string, string>>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);

    Promise.all(chars.map((c) => loadLetter(fontDir, c)))
      .then((fonts) => {
        setFont(
          fonts.reduce((prev, curr, idx) => {
            if (!curr) {
              return prev;
            }

            return {
              ...prev,
              [chars[idx]]: curr,
            };
          }, {})
        );
      })
      .catch((e) => {
        setError(e.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fontDir]);

  return {
    loading,
    error,
    font,
  };
};
