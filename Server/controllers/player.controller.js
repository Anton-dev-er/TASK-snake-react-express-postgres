const db = require("../db");

const CREATE_USER = `INSERT INTO player (username) values ($1) returning *`;
const GET_ALL_USERS = "SELECT * FROM player";
const GET_ONE_USER = `SELECT * FROM player where username = $1`;

class PlayerController {
  async create(req, res) {
    const { username } = req.body;
    if (!username) {
      return res
        .status(400)
        .json({ error: true, message: "The [username] is required"});
    }
    try {
      const newPlayer = await db.query(CREATE_USER, [username]);
      res.json(newPlayer.rows[0]);
    } catch (e) {
      res.json({ error: true, message: e});
    }
  }

  async getAll(req, res) {
    try {
      const users = await db.query(GET_ALL_USERS);
      res.json(users.rows);
    } catch (e) {
      res.json({ error: true, message: e});
    }
  }

  async getOneByUsername(req, res) {
    try {
      const username = req.params.username;
      const user = await db.query(GET_ONE_USER, [username]);
      res.json(user.rows[0]);
    } catch (e) {
      res.json({ error: true, message: e});
    }
  }
}

module.exports = new PlayerController();
