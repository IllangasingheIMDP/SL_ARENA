const db = require("../config/dbconfig"); // assuming you use MySQL2 or similar

const getPlayerPhotos = async (userId) => {
  const [rows] = await db.execute(
    `SELECT * FROM Photos WHERE user_id = ?`,
    [userId]
  );
  return rows;
};

const uploadPhoto = async (userId,title,description, photoUrl) => {
  const [rows] = await db.execute(
    `INSERT INTO Photos (user_id, title, description, photo_url) VALUES (?, ?, ?, ?)`,
    [userId, title, description, photoUrl]
  );
  return rows;
};
const uploadPhotoForMatch = async (userId,match_id,title,description, photoUrl) => {
    const [rows] = await db.execute(
        `INSERT INTO Photos (user_id, match_id, title, description, photo_url) VALUES (?, ?, ?, ?, ?)`,
        [userId, match_id, title, description, photoUrl]
    );
    return rows;
};
const deletePhoto = async (photoId) => {
  const [rows] = await db.execute(
    `DELETE FROM Photos WHERE photo_id = ?`,
    [photoId]
  );
  return rows;
};



module.exports = {
  getPlayerPhotos,
  uploadPhoto,
  uploadPhotoForMatch,
  deletePhoto
};