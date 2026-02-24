const K_FACTOR = 32;

/**
 * Calculate expected score for player A against player B.
 */
export function expectedScore(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Calculate new ratings after a match.
 * score: 1 = player A wins, 0 = player B wins
 * Returns { newRatingA, newRatingB }
 */
export function calculateNewRatings(ratingA, ratingB, score) {
  const expectedA = expectedScore(ratingA, ratingB);
  const expectedB = 1 - expectedA;

  const newRatingA = Math.round(ratingA + K_FACTOR * (score - expectedA));
  const newRatingB = Math.round(ratingB + K_FACTOR * ((1 - score) - expectedB));

  return { newRatingA, newRatingB };
}

export const INITIAL_RATING = 1200;
