import connection from "../../src/database";

export async function cleanDatabase() {
  await connection.query(`TRUNCATE recommendations RESTART IDENTITY`);
}

export async function endConnection() {
  await connection.end();
}
