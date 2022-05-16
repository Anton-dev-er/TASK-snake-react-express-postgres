const db = require("../db");

const CREATE_GAME = `INSERT INTO game (score, player_id) values ($1, $2) returning *`;
const GET_ALL_GAMES = `
  SELECT *
  FROM game
  LEFT JOIN player
  ON game.player_id = player.id ORDER BY -score`;
const GET_GAME_BY_PLAYER = `SELECT * FROM game WHERE player_id = $1 ORDER BY -score`;


class GameController {
  async create(req, res) {
    const { score, player_id } = req.body;

    if (!score || !player_id) {
      return res
        .status(400)
        .json({ error: true, message: "The [score || player_id] is required" });
    }

    try {
      const newGame = await db.query(CREATE_GAME, [score, player_id]);
      res.json(newGame.rows[0]);
    } catch (e) {
      res.status(500).json({ error: true, message: e });
    }
  }

  async getAll(req, res) {
    try {
      const games = await db.query(GET_ALL_GAMES);
      res.json(games.rows);
    } catch (e) {
      res.status(500).json({ error: true, message: e });
    }
  }

  async getPlayerGames(req, res) {
    try {
      const games = await db.query(GET_GAME_BY_PLAYER, [req.params.player_id]);
      res.json(games.rows);
    } catch (e) {
      res.status(500).json({ error: true, message: e });
    }
  }
}

module.exports = new GameController();
