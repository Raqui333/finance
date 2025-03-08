import { Box, InputAdornment, TextField, Typography } from '@mui/material';

interface InputProps extends React.ComponentProps<typeof TextField> {
  title: string;
  icon: React.ReactNode;
}

const inputStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: 1,
};

export default function Input({ title, icon, ...rest }: InputProps) {
  return (
    <Box sx={{ ...inputStyle }}>
      <Typography>{title}</Typography>
      <TextField
        required
        {...rest}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                {icon}
              </InputAdornment>
            ),
          },
          ...rest.slotProps,
        }}
      />
    </Box>
  );
}
