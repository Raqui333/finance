'use client';

import { useAppSelector } from '@/redux/hooks';
import formatCurrency from '@/utils/currency-formatter';

import { Box, Typography } from '@mui/material';
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

  const sum = data.reduce((acc, value) => acc + value, 0);
  const delta = ((sum - data[0]) * 100) / data[0];

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 4,
          '&:hover': {
            filter: 'brightness(1.1)',
          },
        }}
      >
        <Box
          sx={{
            paddingLeft: 2,
            paddingTop: 2,
          }}
        >
          <Typography>{name}</Typography>
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 'bold',
              color: sum > 0 ? 'success.main' : 'error.main',
            }}
          >
            {formatCurrency(sum, currency) + ` (${delta.toFixed(2)}%)`}
          </Typography>
        </Box>
        <SparkLineChart
          data={data}
          width={300}
          height={100}
          colors={[color || sum > 0 ? '#318ede' : '#d05574']}
          curve="catmullRom"
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          showHighlight={true}
          showTooltip={true}
          valueFormatter={(value) => formatCurrency(value, currency)}
        />
      </Box>
    </>
  );
}
