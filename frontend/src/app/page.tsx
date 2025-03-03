import { Box, Container } from '@mui/material';

import ChangeCurrency from '@/components/ChangeCurrency';
import Chart from '@/components/Chart';
import PerformanceCard from '@/components/PerformanceCard';
import FinanceEntries from '@/components/FinanceEntries';
import Profile from '@/components/Profile';

const USER_ID_TEST = 9;

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
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            flexBasis: { md: 'none', xs: '10%' },
            gap: 1,
          }}
        >
          <Profile userId={USER_ID_TEST} />
          <PerformanceCard name="Performace" />
        </Box>
      </Box>
      <FinanceEntries userId={USER_ID_TEST} />
    </Container>
  );
}
