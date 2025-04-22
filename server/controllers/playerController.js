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






module.exports ={
    getPlayerStats,
    fetchPlayerAchievements,
    fetchPerformanceTrend


}