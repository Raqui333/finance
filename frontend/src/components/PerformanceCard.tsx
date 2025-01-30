'use client';

import { useAppSelector } from '@/redux/hooks';
import formatCurrency from '@/utils/currency-formatter';

import { Box, Paper, Typography } from '@mui/material';
import { SparkLineChart } from '@mui/x-charts';

interface PerformanceCardProps {
  name: string;
  data: number[];
  color?: string;
}

export default function PerformanceCard({
  name,
  data,
  color,
}: PerformanceCardProps) {
  const currency = useAppSelector((state) => state.currency.value);

  const total = data.reduce((acc, value) => acc + value, 0);
  const delta = ((total - data[0]) * 100) / data[0];

  return (
    <>
      <Box
        component={Paper}
        sx={{
          '&:hover': {
            filter: 'brightness(1.1)',
          },
        }}
      >
        <Box>
          <Typography>{name}</Typography>
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 'bold',
              color: total > 0 ? 'success.main' : 'error.main',
            }}
          >
            {formatCurrency(total, currency) + ` (${delta.toFixed(2)}%)`}
          </Typography>
        </Box>
        <SparkLineChart
          data={data}
          width={300}
          height={100}
          colors={[color || total > 0 ? '#318ede' : '#d05574']}
          curve="catmullRom"
          showHighlight={true}
          showTooltip={true}
          valueFormatter={(value) => formatCurrency(value, currency)}
        />
      </Box>
    </>
  );
}
