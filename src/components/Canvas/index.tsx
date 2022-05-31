import React, { useCallback, useEffect, useRef, useState } from "react";
import { useWindowSize } from "@react-hook/window-size";
import * as SVG from "@svgdotjs/svg.js";

export interface ControllerOptions {
  steps: number;
  startingAngle?: number;
  endAngle?: number;
  twist?: number;
  spacingX?: number;
  spacingY?: number;
  letter?: string;
  scale?: number;
}

interface CanvasProps extends ControllerOptions {
  font: Record<string, string>;
}

interface WarpTextOptions {
  steps?: number;
  transformer: (idx: number, perc: number) => SVG.MatrixAlias;
}

const warpText = (
  svg: SVG.Svg,
  char: string,
  options: WarpTextOptions
): SVG.G => {
  const { steps = 10, transformer } = options;

  const g = svg.group();

  const letter = g.path(char);

  letter.remove();

  for (let i = 0; i < steps; i++) {
    const c = letter.clone();
    c.transform(transformer(i, i / steps));
    c.addTo(g);
  }

  return g;
};

const Canvas: React.FC<CanvasProps> = ({
  font,
  letter,
  startingAngle = 0,
  spacingX = 0,
  spacingY = 0,
  twist = 0,
  endAngle = 0,
  scale = 1,
  steps,
}) => {
  const [width, height] = useWindowSize();

  const svgRef = useRef<SVG.Svg>();

  const onRef = useCallback(
    (ref: HTMLDivElement) => {
      if (ref) {
        if (svgRef.current) {
          svgRef.current.remove();
        }

        svgRef.current = SVG.SVG();
        svgRef.current.size(width, height);
        svgRef.current.addTo(ref);

        if (!letter || !font[letter]) {
          return;
        }

        const g = warpText(svgRef.current, font[letter], {
          steps,
          transformer: (idx, perc) => {
            return {
              px: (idx + 1) * spacingX,
              py: (idx + 1) * spacingY,
              rotate:
                startingAngle + Math.sin(perc * (Math.PI * twist)) * endAngle,
            };
          },
        });

        const x = (svgRef.current.width() - g.width()) / 2;
        const y = (svgRef.current.height() - g.height()) / 2 - g.height() / 2;
        g.stroke("black").fill("white");
        g.translate(x, y);
        g.scale(scale);

        g.addTo(svgRef.current);
      }
    },
    [
      endAngle,
      font,
      height,
      letter,
      spacingX,
      spacingY,
      startingAngle,
      steps,
      twist,
      width,
      scale,
    ]
  );

  return <div ref={onRef} />;
};

export { Canvas };
