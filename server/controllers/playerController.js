const PlayerModel = require('../models/playerModel');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/constants');
const photosModel = require('../models/photosModel');
const videosModel = require('../models/videosModel');

const uploadVideo = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { title, description,videoUrl } = req.body;
    
    const result = await videosModel.uploadVideo(userId, title, description, videoUrl);
    res.json({
      success: true,
      message: 'Video uploaded successfully',
      data: result
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
const deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const result = await videosModel.deleteVideo(videoId);
    res.json({
      success: true,
      message: 'Video deleted successfully',
      data: result
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}




const getPlayerStats = async (req, res) => {
    try {
      const userId = req.user.user_id;
  
      const stats = await PlayerModel.getPlayerStats(userId);
  
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching player stats:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };


  const uploadPhotoForMatch = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { match_id, title, description } = req.body;
        const photoUrl = req.file.path;
        const result = await photosModel.uploadPhotoForMatch(userId, match_id, title, description, photoUrl);
        res.json({
            success: true,
            message: 'Photo stored successfully',
            data: result
        });
    } catch (error) {
        console.error('Error uploading photo:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  const uploadVideoForMatch = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { match_id, title, description,videoUrl } = req.body;
        
        const result = await videosModel.uploadVideoForMatch(userId, match_id, title, description, videoUrl);
        res.json({
            success: true,
            message: 'Video stored successfully',
            data: result
        });
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
  }
  
  const uploadPhoto = async (req, res) => {
    console.log(req.file,'req.file');
    try {
        const userId = req.user.user_id;
        const { title, description } = req.body;
        const photoUrl = req.file.path;
        const result = await photosModel.uploadPhoto(userId, title, description, photoUrl);
        res.json({
            success: true,
            message: 'Photo uploaded successfully',
            data: result
        });
    } catch (error) {
        console.error('Error uploading photo:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }

  }

  const getPlayerPhotos = async (req, res) => {
    try {
        const userId = req.params.userId;
        const photos = await photosModel.getPlayerPhotos(userId);
        res.json({ success: true, data: photos });
    } catch (error) {
        console.error('Error fetching player photos:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
  }



  const fetchPlayerAchievements = async (req, res) => {
    try {
      const userId = req.user.user_id;
  
      const achievements = await PlayerModel.getPlayerAchievements(userId);
  
      res.json({
        success: true,
        data: achievements
      });
    } catch (error) {
      console.error('Error fetching achievements:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };


  const fetchPerformanceTrend = async (req, res) => {
    try {
      const playerId = req.user.user_id;
  
      const data = await PlayerModel.getPerformanceOverTime(playerId);
  
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error fetching performance trend:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };



  const fetchTrainingReminders = async (req, res) => {
    try {
      const playerId = req.user.user_id;
  
      const sessions = await PlayerModel.getTrainingSessionsByPlayer(playerId);
  
      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error('Error fetching training sessions:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  const getAllPlayers = async (req, res) => {
    try {
        const players = await PlayerModel.getAllPlayers();
        res.json({
            success: true,
            data: players
        });
    } catch (error) {
        console.error('Error fetching all players:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  const getPlayerProfileDetails= async (req,res)=>{
    try {
        const player_id = req.user.user_id;
        const data = await PlayerModel.getPlayerProfileDetails(player_id);
        res.json({
            success: true,
            data
        });

    }catch (error) {
        console.error('Error fetching player profile details:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
  }
  const getPublicPlayerProfileDetails= async (req,res)=>{
    try {
        const player_id = req.params.player_id;
        const data = await PlayerModel.getPlayerProfileDetails(player_id);
        res.json({
            success: true,
            data
        });

    }catch (error) {
        console.error('Error fetching player profile details:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  const getPlayerVideos = async (req, res) => {
    try {
        const playerId = req.params.userId;
        const media = await PlayerModel.getPlayerVideos(playerId);
        res.json({
            success: true,
            data: media
        });
    } catch (error) {
        console.error('Error fetching player media:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  const updateProfileBio = async (req, res) => {
    try{
        const playerId = req.user.user_id;
        const { bio } = req.body;
        const updated = await PlayerModel.updateProfileBio(playerId, bio);
        if (updated) {
            res.json({
                success: true,
                message: 'Profile bio updated successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to update profile bio'
            });
        } 
    }catch (error) {
        console.error('Error updating profile bio:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  const deletePhoto = async (req, res) => {
    try {
        const photoId = req.params.photoId;
        const result = await photosModel.deletePhoto(photoId);
        res.json({
            success: true,
            message: 'Photo deleted successfully',
            data: result
        });
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
  }


  const getTeamsByLeader = async (req, res) => {
    try {
      const playerId = req.user.user_id;
      const teams = await PlayerModel.getTeamsByLeader(playerId);
      
      res.json({
        success: true,
        data: teams
      });
    } catch (error) {
      console.error('Error fetching teams by leader:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error',
        error: error.message 
      });
    }
  };




module.exports ={
  deletePhoto,
    getPlayerStats,
    fetchPlayerAchievements,
    fetchPerformanceTrend,
    uploadPhotoForMatch,
    fetchTrainingReminders,
    uploadPhoto,
    getPlayerProfileDetails,
    getPlayerPhotos,
    updateProfileBio,
    getPlayerVideos,
    uploadVideo,
    deleteVideo,
    uploadVideoForMatch,
    getAllPlayers,
    getPublicPlayerProfileDetails
    getTeamsByLeader

}