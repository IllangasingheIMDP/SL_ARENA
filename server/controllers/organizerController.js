const OrganizerModel = require("../models/organizerModel");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/constants");
const db = require("../config/dbconfig");

const createTournament = async (req, res) => {
  try {
    const userId = req.user.user_id; // organizer_id

    const {
      tournament_name,
      start_date,
      end_date,
      tournament_type,
      rules,
      venue_id,
      capacity,
    } = req.body;

    if (!tournament_name) {
      return res.status(400).json({ message: "Tournament name is required" });
    }

    const newTournamentId = await OrganizerModel.createTournament({
      organizer_id: userId,
      tournament_name,
      start_date,
      end_date,
      tournament_type,
      rules,
      venue_id,
      capacity,
    });

    res.status(201).json({
      message: "Tournament created successfully",
      tournament_id: newTournamentId,
    });
  } catch (err) {
    console.error("Error creating tournament:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTournamentsByOrganizerController = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const rows = await OrganizerModel.getTournamentsByOrganizer(userId);

    const tournaments = rows.map((row) => ({
      tournament: {
        tournament_id: row.tournament_id,
        tournament_name: row.tournament_name,
        start_date: row.start_date,
        end_date: row.end_date,
        tournament_type: row.tournament_type,
        rules: row.rules,
        status: row.status,
        venue_id: row.venue_id,
      },
      organizer: {
        organizer_id: row.organizer_id,
        name: row.organizer_name,
        email: row.organizer_email,
      },
      venue: {
        venue_id: row.venue_id,
      },
    }));

    res.status(200).json({
      message: "Tournaments fetched successfully",
      data: tournaments,
    });
  } catch (err) {
    console.error("Error fetching tournaments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAppliedTeamsToOngoingTournaments = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const teams =
      await OrganizerModel.getAppliedTeamsToOngoingTournamentsByOrganizer(
        userId
      );

    res.status(200).json({
      message: "Applied teams to ongoing tournaments fetched successfully",
      data: teams,
    });
  } catch (err) {
    console.error("Error fetching applied teams:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const acceptTournamentApplicant = async (req, res) => {
  try {
    const { id } = req.body;
    await OrganizerModel.updateApplicantStatus(id, "accepted");

    res.status(200).json({ message: "Applicant accepted successfully" });
  } catch (err) {
    console.error("Error accepting applicant:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const rejectTournamentApplicant = async (req, res) => {
  try {
    const { id } = req.body;
    await OrganizerModel.updateApplicantStatus(id, "rejected");

    res.status(200).json({ message: "Applicant rejected successfully" });
  } catch (err) {
    console.error("Error rejecting applicant:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAcceptedTeamsByTournament = async (req, res) => {
  try {
    const { tournament_id } = req.body;

    if (!tournament_id) {
      return res.status(400).json({ message: "tournament_id is required" });
    }

    const teams = await OrganizerModel.getAcceptedTeamsByTournament(
      tournament_id
    );

    res.status(200).json({
      message: "Accepted teams fetched successfully",
      data: teams,
    });
  } catch (err) {
    console.error("Error fetching accepted teams:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getPlayersWithStats = async (req, res) => {
  try {
    const { team_id } = req.body;

    if (!team_id) {
      return res.status(400).json({ message: "team_id is required" });
    }

    const players = await OrganizerModel.getPlayersWithStatsByTeam(team_id);

    res.status(200).json({
      message: "Players fetched successfully",
      data: players,
    });
  } catch (err) {
    console.error("Error fetching players:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTeamsNotApplied = async (req, res) => {
  try {
    const { tournament_id } = req.body;

    if (!tournament_id) {
      return res.status(400).json({ message: "tournament_id is required" });
    }

    const teams = await OrganizerModel.getTeamsNotAppliedToTournament(
      tournament_id
    );

    res.status(200).json({
      message: "Teams not applied to this tournament",
      data: teams,
    });
  } catch (err) {
    console.error("Error fetching teams not applied:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const sendTournamentInvite = async (req, res) => {
  try {
    const { tournament_id, team_id } = req.body;

    if (!tournament_id || !team_id) {
      return res
        .status(400)
        .json({ message: "tournament_id and team_id are required" });
    }

    const insertId = await OrganizerModel.createTournamentInvite(
      tournament_id,
      team_id
    );

    res.status(201).json({
      message: "Invite sent successfully",
      invite_id: insertId,
    });
  } catch (err) {
    console.error("Error sending invite:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addInning = async (req, res) => {
    //console.log("addInning called");
  const { match_id, batting_team_id, bowling_team_id } = req.body;
  //console.log(match_id, batting_team_id, bowling_team_id,"addInning called");
  if (!match_id || !batting_team_id || !bowling_team_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await OrganizerModel.createInning(
      match_id,
      batting_team_id,
      bowling_team_id
    );
    res
      .status(201)
      .json({
        message: "Inning added successfully",
        inning_id: result.insertId,
      });
  } catch (error) {
    console.error("Error creating inning:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addDelivery = async (req, res) => {
  try {
    const {
      inning_id,
      over_number,
      ball_number,
      batsman_id,
      bowler_id,
      runs_scored,
      extras,
      wicket,
      dismissal_type,
      extra_type,
    } = req.body;

    const result = await OrganizerModel.insertDelivery({
      inning_id,
      over_number,
      ball_number,
      batsman_id,
      bowler_id,
      runs_scored,
      extras,
      wicket,
      dismissal_type,
      extra_type,
    });

    res
      .status(201)
      .json({
        message: "Delivery inserted successfully",
        insertId: result.insertId,
      });
  } catch (error) {
    console.error("Error inserting delivery:", error);
    res.status(500).json({ error: "Error inserting delivery" });
  }
};

const getCurrentBatsmenRuns = async (req, res) => {
  try {
    const { inning_id } = req.body;

    const batsmen = await OrganizerModel.getCurrentBatsmenRuns(inning_id);

    res.status(200).json({ batsmen });
  } catch (error) {
    console.error("Error fetching current batsmen runs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getNextBallController = async (req, res) => {
  try {
    const { inning_id } = req.body;
    const nextBall = await OrganizerModel.getNextBall(inning_id);
    res.json(nextBall);
  } catch (error) {
    console.error("Error fetching next ball:", error);
    res.status(500).json({ message: "Error fetching next ball" });
  }
};

const updateInningSummary = async (req, res) => {
  const { inning_id } = req.body;

  try {
    const result = await OrganizerModel.updateInningSummary(inning_id);
    res.status(200).json({ message: "Inning updated successfully", result });
  } catch (error) {
    console.error("Error updating inning:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePlayerStats = async (req, res) => {
  const { match_id } = req.body;

  try {
    const result = await OrganizerModel.updatePlayerStats(match_id);
    res.status(200).json({ message: "Player stats updated", result });
  } catch (error) {
    console.error("Error updating player stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTournamentStatus = async (req, res) => {
  const { tournament_id, status } = req.body;

  try {
    const result = await OrganizerModel.updateTournamentStatus(
      tournament_id,
      status
    );
    res
      .status(200)
      .json({ message: "Tournament status updated successfully", result });
  } catch (error) {
    console.error("Error updating tournament status:", error);
    res.status(500).json({ error: "Failed to update tournament status" });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid or empty list of IDs." });
    }

    const result = await OrganizerModel.markAttendance(ids);
    res.status(200).json({ message: "Attendance marked successfully", result });
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ message: "Server error while marking attendance." });
  }
};

const updateTeamAttendance = async (req, res) => {
  try {
    const { tournamentId, teamId } = req.params;
    const { isPresent } = req.body;

    if (typeof isPresent !== "boolean") {
      return res.status(400).json({ message: "`isPresent` must be a boolean" });
    }

    const result = await OrganizerModel.updateTeamAttendance(
      tournamentId,
      teamId,
      isPresent
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No matching record found" });
    }

    res.status(200).json({
      message: "Attendance updated successfully",
      tournamentId,
      teamId,
      isPresent,
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUpcomingTournaments = async (req, res) => {
  try {
    const tournaments = await OrganizerModel.getUpcomingTournaments();
    res.status(200).json({
      message: "Upcoming tournaments fetched successfully",
      data: tournaments,
    });
  } catch (error) {
    console.error("Error fetching upcoming tournaments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addPlaying11 = async (req, res) => {
    try {
      const { match_id, player_ids } = req.body;
  
      if (!match_id || !Array.isArray(player_ids) || player_ids.length === 0) {
        return res.status(400).json({ error: 'match_id and player_ids are required' });
      }
  
      await OrganizerModel.insertPlaying11(match_id, player_ids);
  
      res.status(201).json({ message: 'Playing 11 inserted successfully' });
    } catch (err) {
      console.error('Error inserting playing 11:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
const createKnockoutDraw = async (req, res) => {
  const { tournament_id } = req.body;
  try {
    await OrganizerModel.generateKnockoutDraw(tournament_id);
    res.status(200).json({ message: "Knockout draw created successfully" });
  } catch (err) {
    console.error("Error creating draw:", err);
    res.status(500).json({ error: "Failed to create knockout draw" });
  }
};

const viewKnockoutBracket = async (req, res) => {
  const { tournament_id } = req.params;
  try {
    const bracket = await OrganizerModel.viewKnockoutBracket(tournament_id);

    if (!bracket) {
      return res.status(404).json({ message: "Bracket not found" });
    }
    res
      .status(200)
      .json({ message: "Bracket fetched successfully", data: bracket });
  } catch (err) {
    console.error("Error fetching bracket:", err);
    res.status(500).json({ error: "Failed to fetch bracket" });
  }
};

const updateMatchWinner = async (req, res) => {
  const { match_id, winner_id } = req.body;
  try {
    await OrganizerModel.updateMatchWinner(match_id, winner_id);
    res.status(200).json({ message: "Winner updated and draw advanced" });
  } catch (err) {
    console.error("Error updating winner:", err);
    res.status(500).json({ error: "Failed to update winner" });
  }
};


const getInningStats = async (req, res) => {
    try {
      const { inning_id } = req.params;
  
      if (!inning_id) {
        return res.status(400).json({ error: 'inning_id is required' });
      }
  
      const stats = await OrganizerModel.getInningStatsById(inning_id);
  
      if (!stats) {
        return res.status(404).json({ error: 'Inning not found' });
      }
  
      res.status(200).json(stats);
    } catch (err) {
      console.error('Error fetching inning stats:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Add these new controller functions to organizerController.js

// Get match phase
const getMatchPhaseController = async (req, res) => {
    try {
      const { matchId } = req.params;
      
      if (!matchId) {
        return res.status(400).json({ message: 'Match ID is required' });
      }
      
      const phase = await OrganizerModel.getMatchPhase(matchId);
      res.status(200).json(phase);
    } catch (error) {
      console.error('Error getting match phase:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Update match phase
  const updateMatchPhaseController = async (req, res) => {
    try {
      const { match_id, phase } = req.body;
      
      if (!match_id || !phase) {
        return res.status(400).json({ message: 'Match ID and phase are required' });
      }
      
      // Validate phase
      const validPhases = ['toss', 'team_selection', 'inning_one', 'inning_two', 'finished'];
      if (!validPhases.includes(phase)) {
        return res.status(400).json({ message: 'Invalid phase value' });
      }
      
      const result = await OrganizerModel.saveMatchPhase(match_id, phase);
      res.status(200).json({ message: 'Match phase updated successfully' });
    } catch (error) {
      console.error('Error updating match phase:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Get match details
  const getMatchDetailsController = async (req, res) => {
    try {
      const { matchId } = req.params;
      
      if (!matchId) {
        return res.status(400).json({ message: 'Match ID is required' });
      }
      
      const match = await OrganizerModel.getMatchDetails(matchId);
      
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
      
      res.status(200).json(match);
    } catch (error) {
      console.error('Error getting match details:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Get team details
  const getTeamDetailsController = async (req, res) => {
    try {
      const { teamId } = req.params;
      
      if (!teamId) {
        return res.status(400).json({ message: 'Team ID is required' });
      }
      
      const team = await OrganizerModel.getTeamDetails(teamId);
      
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      
      res.status(200).json(team);
    } catch (error) {
      console.error('Error getting team details:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Save match result
  const saveMatchResultController = async (req, res) => {
    try {
      const { match_id, winner_team_id } = req.body;
      
      if (!match_id || !winner_team_id) {
        return res.status(400).json({ message: 'Match ID and winner team ID are required' });
      }
      
      const result = await OrganizerModel.saveMatchResult(match_id, winner_team_id);
      
      // Also update the match in the tournament bracket
      await OrganizerModel.updateMatchWinner(match_id, winner_team_id);
      
      res.status(200).json({ message: 'Match result saved successfully' });
    } catch (error) {
      console.error('Error saving match result:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Get match score
  const getMatchScoreController = async (req, res) => {
    try {
      const { matchId } = req.params;
      
      if (!matchId) {
        return res.status(400).json({ message: 'Match ID is required' });
      }
      
      const score = await OrganizerModel.getMatchScore(matchId);
      res.status(200).json(score);
    } catch (error) {
      console.error('Error getting match score:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Save inning result
  const saveInningResultController = async (req, res) => {
    try {
      const { inning_id, runs, wickets, overs } = req.body;
      
      if (!inning_id) {
        return res.status(400).json({ message: 'Inning ID is required' });
      }
      
      // First update Innings table directly
      await db.execute(
        'UPDATE Innings SET total_runs = ?, total_wickets = ?, overs_played = ? WHERE inning_id = ?', 
        [runs || 0, wickets || 0, overs || 0, inning_id]
      );
      
      res.status(200).json({ message: 'Inning result saved successfully' });
    } catch (error) {
      console.error('Error saving inning result:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Get match state
  const getMatchStateController = async (req, res) => {
    try {
      const { matchId } = req.params;
      
      if (!matchId) {
        return res.status(400).json({ message: 'Match ID is required' });
      }
      
      const state = await OrganizerModel.getMatchState(matchId);
      
      if (!state) {
        return res.status(404).json({ message: 'Match not found' });
      }
      
      res.status(200).json({data : state});
    } catch (error) {
      console.error('Error getting match state:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Add your new controller functions to the exports
  module.exports = {
    // Your new exports
    getMatchPhaseController,
    updateMatchPhaseController,
    getMatchDetailsController,
    getTeamDetailsController,
    saveMatchResultController,
    getMatchScoreController,
    saveInningResultController,
    getMatchStateController,
    
    // Your existing exports
    createTournament,
    getTournamentsByOrganizerController,
    getAppliedTeamsToOngoingTournaments,
    acceptTournamentApplicant,
    rejectTournamentApplicant,
    getAcceptedTeamsByTournament,
    getPlayersWithStats,
    getTeamsNotApplied,
    sendTournamentInvite,
    addInning,
    addDelivery,
    getCurrentBatsmenRuns,
    getNextBallController,
    updateInningSummary,
    updatePlayerStats,
    updateTournamentStatus,
    markAttendance,
    updateTeamAttendance,
    createKnockoutDraw,
    viewKnockoutBracket,
    updateMatchWinner,
    getUpcomingTournaments,
    addPlaying11,
    getInningStats
  };