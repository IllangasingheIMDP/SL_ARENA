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
    //console.log(response.data,'response in getMyTeams');
    return response.data;
};
const getTeamsLedByMe = async (): Promise<Team[]> => {
    const response = await api.get('/teams/teams-led-by-player');
    //console.log(response.data,'response in getTeamsLedByMe');
    return response.data;
};


const getPlayerTeams = async (userId: number): Promise<Team[]> => {
    const response = await api.get(`/teams/player/${userId}/teams`);
    //console.log(response.data,'response in getPlayerTeams');
    return response.data;
};

const getAllTeams = async (): Promise<Team[]> => {
    const response = await api.get('/teams');
    //console.log(response.data,'response in getAllTeams');
    return response.data;
};

const getTeamPlayers = async (teamId: number): Promise<TeamPlayer[]> => {
    const response = await api.get(`/teams/${teamId}/players`);
    //console.log(response.data,'response in getTeamPlayers');
    return response.data;
};

const getTeamByName = async (teamName: string): Promise<Team[]> => {
    const response = await api.get(`/teams/team-by-name/${teamName}`);
    //console.log(response.data,'response in getTeamByName');
    return response.data;
};

const createTeam = async (teamData: CreateTeamRequest): Promise<number> => {
    const response = await api.post('/teams', teamData);
    console.log(response.data,'response in createTeam');
    return response.data.data.team_id;
};

const addPlayerToTeam = async (playerData: AddPlayerToTeamRequest): Promise<void> => {
    await api.post('/teams/add-player', playerData);
    console.log('Player added to team successfully');
};

export const teamService = {
    getMyTeams,
    getPlayerTeams,
    getAllTeams,
    getTeamPlayers,
    createTeam,
    addPlayerToTeam,
    getTeamByName,
    getTeamsLedByMe
};