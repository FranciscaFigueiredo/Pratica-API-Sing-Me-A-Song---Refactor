import connection from "../database";
import { Recommendation } from "../protocols/Recommendation";
import { QueryResult } from 'pg';

export interface RecommendationDB extends Recommendation {
  id: number;
}

export async function create(recommendation: Recommendation) {
  const {
    name,
    youtubeLink,
    score,
  } = recommendation;

  await connection.query(
    `
    INSERT INTO songs
    (name, "youtube_link", score)
    VALUES
    ($1, $2, $3)
  `,
    [name, youtubeLink, score]
  );
}

export async function findById(id: number): Promise<RecommendationDB> {
  const result = await connection.query(
    `
    SELECT * FROM songs WHERE id = $1
  `,
    [id]
  );

  return result.rows[0];
}

export async function incrementScore(id: number, increment: number): Promise<QueryResult<any>> {
  return await connection.query(
    `
    UPDATE songs SET score = score + $1 WHERE id = $2
  `,
    [increment, id]
  );
}

export async function destroy(id: number) {
  return await connection.query(
    `
    DELETE FROM songs WHERE id = $1
  `,
    [id]
  );
}

export async function findRecommendations(
  minScore: number,
  maxScore: number = Infinity,
  orderBy: string = ""
) {
  let where = "";
  let params = [minScore];

  if (maxScore === Infinity) {
    where = "score >= $1";
  } else {
    where = "score BETWEEN $1 AND $2";
    params.push(maxScore);
  }

  let query = `SELECT * FROM songs WHERE ${where}`;

  if (orderBy) {
    query += ` ORDER BY ${orderBy}`;
  }

  const result = await connection.query(query, params);

  return result.rows;
}
