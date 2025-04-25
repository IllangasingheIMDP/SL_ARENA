import { api } from '../utils/api';
import { Team, Tournament, Match } from '../types/tournamentTypes';
import { googleServices } from './googleServices'

export const tournamentService = {
  getOngoingTournaments: async (): Promise<Tournament[]> => {
    try {
      const response = await api.get('/organizers/ongoingtournaments');
      const tournaments = response.data;
  
      const transformedTournaments: Tournament[] = await Promise.all(
        tournaments.map(async (item: any) => {
          // Get detailed venue info using the venue_id
          let venueDetails;
          try {
            venueDetails = await googleServices.getPlaceDetails(item.venue.venue_id);
            if (!venueDetails || !venueDetails.place_id || !venueDetails.name) {
              throw new Error('Invalid venue details received');
            }
          } catch (error) {
            console.error('Error fetching venue details:', error);
            // Provide fallback venue details if the API call fails
            venueDetails = {
              place_id: item.venue.venue_id,
              name: 'Venue details unavailable'
            };
          }
            
          return {
            tournament_id: item.tournament.tournament_id,
            name: item.tournament.tournament_name,
            start_date: item.tournament.start_date,
            end_date: item.tournament.end_date,
            type: item.tournament.tournament_type,
            rules: item.tournament.rules,
            venue: {
              venue_id: venueDetails.place_id,
              venue_name: venueDetails.name,
            },
            organiser: {
              organiser_id: item.organizer.organizer_id,
              name: item.organizer.name
            },
            teams: [], // This can be populated later
            status: item.tournament.status
          };
        })
      );
  
      return transformedTournaments;
    } catch (error) {
      console.error('Error fetching enriched ongoing tournaments:', error);
      throw error;
    }
  },
  

  getTournamentTeams: async (tournamentId: number): Promise<Team[]> => {
    try {
      const response = await api.post(
        '/organizers/tournaments/teams',
        { tournament_id: tournamentId }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching teams for tournament ID ${tournamentId}:`, error);
      throw error;
    }
  },

  updateTournamentStatus: async (tournamentId: number, status: string): Promise<Tournament> => {
    try {
      const response = await api.put(
        '/organizers/tournaments/updatestatus',
        {
          tournament_id: tournamentId,
          status: status,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating tournament status for ID ${tournamentId}:`, error);
      throw error;
    }
  },  

  updateTeamAttendance: async (tournamentId: number, teamId: number, isPresent: boolean): Promise<any> => {
    try {
      const response = await api.put(`/organizers/tournaments/${tournamentId}/teams/${teamId}/attendance`, 
        { isPresent }, true);
      return response.data;
    } catch (error) {
      console.error(`Error updating team attendance for tournament ID ${tournamentId}, team ID ${teamId}:`, error);
      throw error;
    }
  },

  getTeamPlayerStats: async (teamId: number): Promise<any> => {
    try {
      const response = await api.post(
        '/organizers/players-stats_ofTeam',
        { team_id: teamId }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching player stats for team ID ${teamId}:`, error);
      throw error;
    }
  },

  createTournament: async (tournamentData: any): Promise<any> => {
    console.log("in service");
    console.log('tournamentData', tournamentData);
    try {
      console.log('Creating tournament with data:', tournamentData);
      const response = await api.post('/organizers/createtournament', {
        ...tournamentData,
        organizer_id: tournamentData.organizer_id
      });
      return response;
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
  },
  getUpcomingTournamentsForPlayer: async (): Promise<Tournament[]> => {
    try {
      const response = await api.get('/teams/upcoming-tournaments');
      const tournaments = response.data;
  
      const transformedTournaments: Tournament[] = await Promise.all(
        tournaments.map(async (item: any) => {
          // Get detailed venue info using the venue_id
          let venueDetails;
          try {
            venueDetails = await googleServices.getPlaceDetails(item.venue_id);
            if (!venueDetails || !venueDetails.place_id || !venueDetails.name) {
              throw new Error('Invalid venue details received');
            }
          } catch (error) {
            console.error('Error fetching venue details:', error);
            // Provide fallback venue details if the API call fails
            venueDetails = {
              place_id: item.venue_id,
              name: 'Venue details unavailable'
            };
          }
            
          return {
            tournament_id: item.tournament_id,
            name: item.tournament_name,
            start_date: item.start_date,
            end_date: item.end_date,
            type: item.tournament_type,
            rules: item.rules,
            venue: {
              venue_id: venueDetails.place_id,
              venue_name: venueDetails.name,
            },
            organiser: {
              organiser_id: item.organizer_id,
              name: item.organization_name
            },
            teams: [],
            status: item.status
          };
        })
      );
  
      return transformedTournaments;
    } catch (error) {
      console.error('Error fetching enriched upcoming tournaments:', error);
      throw error;
    }
  },
  

  getUpcomingTournaments: async (): Promise<Tournament[]> => {
    try {
      const response = await api.get('/organizers/upcoming-tournaments');
      const tournaments = response.data;
  
      const transformedTournaments: Tournament[] = await Promise.all(
        tournaments.map(async (item: any) => {

          // Get detailed venue info using the venue_id
          const venueDetails = await googleServices.getPlaceDetails(item.venue_id);
  
          return {
            tournament_id: item.tournament_id,
            name: item.tournament_name,
            start_date: item.start_date,
            end_date: item.end_date,
            type: item.tournament_type,
            rules: item.rules,
            venue: {
              venue_id: venueDetails.place_id,
              venue_name: venueDetails.name,
              
            },
            organiser_id: item.organizer_id,
            teams: []
          };
        })
      );
  
      return transformedTournaments;
    } catch (error) {
      console.error('Error fetching enriched upcoming tournaments:', error);
      throw error;
    }
  },

  getKnockoutBracket: async (tournamentId: number): Promise<Match[]> => {
    try {
      const response = await api.get(`/organizers/tournaments/knockoutBracket/${tournamentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching knockout bracket for tournament ID ${tournamentId}:`, error);
      throw error;
    }
  },

  createKnockoutDraw: async (tournamentId: number): Promise<any> => {
    try {
      const response = await api.post(`/organizers/tournaments/generateKnockoutDraw`,
        { tournament_id: tournamentId }
      );
      return response.data;
    } catch (error) {
      console.error(`Error creating knockout draw for tournament ID ${tournamentId}:`, error);  
      throw error;
    }
  },

  async saveMatchPlayers(matchId: number, teamId: number, playerIds: number[]): Promise<void> {
    try {
      const response = await api.post(`/organizers/playing-11`, {
        match_id: matchId,
        player_ids: playerIds
      });
      return response.data;
    } catch (error) {
      console.error('Error saving match players:', error);
      throw error;
    }
  },

  async saveMatchPhase(matchId: number, phase: string): Promise<void> {
    try {
      const response = await api.post(`/organizers/playing11`, {
        match_id: matchId,
        phase: phase
      });
      return response.data;
    } catch (error) {
      console.error('Error saving match phase:', error);
      throw error;
    }
  },

  getTeamTournaments: async (teamId: number): Promise<{
    registered: Tournament[];
    applied: Tournament[];
    notApplied: Tournament[];
  }> => {
    try {
      const response = await api.get(`/players/team/${teamId}/tournaments`)
      //console.log('response', response);
      const { registered, applied, notApplied } = response;

      const transformTournaments = async (tournaments: any[]): Promise<Tournament[]> => {
        return await Promise.all(
          tournaments.map(async (item: any) => {
            let venueDetails;
            try {
              venueDetails = await googleServices.getPlaceDetails(item.venue_id);
              if (!venueDetails || !venueDetails.place_id || !venueDetails.name) {
                throw new Error('Invalid venue details received');
              }
            } catch (error) {
              console.error('Error fetching venue details:', error);
              venueDetails = {
                place_id: item.venue_id,
                name: 'Venue details unavailable'
              };
            }

            return {
              tournament_id: item.tournament_id,
              name: item.tournament_name,
              start_date: item.start_date,
              end_date: item.end_date,
              type: item.tournament_type,
              rules: item.rules,
              venue: {
                venue_id: venueDetails.place_id,
                venue_name: venueDetails.name,
              },
              organiser: {
                organiser_id: item.organizer_id,
                name: item.organizer_name
              },
              teams: [],
              status: item.status
            };
          })
        );
      };

      return {
        registered: await transformTournaments(registered),
        applied: await transformTournaments(applied),
        notApplied: await transformTournaments(notApplied)
      };
    } catch (error) {
      console.error('Error fetching team tournaments:', error);
      throw error;
    }
  },

  getPlayerTeams: async (): Promise<Team[]> => {
    try {
      const response = await api.get('/teams/player/teams');
      //console.log('response', response.success);
      if (response.success) {
        return response.data;
      }
      throw new Error('Failed to fetch player teams');
    } catch (error) {
      console.error('Error fetching player teams:', error);
      throw error;
    }
  },

  isTeamCaptain: async (teamId: number): Promise<boolean> => {
    try {
      const response = await api.get(`/teams/${teamId}/is-captain`);
      //console.log('response', response);
      return response.isCaptain;
    } catch (error) {
      console.error('Error checking team captain status:', error);
      throw error;
    }
  },

  applyForTournament: async (teamId: number, tournamentId: number): Promise<void> => {
    try {
      await api.post('/teams/apply-tournament', {
        team_id: teamId,
        tournament_id: tournamentId
      });
    } catch (error) {
      console.error('Error applying for tournament:', error);
      throw error;
    }
  }
}; 