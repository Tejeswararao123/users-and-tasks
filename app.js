const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");

let db = null;
const dbpath = path.join(__dirname, "todoApplication.db");
const app = express();
app.use(express.json());
app.use(cors());

const initializeDbAndServer = async () => {
  db = await open({
    filename: dbpath,
    driver: sqlite3.Database,
  });
  app.listen(process.env.PORT || 3001, () => {
    console.log("Server is running");
  });
};
initializeDbAndServer();
//API 1
app.get("/todos/", async (request, response) => {
  try {
    const { status = "", priority = "", search_q = "" } = request.query;
    console.log(search_q);
    const query = `SELECT * FROM todo
    WHERE status LIKE '%${status}%'
    AND priority LIKE '%${priority}%'
    AND todo like '%${search_q}%' ;`;
    const dbaesponsearray = await db.all(query);
    response.send(dbaesponsearray);
  } catch (e) {
    console.log(e.message);
  }
});
//API 2
app.get("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const query = `SELECT * FROM todo
    WHERE id='${todoId}';`;
  const responseobj = await db.get(query);
  response.send(responseobj);
});
// API 3
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;

  const query = `INSERT INTO todo(id,todo,priority,status)
    VALUES (${id},'${todo}','${priority}','${status}');`;
  await db.run(query);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { status, priority, todo } = request.body;
  const { todoId } = request.params;

  if (status !== undefined) {
    const query = `UPDATE todo SET status='${status}'
  where id='${todoId}';`;
    await db.run(query);
    response.send("Status Updated");
  } else if (priority !== undefined) {
    const query = `UPDATE todo SET priority='${priority}'
  where id='${todoId}';`;
    await db.run(query);
    response.send("Priority Updated");
  } else {
    const query = `UPDATE todo SET todo='${todo}'
  where id='${todoId}';`;
    await db.run(query);
    response.send("Todo Updated");
  }
});

app.delete("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const query = `DELETE FROM todo
     WHERE id=${todoId};`;
  await db.run(query);
  response.send("Todo Deleted");
});

module.exports = app;
