import { Box, Container } from '@mui/material';

import ChangeCurrency from '@/shared/components/ChangeCurrency';
import Chart from './components/ui/Chart';
import PerformanceCard from './components/ui/PerformanceCard';
import FinanceEntries from './components/ui/FinanceEntries';
import Profile from './components/ui/Profile';

export default function Dashboard() {
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
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            flexBasis: { md: 'none', xs: '10%' },
            gap: 1,
          }}
        >
          <Profile />
          <PerformanceCard name="Performance" />
        </Box>
      </Box>
      <FinanceEntries />
    </Container>
  );
}
