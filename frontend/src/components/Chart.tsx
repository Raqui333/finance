'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/redux/hooks';
import formatCurrency from '@/utils/currency-formatter';

import { LineChart } from '@mui/x-charts';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const mainColor = '#318ede';
const secondaryColor = '#ffffff40';

export default function Chart() {
  const currency = useAppSelector((state) => state.currency.value);
  const entries = useAppSelector((state) => state.user.entries);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const data = useMemo(() => {
    let sum = 0;

    return entries
      .toSorted(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      .map((row) => {
        // Creates a clone of 'entries', but updates the 'price' field
        // to be a cumulative sum of previous prices.
        sum += row.price;
        return { ...row, price: sum };
      });
  }, [entries]);

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      {data.length ? (
        <LineChart
          margin={isSmallScreen ? { right: 0 } : undefined}
          dataset={data}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'createdAt',
              disableLine: true,
              disableTicks: true,
              tickLabelStyle: { display: 'none' },
              valueFormatter: (v) => {
                // find index where the item is equal to tooltip value
                // tooltip value is based on createAt of the entry
                const index = data.findIndex((i) => i.createdAt === v);
                return `${data[index].name} (${data[index].date})`;
              },
            },
          ]}
          yAxis={[
            {
              tickMinStep: 4,
              disableLine: true,
              disableTicks: true,
              tickLabelStyle: { fill: secondaryColor },
            },
          ]}
          series={[
            {
              dataKey: 'price',
              showMark: false,
              area: true,
              color: mainColor,
              valueFormatter: (v) => formatCurrency(v, currency),
            },
          ]}
          grid={{ horizontal: true }}
          width={undefined}
          height={undefined}
          sx={{
            '.MuiAreaElement-root': {
              fill: 'url(#chart-gradient)',
            },

            '.MuiChartsGrid-horizontalLine, .MuiChartsAxisHighlight-root': {
              stroke: secondaryColor,
            },
          }}
        >
          <defs>
            <linearGradient id="chart-gradient" gradientTransform="rotate(90)">
              <stop offset="50%" stopColor={`${mainColor}40`} />
              <stop offset="75%" stopColor={`${mainColor}20`} />
              <stop offset="90%" stopColor={`${mainColor}15`} />
              <stop offset="95%" stopColor={`${mainColor}00`} />
            </linearGradient>
          </defs>
        </LineChart>
      ) : (
        <ChartSkeleton isSmallScreen={isSmallScreen} />
      )}
    </Box>
  );
}

function ChartSkeleton({ isSmallScreen }: { isSmallScreen: boolean }) {
  return (
    <LineChart
      margin={isSmallScreen ? { right: 0 } : undefined}
      skipAnimation
      xAxis={[
        {
          data: [0, 50],
          disableLine: true,
          disableTicks: true,
          tickLabelStyle: { display: 'none' },
        },
      ]}
      yAxis={[
        {
          tickMinStep: 4,
          disableLine: true,
          disableTicks: true,
          tickLabelStyle: { fill: secondaryColor },
        },
      ]}
      series={[
        {
          data: [0, 50],
          showMark: false,
          disableHighlight: true,
        },
      ]}
      grid={{ horizontal: true }}
      width={undefined}
      height={undefined}
      sx={{
        pointerEvents: 'none',
        '.MuiLineElement-root': {
          display: 'none',
        },
      }}
    />
  );
}
