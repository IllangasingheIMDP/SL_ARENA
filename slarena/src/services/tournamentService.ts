import { api } from '../utils/api';
import { Team, Tournament } from '../types/tournamentTypes';

export const tournamentService = {
  createTournament: async (tournamentData: any): Promise<any> => {
    try {
      const response = await api.post('/organizers/createtournament', tournamentData);
      return response.data;
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
  },

  getOngoingTournaments: async (): Promise<Tournament[]> => {
    try {
      const response = await api.get('/organizers/ongoingtournaments');
      
      // Transform the API response to match the Tournament type
      const transformedTournaments = response.data.map((item: any) => ({
        tournament_id: item.tournament.tournament_id,
        name: item.tournament.tournament_name,
        start_date: item.tournament.start_date,
        end_date: item.tournament.end_date,
        type: item.tournament.tournament_type,
        rules: item.tournament.rules,
        venue: {
          venue_id: item.venue.venue_id,
          venue_name: item.venue.venue_name,
          address: item.venue.address,
          city: item.venue.city,
          state: item.venue.state,
          country: item.venue.country,
          latitude: item.venue.latitude,
          longitude: item.venue.longitude,
          capacity: item.venue.capacity
        },
        organiser: {
          organiser_id: item.organizer.organizer_id,
          name: item.organizer.name
        },
        teams: [], // This will be populated when needed
        status: item.tournament.status
      }));
      
      return transformedTournaments;
    } catch (error) {
      console.error('Error fetching ongoing tournaments:', error);
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
        '/tournaments/updatestatus',
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
      const response = await api.put(`/tournaments/${tournamentId}/teams/${teamId}/attendance`, 
        { isPresent }, true);
      return response.data;
    } catch (error) {
      console.error(`Error updating team attendance for tournament ID ${tournamentId}, team ID ${teamId}:`, error);
      throw error;
    }
  }
}; 