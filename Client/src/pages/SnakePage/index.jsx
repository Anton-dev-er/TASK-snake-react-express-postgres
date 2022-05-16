import React, { useContext, useEffect, useState } from "react";
import GameField from "../../components/GameField";
import styled from "styled-components";
import StatisticField from "../../components/StatisticField";
import { request } from "../../requestMethod";
import { UserContext } from "../../App";

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const SnakePage = () => {
  const [personalStat, setPersonalStat] = useState([]);
  const [topPlayer, setTopPlayer] = useState([]);
  const [gameSettings, setGameSettings] = useState({
    initSpeed: 200,
    initScore: 500,
    initDirection: "",
    initSnake: [{ x: 0, y: 0, direction: "", isHead: true }],
    initApple: {
      x: undefined,
      y: undefined,
      onField: false,
      score: 0,
      color: "",
    },
    step: 20,
    size: 400,
    speedIncrease: 50,
    colors: ["#42f2f5", "#426cf5", "#111470"],
    feeds: [1, 5, 10],
  });

  let { user, setUser } = useContext(UserContext);

  const createOrGetPlayer = async () => {
    let player;
    player = await request.get(`/player/${user.username}`);
    if (!player.data) {
      player = await request.post(`/player/`, { username: user.username });
    }
    return player.data;
  };

  const getPlayerGames = async () => {
    let data = await createOrGetPlayer();
    setUser({ ...user, ...data });
    let playerGames = await request.get(`game/player/${data.id}`);
    setPersonalStat(playerGames.data.slice(0, 10));
  };

  const getAllGames = async () => {
    const topPlayerData = await request.get(`/game/`);
    setTopPlayer(topPlayerData.data.slice(0, 10));
  };

  useEffect(() => {
    getAllGames();
  }, []);

  useEffect(() => {
    try {
      if (user.username) {
        getPlayerGames();
      }
    } catch {}
  }, [user.username]);

  return (
    <Container>
      <GameField
        gameSettings={gameSettings}
        personalStat={personalStat}
        setPersonalStat={setPersonalStat}
        topPlayer={topPlayer}
        setTopPlayer={setTopPlayer}
      />
      <StatisticField
        gameSettings={gameSettings}
        personalStat={personalStat}
        setPersonalStat={setPersonalStat}
        topPlayer={topPlayer}
        setTopPlayer={setTopPlayer}
      />

    </Container>
  );
};

export default SnakePage;
