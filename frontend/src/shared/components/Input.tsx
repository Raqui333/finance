'use client';

import {
  FormControl,
  FormHelperText,
  IconButton,
  OutlinedInput,
  Typography,
} from '@mui/material';

import { ElementType, useState } from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface InputProps extends React.ComponentProps<typeof OutlinedInput> {
  title: string;
  icon: ElementType;
  type: string;
  helperText?: string;
}

const HELPER_TEXT_FONT_SIZE = 15;

export default function Input({
  title,
  icon: Icon,
  type,
  helperText,
  ...rest
}: InputProps) {
  const [visibility, setVisibility] = useState(false);
  const toggleVisibility = () => setVisibility((prev) => !prev);

  return (
    <FormControl sx={{ gap: 1 }}>
      <Typography>{title}</Typography>
      <OutlinedInput
        type={type === 'password' && visibility ? 'text' : type}
        startAdornment={<Icon sx={{ mr: 1, color: 'text.secondary' }} />}
        endAdornment={
          type === 'password' && (
            <IconButton onClick={toggleVisibility} sx={{ ml: 1 }}>
              {visibility ? (
                <VisibilityIcon sx={{ color: 'text.secondary' }} />
              ) : (
                <VisibilityOffIcon sx={{ color: 'text.secondary' }} />
              )}
            </IconButton>
          )
        }
        onKeyDown={
          type === 'username'
            ? (event) => {
                // blocks space in username inputs
                if (event.key === ' ') event.preventDefault();
              }
            : undefined
        }
        {...rest}
      />
      {helperText && (
        <FormHelperText
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: rest.error ? 'error.main' : 'success.main',
            gap: 0.5,
          }}
        >
          {rest.error ? (
            <ErrorIcon sx={{ fontSize: HELPER_TEXT_FONT_SIZE }} />
          ) : (
            <CheckCircleIcon sx={{ fontSize: HELPER_TEXT_FONT_SIZE }} />
          )}
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}
