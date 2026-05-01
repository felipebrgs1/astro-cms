import initSqlJs from "sql.js";
import { readFileSync } from "node:fs";

const SQL = await initSqlJs();
const db = new SQL.Database(readFileSync("/home/felipeb/astroweb/.local.db"));
const result = db.exec("SELECT id, title, status FROM posts");
console.log("Posts:", JSON.stringify(result?.[0]?.values ?? []));
