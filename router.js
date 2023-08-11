const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("./controllers/Todo");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Let's build a CRUD API!");
});

router.get("/get", getTodos);
router.get("/post", createTodo);
// router.put("/todos/:todoID", updateTodo);
// router.delete("/todos/:todoID", deleteTodo);

module.exports = router;
