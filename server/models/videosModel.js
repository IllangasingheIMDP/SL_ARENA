const db = require("../config/dbconfig"); // assuming you use MySQL2 or similar

const getPlayerVideos = async (userId) => {
  const [rows] = await db.execute(
    `SELECT * FROM Videos WHERE user_id = ?`,
    [userId]
  );
  return rows;
};
const deletePlayerVideos = async (video_id) => {
  const [rows] = await db.execute(
    `DELETE FROM Videos WHERE video_id = ?`,
    [video_id]
  );
  return rows;
};

const uploadVideo = async (userId, title, description, videoUrl) => {
  const [rows] = await db.execute(
    `INSERT INTO Videos (user_id, title, description, video_url) VALUES (?, ?, ?, ?)`,
    [userId, title, description, videoUrl]
  );
  return rows;
};

const uploadVideoForMatch = async (userId, match_id, title, description, videoUrl) => {
  const [rows] = await db.execute(
    `INSERT INTO Videos (user_id, match_id, title, description, video_url) VALUES (?, ?, ?, ?, ?)`,
    [userId, match_id, title, description, videoUrl]
  );
  return rows;
};

const deleteVideo = async (videoId) => {
  const [rows] = await db.execute(
    `DELETE FROM Videos WHERE video_id = ?`,
    [videoId]
  );
  return rows;
};

module.exports = {
  getPlayerVideos,
  uploadVideo,
  uploadVideoForMatch,
  deleteVideo,
  deletePlayerVideos
};
