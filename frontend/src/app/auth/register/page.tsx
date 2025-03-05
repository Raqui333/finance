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

import PersonIcon from '@mui/icons-material/Person';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { register } from '@/utils/actions';

interface InputProps {
  name: string;
  title: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  required?: boolean;
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
  name: '',
  username: '',
  password: '',
  password_confirm: '',
};

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [error, setError] = useState({
    isError: false,
    message: '',
  });

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(form);

    if (form.password !== form.password_confirm) {
      setError({
        isError: true,
        message: "Your passwords don't match. Please try again.",
      });
      return;
    }

    register(form)
      .then(() => {
        router.push('/auth/login');
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
          <Typography>Sign up in seconds and get started now!</Typography>
        </Box>
        <Box
          component="form"
          onSubmit={onSubmitHandler}
          sx={{ ...formSectionStyle }}
        >
          <Input
            required={true}
            name="name"
            title="Name"
            type="text"
            placeholder="Enter your name"
            icon={<PersonIcon />}
            onChange={onChangeHandler}
          />
          <Input
            required={true}
            name="username"
            title="Username"
            type="text"
            placeholder="Enter your username"
            icon={<AlternateEmailIcon />}
            onChange={onChangeHandler}
          />
          <Input
            required={true}
            name="password"
            title="Password"
            type="password"
            placeholder="Enter your password"
            icon={<LockOutlinedIcon />}
            onChange={onChangeHandler}
          />
          <Input
            required={true}
            name="password_confirm"
            title="Confirm your password"
            type="password"
            placeholder="Confirm your password"
            icon={<LockOutlinedIcon />}
            onChange={onChangeHandler}
          />
          {error.isError && (
            <Typography color="error.main" sx={{ alignSelf: 'center' }}>
              {error.message}
            </Typography>
          )}
          <Button type="submit" variant="contained">
            Register now
          </Button>
        </Box>
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

function Input({
  name,
  title,
  type,
  placeholder,
  icon,
  required,
  onChange,
}: InputProps) {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1 }}
    >
      <Typography>{required ? `${title} *` : title}</Typography>
      <TextField
        autoComplete="off"
        required={required}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={
          name === 'username'
            ? (event) => {
                if (event.key === ' ') {
                  event.preventDefault();
                }
              }
            : undefined
        }
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
