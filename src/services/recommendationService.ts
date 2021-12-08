import getYouTubeID from "get-youtube-id";

import * as recommendationRepository from "../repositories/recommendationRepository";

export async function saveRecommendation(name: string, youtubeLink: string) {
  const youtubeId = getYouTubeID(youtubeLink);

  if (youtubeId === null) {
    return null;
  }

  const initialScore = 0;
  return await recommendationRepository.create(name, youtubeLink, initialScore);
}

export async function upvoteRecommendation(id: number) {
  return await changeRecommendationScore(id, 1);
}

export async function downvoteRecommendation(id: number) {
  const recommendation = await recommendationRepository.findById(id);
  if (recommendation.score === -5) {
    return await recommendationRepository.destroy(id);
  } else {
    return await changeRecommendationScore(id, -1);
  }
}

export async function getRandomRecommendation() {
  const random = Math.random();

  let recommendations;
  const orderBy = "RANDOM()";

  if (random > 0.7) {
    recommendations = await recommendationRepository.findRecommendations(
      -5,
      10,
      orderBy
    );
  } else {
    recommendations = await recommendationRepository.findRecommendations(
      11,
      Infinity,
      orderBy
    );
  }

  return recommendations[0];
}

async function changeRecommendationScore(id: number, increment: number) {
  const result = await recommendationRepository.incrementScore(id, increment);
  return result.rowCount === 0 ? null : result;
}
