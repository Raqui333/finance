'use client';

import {
  Box,
  Paper,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Link,
} from '@mui/material';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LinearProgress from '@mui/material/LinearProgress';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { login } from '@/utils/actions';

interface InputProps {
  name: string;
  title: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

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

const formSectionStyle = {
  ...flexColumn,
  alignItems: 'stretch',
  width: '100%',
  pt: 3,
  gap: 3,
};

const initialForm = {
  username: '',
  password: '',
};

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>(initialForm);
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    login(form.username, form.password)
      .then(() => {
        router.push('/');
      })
      .catch((err) => console.error(err));
  };

  return (
    <Container sx={{ ...mainContainerStyle }}>
      <Box component={Paper} sx={{ ...loginBoxStyle }}>
        <Box sx={{ ...flexColumn }}>
          <Typography sx={{ ...titleSectionStyle }}>
            Finance Dashboard
          </Typography>
          <Typography>Welcome back! Please login to continue</Typography>
        </Box>
        <Box
          component="form"
          onSubmit={onSubmitHandler}
          sx={{ ...formSectionStyle }}
        >
          <Input
            disabled={loading}
            name="username"
            title="Username"
            type="text"
            placeholder="Enter your username"
            icon={<AlternateEmailIcon />}
            onChange={onChangeHandler}
          />
          <Input
            disabled={loading}
            name="password"
            title="Password"
            type="password"
            placeholder="Enter your password"
            icon={<LockOutlinedIcon />}
            onChange={onChangeHandler}
          />
          <Button type="submit" variant="contained" disabled={loading}>
            Login
            <LoginOutlinedIcon fontSize="small" sx={{ ml: 1 }} />
          </Button>
        </Box>
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

function Input({
  name,
  title,
  type,
  placeholder,
  icon,
  disabled = false,
  onChange,
}: InputProps) {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1 }}
    >
      <Typography>{title}</Typography>
      <TextField
        disabled={disabled}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                {icon}
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}
