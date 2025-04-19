import { Box, Typography, Stack, Avatar } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';

const AdminStepSource = ({ label, date, status }:{ label:string; date:string; status:string }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#f9f8f8',
        borderRadius: '20px',
        padding: '24px',
        width: '76vw',
        height: '40vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // align to left
        overflowY: 'auto',
        mt:10
      }}
    >
      <Stack spacing={4} sx={{ mt: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: status === 'completed' ? '#F6C328' : '#d3cdc9',
              width: 24,
              height: 24,
              boxShadow:
                status === 'completed'
                  ? '0 0 0 4px #fff, 0 0 0 6px #F6C32840'
                  : 'none',
            }}
          >
            {status === 'completed' ? (
              <CheckIcon sx={{ color: 'black', fontSize: 16 }} />
            ) : (
              <CircleIcon sx={{ color: 'gray' }} />
            )}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 500, fontSize: 16, color: '#222' }}>
              {label}
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#555' }}>
              Date - {date}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AdminStepSource;
