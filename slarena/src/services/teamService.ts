import { api } from '../utils/api';
import {
    Team,
    TeamPlayer,
    CreateTeamRequest,
    AddPlayerToTeamRequest,
    TeamResponse,
    TeamPlayerResponse,
    CreateTeamResponse,
    AddPlayerResponse
} from '../types/team';

const getMyTeams = async (): Promise<Team[]> => {
    const response = await api.get('/teams/my-teams');
    return response.data.data;
};

const getPlayerTeams = async (userId: number): Promise<Team[]> => {
    const response = await api.get(`/teams/player/${userId}/teams`);
    return response.data.data;
};

const getAllTeams = async (): Promise<Team[]> => {
    const response = await api.get('/teams');
    return response.data.data;
};

const getTeamPlayers = async (teamId: number): Promise<TeamPlayer[]> => {
    const response = await api.get(`/teams/${teamId}/players`);
    return response.data.data;
};

const createTeam = async (teamData: CreateTeamRequest): Promise<number> => {
    const response = await api.post('/teams', teamData);
    return response.data.data.team_id;
};

const addPlayerToTeam = async (playerData: AddPlayerToTeamRequest): Promise<void> => {
    await api.post('/teams/add-player', playerData);
};

export const teamService = {
    getMyTeams,
    getPlayerTeams,
    getAllTeams,
    getTeamPlayers,
    createTeam,
    addPlayerToTeam
};