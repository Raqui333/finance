'use client';

import Input from '@/shared/components/Input';
import { Box, Button, Typography } from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { register, validateUsername } from '@/shared/utils/actions';
import { setError, setLoading } from '../registerSlice';
import { useRouter } from 'next/navigation';

const flexColumn = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
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

export default function RegisterForm() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [availability, setAvailability] = useState<null | boolean>(null);

  const { loading, error } = useAppSelector((state) => state.register);

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
      dispatch(setError({ ...error, isError: false }));
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
        dispatch(setError({ isError: true, message: validationError.message }));
        return;
      }

      register(form)
        .then(() => {
          dispatch(setLoading(true));
          router.push('/auth/login');
        })
        .catch((err) => {
          dispatch(setLoading(false));
          console.error(err);
        });
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
    <Box
      component="form"
      onSubmit={onSubmitHandler}
      sx={{ ...formSectionStyle }}
    >
      <Input
        required
        disabled={loading}
        autoComplete="off"
        name="name"
        title="Name"
        type="text"
        placeholder="Enter your name"
        icon={<PersonIcon />}
        onChange={onChangeHandler}
      />
      <Input
        required
        disabled={loading}
        autoComplete="off"
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
        disabled={loading}
        autoComplete="off"
        name="password"
        title="Password (at least 8 characters)"
        type="password"
        placeholder="Enter your password"
        icon={<LockOutlinedIcon />}
        onChange={onChangeHandler}
      />
      <Input
        required
        disabled={loading}
        autoComplete="off"
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
      <Button type="submit" variant="contained" disabled={loading}>
        Register now
      </Button>
    </Box>
  );
}
