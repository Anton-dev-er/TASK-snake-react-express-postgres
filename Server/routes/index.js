const Router = require("express");
const router = new Router();

const game = require("./game.routes");
const player = require("./player.routes");

router.use("/game", game);
router.use("/player", player);

module.exports = router;
