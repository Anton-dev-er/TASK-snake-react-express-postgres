const Router = require("express");
const router = new Router();
const gameController = require("../controllers/game.controller");

router.post("/", gameController.create);
router.get("/", gameController.getAll);
router.get("/player/:player_id", gameController.getPlayerGames);

module.exports = router;
