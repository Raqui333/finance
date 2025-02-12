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
} from '@mui/material';

import { addEntry, setBalance } from '@/redux/features/user/userSlice';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useState } from 'react';

interface InsertNewEntryProps {
  isOpen: boolean;
  onClose: () => void;
}

function createData({ date, name, description, price }: UserEntry) {
  return { date, name, description, price };
}

export default function NewEntryModal({
  isOpen,
  onClose,
}: InsertNewEntryProps) {
  const dispatch = useAppDispatch();
  const currency = useAppSelector((state) => state.currency.value);

  const [entryForm, setEntryForm] = useState<UserEntry>({
    date: new Date(Date.now()).toISOString().slice(0, 10),
    name: '',
    description: '',
    price: 0,
  });

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'date' && value === '') return;

    setEntryForm((prev) => ({
      ...prev,
      // convert number fields
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const new_data = createData(entryForm);

    dispatch(addEntry(new_data));
    dispatch(setBalance(new_data.price));

    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        component={Paper}
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          position: 'absolute',

          width: {
            md: '50%',
            xs: '100%',
          },
          top: {
            md: '50%',
            xs: 'auto',
          },
          left: {
            md: '50%',
            xs: 'auto',
          },
          transform: {
            md: 'translate(-50%, -50%)',
            xs: 'none',
          },

          [theme.breakpoints.down('md')]: {
            borderRadius: 0,
            height: '100vh',
          },
        })}
      >
        <Typography variant="h6">New Entry</Typography>
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
    </Modal>
  );
}
