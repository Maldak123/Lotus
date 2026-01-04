import React from "react";
import "./index.css";

interface LogoProps{
  animated?: boolean
}

const LogoAnimated = ({animated}: LogoProps) => {
  const ids = animated ? ["um", "dois", "tres", "quatro"]: []
  const rotations = ["", "rotate-90", "rotate-45", "rotate-135"];

  return (
    <div
      className="cursor-pointer relative size-12.25 flex justify-center items-center"
    >
      {rotations.map((rotation, index) => (
        <svg
          key={index}
          id={ids[index]}
          className={`absolute w-3 ${rotation}`}
          viewBox="0 0 26 105"
          overflow="visible"
        >
          <path
            d="M 13 0 C 13.013 0 26 23.505 26 52.5 C 26 81.495 13 105 13 105 C 13 105 0 81.495 0 52.5 C 0 23.505 12.987 0 13 0 Z"
            fill="rgba(204, 204, 204, 0)"
            strokeWidth="3"
            stroke="#AAA"
          />
        </svg>
      ))}
    </div>
  );
};

export default LogoAnimated;
