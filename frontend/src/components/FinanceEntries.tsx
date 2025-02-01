'use client';

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';

import Image from 'next/image';

import formatCurrency from '@/utils/currency-formatter';
import { useAppSelector } from '@/redux/hooks';

export default function FinanceEntries() {
  const currency = useAppSelector((state) => state.currency.value);
  const data = useAppSelector((state) => state.user.entries);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Typography color="primary.main">Recently Entries</Typography>
      {data.length > 0 ? (
        <Table>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(row.date).toISOString()}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Image
                      src={`https://logo.clearbit.com/${row.name
                        .replaceAll(/\s/g, '')
                        .toLocaleLowerCase()}.com`}
                      width={16}
                      height={16}
                      alt="logo icon"
                    ></Image>
                    {row.name}
                  </Box>
                </TableCell>
                <TableCell>{row.desc}</TableCell>
                <TableCell>{formatCurrency(row.price, currency)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography color="divide" align="center">
          No Entries Found
        </Typography>
      )}
    </TableContainer>
  );
}
