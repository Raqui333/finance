'use client';

import { Box, Paper, Container, Typography, Link } from '@mui/material';

import { useAppSelector } from '@/shared/store/hooks';

import LoginForm from './components/LoginForm';
import LinearProgress from '@mui/material/LinearProgress';

const flexColumn = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const mainContainerStyle = {
  ...flexColumn,
  justifyContent: 'center',
  padding: 2,
  height: '100vh',
};

const loginBoxStyle = {
  ...flexColumn,
  gap: 4,
  padding: 5,
  width: 500,
  borderRadius: 5,
};

const titleStyle = {
  color: 'primary.main',
  fontWeight: 'bold',
  fontSize: 35,
};

export default function Login() {
  const loading = useAppSelector((state) => state.login.loading);

  return (
    <Container sx={{ ...mainContainerStyle }}>
      <Box component={Paper} sx={{ ...loginBoxStyle }}>
        <Box sx={{ ...flexColumn }}>
          <Typography sx={{ ...titleStyle }}>Finance Dashboard</Typography>
          <Typography>Welcome back! Please login to continue</Typography>
        </Box>
        <LoginForm />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Typography>Don't have an account?</Typography>
          <Link href="/auth/register" underline="hover" color="primary.main">
            Register here
          </Link>
        </Box>
        <Box sx={{ width: '100%' }}>{loading && <LinearProgress />}</Box>
      </Box>
    </Container>
  );
}
