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

  const getPlayerMedia = async (req, res) => {
    try {
        const playerId = req.user.user_id;
        const media = await PlayerModel.getPlayerMedia(playerId);
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
  };


  const getFilteredMatches = async (req, res) => {
    try {
      
      const filters = {
        date: req.body.date,
        type: req.body.type,
        location: req.body.location
      };
      
  
      const matches = await PlayerModel.getFilteredMatches(filters);
  
      res.json({
        success: true,
        data: matches
      });
    } catch (error) {
      console.error('Error fetching filtered matches:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };


  const getMatchDetails = async (req, res) => {
    try {
      
      const matchId = req.params.id;
  
      const match = await PlayerModel.getMatchDetails(matchId);
  
      if (!match) {
        return res.status(404).json({ success: false, message: 'Match not found' });
      }
  
      res.json({
        success: true,
        data: match
      });
    } catch (error) {
      console.error('Error fetching match details:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  







module.exports ={
    getPlayerStats,
    fetchPlayerAchievements,
    fetchPerformanceTrend,

    fetchTrainingReminders,

    getPlayerProfileDetails,
    getPlayerMedia,
    updateProfileBio,
    getFilteredMatches,
    getMatchDetails



}