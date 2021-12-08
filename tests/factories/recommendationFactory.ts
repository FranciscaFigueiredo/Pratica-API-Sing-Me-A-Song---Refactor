import faker from "faker";
import connection from "../../src/database";

export async function createRecommendation(score: number = 0) {
  const youtubeLink = `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(
    11
  )}`;

  return await connection.query(
    `
    INSERT INTO recommendations
    (name, "youtubeLink", score)
    VALUES
    ($1, $2, $3)
    RETURNING *
  `,
    [faker.name.findName(), youtubeLink, score]
  );
}
