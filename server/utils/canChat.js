import Follow from "../models/Follow.js";

// Two users can chat only if at least one follows the other,
// based on the actual Follow collection (not User.followers/following,
// which this project doesn't use).
export const canUsersChat = async (userIdA, userIdB) => {
  if (userIdA.toString() === userIdB.toString()) return false;

  // Does A follow B?
  const aFollowsB = await Follow.findOne({
    followerId: userIdA,
    userId: userIdB,
  });

  // Does B follow A?
  const bFollowsA = await Follow.findOne({
    followerId: userIdB,
    userId: userIdA,
  });

  return !!(aFollowsB || bFollowsA);
};