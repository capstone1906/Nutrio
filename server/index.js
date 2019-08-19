const express = require("express");
const app = express();
const db = require("./db/postgres/db");
module.exports = app;


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/api", require("./api"));

const server = app.listen(3000, () =>
  console.log(`Mixing it up on port ${3000}`)
);

async function start() {
  await db.sync();
  //await server();
}

start();
