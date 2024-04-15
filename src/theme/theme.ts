import { ThemeOptions } from '@mui/material/styles';
import { typography } from './typography';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#8A38C1',
    },
    secondary: {
      main: '#8FA6CC',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F4F2ED',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#dc7b3c',
    },
    success: {
      main: '#5f8b74',
    },
    info: {
      main: '#2f3053',
    },
    text: {
      primary: '#0c0e18',
    },
  },
  typography: typography
};