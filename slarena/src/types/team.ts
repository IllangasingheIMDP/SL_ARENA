export interface Team {
    team_id: number;
    team_name: string;
    captain: string;
    points: number;
}

export interface TeamPlayer {
    name: string;
    
    role: string;
}

export interface CreateTeamRequest {
    team_name: string;
}

export interface AddPlayerToTeamRequest {
    team_id: number;
    player_id: number;
    role: string;
}

export interface TeamResponse {
    success: boolean;
    data: Team[];
    message?: string;
}

export interface TeamPlayerResponse {
    success: boolean;
    data: TeamPlayer[];
    message?: string;
}

export interface CreateTeamResponse {
    success: boolean;
    data: {
        team_id: number;
    };
    message?: string;
}

export interface AddPlayerResponse {
    success: boolean;
    message: string;
} 