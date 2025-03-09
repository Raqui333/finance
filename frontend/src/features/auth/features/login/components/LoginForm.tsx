import { Box, Button, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';

import { login } from '@/shared/utils/actions';

import Input from '@/shared/components/Input';

import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';

import {
  setLoading,
  setError,
} from '@/features/auth/features/login/loginSlice';

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
  username: '',
  password: '',
};

export default function LoginForm() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [form, setForm] = useState<LoginForm>(initialForm);

  const { loading, error } = useAppSelector((state) => state.login);

  useEffect(
    () => () => {
      // run on dismount
      dispatch(setLoading(false));
    },
    []
  );

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

      dispatch(setLoading(true));
      login(form.username, form.password)
        .then(() => {
          router.push('/');
        })
        .catch((err) => {
          dispatch(setLoading(false));

          const error_body = JSON.parse(err.message);

          const validations = [
            {
              condition: error_body.statusCode === 404,
              message: 'Invalid username or password',
            },
            {
              condition: error_body.statusCode === 401,
              message: 'Incorrect credentials. Please try again',
            },
          ];

          const validationError = validations.find(
            (validation) => validation.condition
          );

          if (validationError)
            dispatch(
              setError({ isError: true, message: validationError.message })
            );
        });
    },
    [form]
  );

  return (
    <Box
      component="form"
      onSubmit={onSubmitHandler}
      sx={{ ...formSectionStyle }}
    >
      <Input
        disabled={loading}
        name="username"
        title="Username"
        type="username"
        placeholder="Enter your username"
        icon={AlternateEmailIcon}
        onChange={onChangeHandler}
      />
      <Input
        disabled={loading}
        name="password"
        title="Password"
        type="password"
        placeholder="Enter your password"
        icon={LockOutlinedIcon}
        onChange={onChangeHandler}
      />
      {error.isError && (
        <Typography color="error.main" sx={{ alignSelf: 'center' }}>
          {error.message}
        </Typography>
      )}
      <Button type="submit" variant="contained" disabled={loading}>
        Login
        <LoginOutlinedIcon fontSize="small" sx={{ ml: 1 }} />
      </Button>
    </Box>
  );
}
