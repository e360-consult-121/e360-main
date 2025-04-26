import { Box, Typography, Stack, Avatar } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';

// Define the interface for AIMA document data
interface AIMADoc {
  _id: string;
  aimaStatus: string;
  isCompleted: boolean;
  completedOn: string | null;
  aimaNumber: string | null;
  stepStatusId: string;
  __v: number;
}

// Interface for component props
interface AIMAClientComponentProps {
  aimaDocs: AIMADoc[];
}

const AIMAClientComponent = ({ aimaDocs }: AIMAClientComponentProps) => {
  // Helper function to format date
  const formatDate = (date: string | null) => {
    if (!date) return "Not completed";
    const formattedDate = new Date(date).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    return formattedDate;
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f9f8f8',
        borderRadius: '20px',
        padding: '24px',
        width: '76vw',
        height: '80vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', 
        overflowY: 'auto',
        mt: 12
      }}
    >
      
      <Stack spacing={4} sx={{ mt: 2, width: '100%' }}>
        {aimaDocs.map((doc) => (
          <Stack key={doc._id} direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: doc.isCompleted ? '#F6C328' : '#d3cdc9',
                width: 24,
                height: 24,
                boxShadow: doc.isCompleted 
                  ? '0 0 0 4px #fff, 0 0 0 6px #F6C32840'
                  : 'none',
              }}
            >
              {doc.isCompleted ? (
                <CheckIcon sx={{ color: 'black', fontSize: 16 }} />
              ) : (
                <CircleIcon sx={{ color: 'gray', fontSize: 16 }} />
              )}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 500, fontSize: 16, color: '#222' }}>
                {doc.aimaStatus}
              </Typography>
              <Typography sx={{ fontSize: 14, color: '#555' }}>
                {doc.isCompleted 
                  ? `Completed on - ${formatDate(doc.completedOn)}`
                  : "Pending"}
              </Typography>
              {doc.aimaNumber && (
                <Typography sx={{ fontSize: 14, color: '#555' }}>
                  AIMA Number: {doc.aimaNumber}
                </Typography>
              )}
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default AIMAClientComponent;