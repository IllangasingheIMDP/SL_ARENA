import { api } from '../utils/api';
import { Tournament } from '../types/tournamentTypes';

export const tournamentService = {
  getOngoingTournaments: async (): Promise<Tournament[]> => {
    try {
      const response = await api.get('/organizers/ongoingtournements', true);
      return response.data;
    } catch (error) {
      console.error('Error fetching ongoing tournaments:', error);
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
  

  getTournamentTeams: async (tournamentId: number): Promise<any[]> => {
    try {
      const response = await api.post(
        '/tournaments/teams',
        { tournament_id: tournamentId }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching teams for tournament ID ${tournamentId}:`, error);
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