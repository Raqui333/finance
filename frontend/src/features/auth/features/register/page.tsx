'use client';

import { Box, Paper, Container, Typography, Link } from '@mui/material';
import RegisterForm from './components/RegisterForm';

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

const titleSectionStyle = {
  color: 'primary.main',
  fontWeight: 'bold',
  fontSize: 35,
};

export default function Register() {
  return (
    <Container sx={{ ...mainContainerStyle }}>
      <Box component={Paper} sx={{ ...loginBoxStyle }}>
        <Box sx={{ ...flexColumn }}>
          <Typography sx={{ ...titleSectionStyle }}>
            Finance Dashboard
          </Typography>
          <Typography>Sign up in seconds and get started now!</Typography>
        </Box>
        <RegisterForm />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Typography>Already have an account?</Typography>
          <Link href="/auth/login" underline="hover" color="primary.main">
            Login here
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
