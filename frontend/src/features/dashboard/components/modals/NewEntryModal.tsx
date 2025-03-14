'use client';

import {
  Box,
  Button,
  Divider,
  InputAdornment,
  Modal,
  Paper,
  TextField,
  Typography,
  Zoom,
} from '@mui/material';

import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { addEntry } from '@/shared/store/features/user/userSlice';

import { useState } from 'react';
import { createUserEntry } from '@/shared/utils/actions';

import PaymentsIcon from '@mui/icons-material/Payments';

interface InsertNewEntryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewEntryModal({
  isOpen,
  onClose,
}: InsertNewEntryProps) {
  const dispatch = useAppDispatch();

  const currency = useAppSelector((state) => state.currency.value);

  const [entryForm, setEntryForm] = useState<Partial<UserEntry>>({
    date: new Date(Date.now()).toISOString().slice(0, 10),
    name: '',
    description: '',
    price: 0,
  });

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setEntryForm((prev) => ({
      ...prev,
      // convert number fields
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createUserEntry(entryForm as UserEntry)
      .then((res) => {
        dispatch(addEntry(res.asset));
        onClose();
      })
      .catch((err) => {
        console.error(err);
        onClose();
      });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Zoom in={isOpen}>
        <Box
          component={Paper}
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            gap: 1,

            width: {
              md: '50%',
              xs: '100%',
            },

            height: 'auto',

            [theme.breakpoints.down('md')]: {
              borderRadius: 0,
              height: '100vh',
            },
          })}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PaymentsIcon sx={{ mr: 1 }} />
            <Typography variant="h6">New Entry</Typography>
          </Box>
          <Divider />
          <Box
            component="form"
            onSubmit={onSubmitHandler}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
          >
            <TextField
              required
              onChange={onChangeHandler}
              name="date"
              label="Date (MM/DD/YYYY)"
              type="date"
              defaultValue={entryForm.date}
              slotProps={{
                inputLabel: { shrink: true },
                input: { autoComplete: 'off' },
              }}
            />
            <TextField
              required
              onChange={onChangeHandler}
              name="name"
              label="Name"
              type="text"
              autoComplete="off"
            />
            <TextField
              onChange={onChangeHandler}
              name="description"
              label="Description"
              type="text"
              autoComplete="off"
            />
            <TextField
              required
              onChange={onChangeHandler}
              name="price"
              label="Price"
              type="number"
              slotProps={{
                htmlInput: {
                  step: 'any',
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      {currency === 'BRL' ? 'R$' : '$'}
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={onClose} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Done
              </Button>
            </Box>
          </Box>
        </Box>
      </Zoom>
    </Modal>
  );
}
