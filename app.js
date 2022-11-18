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
// api 1
app.post("/adduser/",async(request,response){
      const {username}=request.body;
      const query=`insert into usersllist (username)
      values (${username});`;
       const responseobj=await db.run(query)
       response.send("User added successfully")
});
//API 2
app.get("/usertasks/", async (request, response) => {
  const { username } = request.query;
  const query = `SELECT * FROM usertasks
    WHERE username='${username}';`;
  const responseobj = await db.get(query);
  response.send(responseobj);
});

// API 3
app.post("/addtask/", async (request, response) => {
  const { taskname, ischecked, username } = request.body;
  const query = `INSERT INTO usertask (taskname,ischeckes,username) VALUES (${username},'${ischecked}','${taskname}');`;
  await db.run(query);
  response.send("task Successfully Added");
});

app.put("/taskstatuschange/:taskid/", async (request, response) => {
  const { ischeckes, taskid } = request.params;
  const query = `select * from usertasks where id=${taskid}`;
  const response = await db.get(query);
  if (response.ischeckes === false) {
    const updatequery = `UPDATE usertasks SET ischeckes=${i}where id='${todoId}';`;
    await db.run(updatequery);
    response.send("Status Updated");
  } else {
    const i = false;
    const updatequery = `UPDATE todo SET ischeckes='${i}' where id='${taskid}';`;
    await db.run(query);
    response.send("Todo Updated");
  }
});

app.delete("/taskdelete/:taskid", async (request, response) => {
  const { taskid } = request.params;
  const query = `DELETE FROM usertasks
     WHERE id=${taskid};`;
  await db.run(query);
  response.send("Task Deleted");
});

module.exports = app;
