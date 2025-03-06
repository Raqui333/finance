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

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { register, validateUsername } from '@/utils/actions';

interface InputProps extends React.ComponentProps<typeof TextField> {
  title: string;
  icon: React.ReactNode;
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
  const [availability, setAvailability] = useState<null | boolean>(null);
  const [error, setError] = useState({
    isError: false,
    message: '',
  });

  useEffect(() => {
    const validate = async () => {
      if (!form.username) {
        setAvailability(null);
        return;
      }

      try {
        await validateUsername(form.username);
        setAvailability(true);
      } catch {
        setAvailability(false);
      }
    };

    const delay = setTimeout(validate, 500);
    return () => clearTimeout(delay);
  }, [form.username]);

  const onChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setError((prev) => ({ ...prev, isError: false }));
      const { name, value } = event.target;

      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const onSubmitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validations = [
        {
          condition: form.password !== form.password_confirm,
          message: "Your passwords don't match. Please try again",
        },
        {
          condition: availability === false,
          message: 'Please choose a different username',
        },
        {
          condition: form.password.length < 8,
          message: 'Password must be at least 8 characters long',
        },
      ];

      const validationError = validations.find(
        (validation) => validation.condition
      );

      if (validationError) {
        setError({
          isError: true,
          message: validationError.message,
        });
        return;
      }

      register(form)
        .then(() => {
          router.push('/auth/login');
        })
        .catch((err) => console.error(err));
    },
    [form, availability]
  );

  const color =
    availability === true
      ? 'success'
      : availability === false
      ? 'error'
      : undefined;

  const helperText =
    availability === true
      ? 'This username is available'
      : availability === false
      ? 'This username is already in use'
      : undefined;

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
            required
            name="name"
            title="Name"
            type="text"
            placeholder="Enter your name"
            icon={<PersonIcon />}
            onChange={onChangeHandler}
          />
          <Input
            required
            name="username"
            title="Username"
            type="text"
            placeholder="Enter your username"
            icon={<AlternateEmailIcon />}
            onChange={onChangeHandler}
            color={color}
            helperText={helperText}
            error={availability === false && true}
            onKeyDown={(event) => {
              if (event.key === ' ') event.preventDefault();
            }}
            slotProps={{
              formHelperText: {
                sx: {
                  color: availability ? 'success.main' : 'error.main',
                },
              },
            }}
          />
          <Input
            required
            name="password"
            title="Password (at least 8 characters)"
            type="password"
            placeholder="Enter your password"
            icon={<LockOutlinedIcon />}
            onChange={onChangeHandler}
          />
          <Input
            required
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

function Input({ title, icon, required, ...rest }: InputProps) {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1 }}
    >
      <Typography>{required ? `${title} *` : title}</Typography>
      <TextField
        required
        autoComplete="off"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                {icon}
              </InputAdornment>
            ),
          },
        }}
        {...rest}
      />
    </Box>
  );
}
