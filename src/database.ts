import pg from "pg";

const { Pool } = pg;

const dbConfig = {
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "123123",
  database: "sing_me_a_song",
};

const connection = new Pool(dbConfig);

export default connection;
