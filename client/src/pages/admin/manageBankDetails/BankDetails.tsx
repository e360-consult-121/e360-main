import React, { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  useMediaQuery,
  // TextField,
  // InputAdornment,
} from '@mui/material';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import SearchIcon from '@mui/icons-material/Search';
import DominicaInvestmentOptions from './DominicaInvestmentOptions';
import GrenadaInvestmentOptions from './GrenadaInvestmentOptions';

const BankDetailsPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  // const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Fixed: Removed the unused event parameter
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const tabOptions = ['Dominica Investment Options', 'Grenada Investment Options'];

  return (
    <Container maxWidth="lg" sx={{ pt: 0, pb: 0 }}>
      {/* Search and Notification Bar */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          placeholder="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ 
            width: isMobile ? '70%' : '300px',
            backgroundColor: 'white',
            borderRadius: '24px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '6px',
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <IconButton>
          <NotificationsIcon />
        </IconButton>
      </Box> */}

      {/* Tabs Section */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
              height: 3,
            },
          }}
        >
          {tabOptions.map((tab, index) => (
            <Tab 
              key={index} 
              label={tab} 
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600, 
                fontSize: '16px',
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Content Section - Show based on active tab */}
      <Box sx={{ mt: 0 }}>
        {activeTab === 0 ? <DominicaInvestmentOptions /> : <GrenadaInvestmentOptions />}
      </Box>
    </Container>
  );
};

export default BankDetailsPage;