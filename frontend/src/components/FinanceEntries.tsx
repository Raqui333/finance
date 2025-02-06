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
  alpha,
} from '@mui/material';

import Image from 'next/image';

import formatCurrency from '@/utils/currency-formatter';
import { useAppSelector } from '@/redux/hooks';

const LOGO_SIZE = 16;

export default function FinanceEntries() {
  const currency = useAppSelector((state) => state.currency.value);
  const data = useAppSelector((state) => state.user.entries);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Typography color="primary.main">Recently Entries</Typography>
      {data.length ? (
        <Table>
          <TableBody>
            {data.map((row, index) => {
              const logo_name = row.name
                .replace(/\s|[^\w\-]/g, '')
                .toLocaleLowerCase();

              const logo_url = `https://logo.clearbit.com/${logo_name}.com`;

              return (
                <TableRow
                  key={row.date || index}
                  sx={(theme) => ({
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    },
                    transition: 'background-color 0.3s ease',
                  })}
                >
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Image
                        src={logo_url}
                        width={LOGO_SIZE}
                        height={LOGO_SIZE}
                        alt="logo icon"
                      ></Image>
                      {row.name}
                    </Box>
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{formatCurrency(row.price, currency)}</TableCell>
                </TableRow>
              );
            })}
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
