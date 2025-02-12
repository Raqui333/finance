import { Box, Container } from '@mui/material';

import ChangeCurrency from '@/components/ChangeCurrency';
import Chart from '@/components/Chart';
import PerformanceCard from '@/components/PerformanceCard';
import FinanceEntries from '@/components/FinanceEntries';
import Profile from '@/components/Profile';

export default function Home() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <ChangeCurrency />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          marginBottom: 2,
          flexDirection: { md: 'row', xs: 'column' },
        }}
      >
        <Chart />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            flexBasis: { md: 'none', xs: '10%' },
            gap: 1,
          }}
        >
          <Profile />
          <PerformanceCard name="Performace" />
        </Box>
      </Box>
      <FinanceEntries />
    </Container>
  );
}
