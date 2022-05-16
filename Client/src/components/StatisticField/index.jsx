import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import PlayerList from "../PlayerList";
import axios from "axios";
import { UserContext } from "../../App";
import { request } from "../../requestMethod";

const buttons = {
  topPlayer: "topPlayer",
  personalStat: "personalStat",
};

const Container = styled.div`
  display: flex;
  align-self: flex-end;

  margin-left: 50px;

  height: ${(props) => props.size + "px"};
  width: ${(props) => props.size + "px"};

  background-color: rgba(79, 255, 149, 0.56);
`;

const Toggle = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  align-items: center;
`;

const ToggleButton = styled.div`
  margin-right: 16px;
  padding: 8px;
  border: 1px solid #545454;

  cursor: pointer;

  background-color: ${(props) =>
    props.active ? "rgba(231, 231, 231, 0.98)" : ""};

  &:hover {
    background-color: rgba(231, 231, 231, 0.98);
  }
`;

const NameInput = styled.input`
  position: absolute;
  bottom: 0;

  margin-left: 16px;
  margin-bottom: 8px;
  padding: 5px 20px;

  background: transparent;
  border: 1px solid black;

  &:active,
  :hover,
  :focus {
    outline: 0;
    outline-offset: 0;
  }
`;

const Name = styled.h3`
  height: 100%;
  margin: 0;
  font-weight: bold;
`;

const StatisticField = ({
  gameSettings,
  personalStat,
  topPlayer,
}) => {
  const [currentToggleButton, setCurrentToggleButton] = useState("");

  let { user, setUser } = useContext(UserContext);

  const handleClickTopPlayer = () => {
    setCurrentToggleButton(buttons.topPlayer);
  };

  const handleClickPersonalStat = () => {
    setCurrentToggleButton(buttons.personalStat);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      setUser({ ...user, username: e.target.value });
    }
  };

  return (
    <Container size={gameSettings.size}>
      <Toggle>
        <ToggleButton
          active={currentToggleButton === buttons.topPlayer}
          onClick={handleClickTopPlayer}
        >
          Top player
        </ToggleButton>
        <ToggleButton
          active={currentToggleButton === buttons.personalStat}
          onClick={handleClickPersonalStat}
        >
          Personal statistic
        </ToggleButton>
        <Name>Hello {user.username}</Name>
      </Toggle>
      {currentToggleButton === buttons.topPlayer ? (
        <PlayerList data={topPlayer} />
      ) : (
        <PlayerList data={personalStat} />
      )}

      <NameInput
        onKeyDown={onKeyDown}
        placeholder="Input you username"
        type="text"
      />
    </Container>
  );
};

export default StatisticField;
