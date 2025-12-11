import sqlite3 from "sqlite3";
import path from "path";
const DB_PATH = path.join(process.cwd(), "database.db");

const raw = new sqlite3.Database(DB_PATH);

export function run(sql, params = []) {
  return new Promise((res, rej) => {
    raw.run(sql, params, function (err) {
      if (err) return rej(err);
      return res(this);
    });
  });
}

export function get(sql, params = []) {
  return new Promise((res, rej) => {
    raw.get(sql, params, (err, row) => {
      if (err) return rej(err);
      return res(row);
    });
  });
}

export function all(sql, params = []) {
  return new Promise((res, rej) => {
    raw.all(sql, params, (err, rows) => {
      if (err) return rej(err);
      return res(rows);
    });
  });
}
