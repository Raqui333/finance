import { Box, InputAdornment, TextField, Typography } from '@mui/material';

interface InputProps extends React.ComponentProps<typeof TextField> {
  title: string;
  icon: React.ReactNode;
}

export default function Input({ title, icon, ...rest }: InputProps) {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1 }}
    >
      <Typography>{title}</Typography>
      <TextField
        required
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
