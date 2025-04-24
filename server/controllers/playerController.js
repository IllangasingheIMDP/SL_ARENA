const PlayerModel = require('../models/playerModel');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/constants');


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

// Fetch performance trend
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


// Fetch training reminders
//remind players about their training sessions
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

// Fetch player profile details
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


  const getPlayerPublicDetails = async (req, res) => {
    const {playerId} = req.params;
    console.log("in controller", playerId);
    try{
        const playerDetails = await PlayerModel.getPlayerPublicDetails(playerId);
        res.json({
            success: true,
            data: playerDetails
        });
    }catch(error) {
        console.error('Error fetching player public details:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
  }




module.exports ={
    getPlayerStats,
    fetchPlayerAchievements,
    fetchPerformanceTrend,
    fetchTrainingReminders,
    getPlayerProfileDetails,
    updateProfileBio,
    getPlayerPublicDetails



}