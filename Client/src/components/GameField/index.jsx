import React, { useContext, useEffect, useState } from "react";
import useInterval from "../../hooks/UseInterval";
import Block from "../Block";
import { isObjectsEquals } from "../../utils";
import styled from "styled-components";
import { UserContext } from "../../App";
import { request } from "../../requestMethod";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 4000;
  &:focus {
    outline: none;
  }
`;

const Score = styled.h3`
  font-size: 32px;
  margin: 0;
`;

const GameFieldSnake = styled.div`
  position: relative;

  height: ${(props) => props.size + "px"};
  width: ${(props) => props.size + "px"};
  opacity: ${(props) => props.opacity};
  background-color: #ffd854;
  border: 1px solid black;
`;

const StatusGame = styled.h3`
  position: absolute;

  color: #545454;
  font-size: 32px;
  z-index: 3000;
`;

const GameField = ({
  gameSettings,
  personalStat,
  setPersonalStat,
  topPlayer,
  setTopPlayer,
}) => {
  const [direction, setDirection] = useState(gameSettings.initDirection);
  const [score, setScore] = useState(gameSettings.initScore);
  const [snake, setSnake] = useState(gameSettings.initSnake);
  const [apple, setApple] = useState(gameSettings.initApple);
  const [delay, setDelay] = useState(null);

  const [gameStatus, setGameStatus] = useState({
    start: false,
    stop: false,
    over: false,
    win: false,
  });

  const { user } = useContext(UserContext);

  const createNewGame = async () => {

    if (user.username) {
      await request.post(`/game`, {
        score: score,
        player_id: user.id,
      });
    }

    personalStat.push({ score: score });
    setPersonalStat(
      personalStat.sort((a, b) => b.score - a.score).slice(0, 10)
    );

    topPlayer.push({ score: score, username: user.username });
    setTopPlayer(topPlayer.sort((a, b) => b.score - a.score).slice(0, 10));
  };

  useEffect(() => {
    if (gameStatus.win) {
      alert(`You Win !!!!!!!!!!!!!!!!!!!!, Your Score ${score}`);
      setGameStatus({ start: false, stop: false, over: false, win: false });
      setDelay(null);
      reset();
    }
  }, [gameStatus]);

  useEffect(() => {
    if (snake.length === gameSettings.size ** 2 / gameSettings.step ** 2) {
      setGameStatus({ ...gameStatus, win: true });
    } else {
      if (!apple.onField && direction !== "" && !gameStatus.stop) {
        checkIsAppleInnerSnakeAndGenerate();
      } else {
        checkIsAppleAte();
      }
    }
  }, [apple, direction, snake, score]);

  useInterval(() => {
    if (gameStatus.start && !gameStatus.stop) {
      checkOnCollision();
      showSnake();
    } else if (!gameStatus.stop) {
      setDelay(null);
      createNewGame();
    }
  }, delay);

  const showSnake = () => {
    let newSnake = [];
    if (direction) {
      snake.forEach((item, index, arr) => {
        if (item.isHead) {
          item.direction = direction;
          newSnake.push(moveSnake(item));
        } else {
          item.direction = arr[index + 1].direction;
          newSnake.push(moveSnake(item));
        }
      });
      setSnake(newSnake);
    }
  };

  const moveSnake = (value, isNewBlock = false) => {
    let newValue = {};
    let step = gameSettings.step;
    let border = gameSettings.size - step;
    if (isNewBlock) {
      step = -step;
    } else if (
      (value.x >= border && value.direction === "Right") ||
      (value.y >= border && value.direction === "Down") ||
      (value.x <= 0 && value.direction === "Left") ||
      (value.y <= 0 && value.direction === "Up")
    ) {
      step = -border;
    }

    if (value.direction === "Right") {
      newValue = { ...value, x: value.x + step };
    } else if (value.direction === "Down") {
      newValue = { ...value, y: value.y + step };
    } else if (value.direction === "Left") {
      newValue = { ...value, x: value.x - step };
    } else if (value.direction === "Up") {
      newValue = { ...value, y: value.y - step };
    }
    return newValue;
  };

  const defineDirection = (event) => {
    if (!gameStatus.over) {
      switch (event.key) {
        case "ArrowDown":
          setDirection("Down");
          break;
        case "ArrowUp":
          setDirection("Up");
          break;
        case "ArrowLeft":
          setDirection("Left");
          break;
        case "ArrowRight":
          setDirection("Right");
          break;
        case "Enter":
          setGameStatus({ start: true, stop: false, over: false, win: false });
          setDelay(
            gameSettings.initSpeed /
              (1 + Math.floor(score / gameSettings.speedIncrease) / 10)
          );
          break;
        case " ":
          setGameStatus({ start: false, stop: true, over: false, win: false });
          break;
      }
    } else {
      setGameStatus({ start: false, stop: false, over: false, win: false });
      reset();
    }
  };

  const addBlock = () => {
    const newSnake = [];
    let head;
    let lastSnakeBlock;
    snake.forEach((item, index) => {
      if (item.isHead && index === 0) {
        head = { ...item };
        lastSnakeBlock = { ...head };
      } else if (item.isHead) {
        head = { ...item };
      } else if (index === 0) {
        lastSnakeBlock = { ...item };
      } else {
        newSnake.push(item);
      }
    });
    let newBlock = moveSnake({ ...lastSnakeBlock, isHead: false }, true);
    setSnake(
      snake.length !== 1
        ? [newBlock, lastSnakeBlock, ...newSnake, head]
        : [newBlock, head]
    );
  };

  const checkOnCollision = () => {
    snake.forEach((item, index, array) => {
      let obj1 = { x: item.x, y: item.y };
      let obj2 = { x: array[array.length - 1].x, y: array[array.length - 1].y };

      const result = isObjectsEquals(obj1, obj2);
      if (result && !item.isHead) {
        setGameStatus({ start: false, stop: false, over: true, win: false });
      }
    });
  };

  const checkIsAppleAte = () => {
    let obj1 = { x: apple.x, y: apple.y };
    let obj2 = { x: snake[snake.length - 1].x, y: snake[snake.length - 1].y };
    const result = isObjectsEquals(obj1, obj2);
    if (result) {
      setApple({ ...apple, onField: false });
      setScore(() => score + apple.score);
      addBlock();
    }
  };

  const checkIsAppleInnerSnakeAndGenerate = () => {
    let loop = true;
    let appleCoordinate = generateAppleCoordinate();
    let isDuplicate;
    while (loop) {
      isDuplicate = false;
      snake.forEach((item) => {
        if (isObjectsEquals(appleCoordinate, { x: item.x, y: item.y })) {
          isDuplicate = true;
        }
      });
      if (isDuplicate) {
        appleCoordinate = generateAppleCoordinate();
      } else {
        loop = false;
      }
    }

    const feeds = gameSettings.feeds;
    const colors = gameSettings.colors;
    let feed = feeds[Math.floor(Math.random() * feeds.length)];
    let color = colors[feeds.indexOf(feed)];

    setApple({ ...appleCoordinate, onField: true, score: feed, color: color });
  };

  const generateAppleCoordinate = () => {
    const min = 0;
    const max = gameSettings.size / gameSettings.step;
    let x = (Math.floor(Math.random() * (max - min)) + min) * gameSettings.step;
    let y = (Math.floor(Math.random() * (max - min)) + min) * gameSettings.step;

    return { x, y };
  };

  const renderStatusGame = () => {
    let title;
    if (gameStatus.start) {
      title = "";
    } else if (gameStatus.stop) {
      title = "Press Enter";
    } else if (gameStatus.over) {
      title = "Game over";
    } else {
      title = "Press Enter";
    }
    return <StatusGame>{title}</StatusGame>;
  };

  const reset = () => {
    setDirection(gameSettings.initDirection);
    setScore(gameSettings.initScore);
    setSnake(gameSettings.initSnake);
    setApple(gameSettings.initApple);
  };

  return (
    <Container onKeyDown={defineDirection} tabIndex="0">
      <Score>{score}</Score>
      {renderStatusGame()}
      <GameFieldSnake
        size={gameSettings.size}
        opacity={gameStatus.start ? 1 : 0.2}
      >
        {snake.map((item, index) => (
          <Block
            key={index}
            z={1002}
            coordinates={item}
            color={item.isHead ? "black" : "white"}
            step={gameSettings.step}
          />
        ))}
        <Block
          z={1001}
          coordinates={apple}
          color={apple.color}
          step={gameSettings.step}
        />
      </GameFieldSnake>
    </Container>
  );
};

export default GameField;
