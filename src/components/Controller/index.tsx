import React, { useCallback, useState } from "react";
import { Canvas, ControllerOptions } from "../Canvas";

import { useFontLoad } from "../FontLoad";

import styles from "./Controller.module.scss";

const FONT = "GT-America-Trial-Extended-Black";

const DEFAULT_OPTIONS: ControllerOptions = {
  steps: 5,
};

const Controller: React.FC = () => {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  // const [text, setText] = useState<string>("ABC");
  const { font, loading: fontLoading } = useFontLoad(
    `${process.env.PUBLIC_URL}/${FONT}`
  );

  const onInputChange = useCallback((e) => {
    const target = e.target as HTMLInputElement;
    let value: string | number = target.value;
    const name = target.dataset.name as string;

    if (target.type === "number" || target.type === "range") {
      value = parseFloat(value);
    }

    setOptions((options) => ({
      ...options,
      [name]: value,
    }));
  }, []);

  if (fontLoading || !font) {
    return null;
  }

  return (
    <div>
      <Canvas {...options} font={font} />

      <div className={styles.actions}>
        <input
          type="text"
          data-name="letter"
          onChange={onInputChange}
          value={options.letter}
        />
        <br />
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          data-name="scale"
          onChange={onInputChange}
          value={options.scale}
          defaultValue="1"
        />
        <input
          type="range"
          min="0"
          max="100"
          data-name="steps"
          onChange={onInputChange}
          value={options.steps}
        />
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          data-name="spacingX"
          onChange={onInputChange}
          value={options.spacingX}
          defaultValue="0"
        />
        <input
          type="range"
          min="-180"
          max="180"
          step="0.5"
          data-name="startingAngle"
          onChange={onInputChange}
          value={options.startingAngle}
          defaultValue="0"
        />
        <input
          type="range"
          min="-180"
          max="180"
          step="0.5"
          data-name="endAngle"
          onChange={onInputChange}
          value={options.endAngle}
          defaultValue="0"
        />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          data-name="twist"
          onChange={onInputChange}
          value={options.twist}
          defaultValue="0"
        />
      </div>
    </div>
  );
};

export { Controller };
