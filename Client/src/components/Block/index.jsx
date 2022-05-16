import React from "react";
import styled from "styled-components";

const BlockSnake = styled.div`
  position: absolute;
  height: ${(props) => props.step + "px"};
  width: ${(props) => props.step + "px"};
  
  top: ${(props) => props.y + "px"};
  left: ${(props) => props.x + "px"};
  z-index: ${(props) => props.z};
  background-color: ${(props) => props.color};
`;

const Block = ({ coordinates, color, z, step }) => {
  return (
    <BlockSnake
      step={step}
      x={coordinates.x}
      y={coordinates.y}
      z={z}
      color={color}
    />
  );
};

export default Block;
