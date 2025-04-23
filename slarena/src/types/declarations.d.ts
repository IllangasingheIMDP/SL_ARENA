// Type declarations for modules without type definitions

declare module 'react-native-paper' {
  export const useTheme: any;
  export const Searchbar: any;
  export const Chip: any;
  export const Divider: any;
  export const Button: any;
  export const Card: any;
  export const ActivityIndicator: any;
}

declare module '@react-navigation/native' {
  export const useNavigation: any;
}

declare module '@react-navigation/stack' {
  export const StackNavigationProp: any;
}

declare module '../../navigation/AppNavigator' {
  export interface GeneralUserTabParamList {
    Home: undefined;
    Discover: {
      screen?: string;
      params?: {
        matchId?: string;
        tournamentId?: string;
        teamId?: string;
        playerId?: string;
        newsId?: string;
      };
    };
    Profile: undefined;
    Settings: undefined;
  }
}

declare module '../../services/apiService' {
  const apiService: {
    get: (url: string) => Promise<any>;
    post: (url: string, data: any) => Promise<any>;
    put: (url: string, data: any) => Promise<any>;
    delete: (url: string) => Promise<any>;
  };
  export default apiService;
}

declare module '../../theme/theme' {
  export const colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    cardBackground: string;
    text: string;
    disabled: string;
    cricketGreen: string;
  };
  
  export const typography: {
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
  };
  
  export const spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  
  export const borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  
  export const shadows: {
    small: any;
    medium: any;
    large: any;
  };
} 