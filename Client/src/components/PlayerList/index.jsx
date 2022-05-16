import React from "react";
import styled from "styled-components";

const Container = styled.ul`
  font-size: 24px;
  overflow: hidden;
  max-height: 75%;
`;

const Item = styled.li``;

const PlayerList = ({ data }) => {
  return (
    <Container>
      {data.length ? (
        data.map((item, index) => (
          <Item key={index}>
            {item.score} {item.username ? `- ${item.username}` : ""}
          </Item>
        ))
      ) : (
        <Item key={1}>Input your name and play your first game </Item>
      )}
    </Container>
  );
};

export default PlayerList;
