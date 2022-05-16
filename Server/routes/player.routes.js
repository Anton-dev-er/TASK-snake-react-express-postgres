const Router = require("express");
const router = new Router();
const playerController = require("../controllers/player.controller");

router.post("/", playerController.create);
router.get("/", playerController.getAll);
router.get("/:username", playerController.getOneByUsername);

module.exports = router;
