const Todo = require("../model/Todo");

const getTodos = (req, res) => {
  Todo.find({ uid: req.query.uid }, (err, todos) => {
    if (err) {
      res.send(err);
    }
    if (req.query.rawoutput == 'true') {
      res.set('Content-Type', 'text/plain');
      res.send(todos.map(t=>t.text).join('\n'));
    }
    else {
      res.json(todos);
    }
  });
};

const createTodo = (req, res) => {
  const todo = new Todo({
    text: req.query.text,
    uid: req.query.uid,
  });

  todo.save((err, todo) => {
    if (err) {
      res.send(err);
      return;
    }
    res.json(todo);
  });
};

const updateTodo = (req, res) => {
  Todo.findOneAndUpdate(
    { _id: req.params.todoID },
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
      },
    },
    { new: true },
    (err, Todo) => {
      if (err) {
        res.send(err);
      } else res.json(Todo);
    }
  );
};

const deleteTodo = (req, res) => {
  Todo.deleteOne({ _id: req.params.todoID })
    .then(() => res.json({ message: "Todo Deleted" }))
    .catch((err) => res.send(err));
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
