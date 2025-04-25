import { api } from '../utils/api';
import { Team, Tournament } from '../types/tournamentTypes';
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
  
}; 