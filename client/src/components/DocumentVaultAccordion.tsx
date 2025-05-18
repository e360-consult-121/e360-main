import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { StepData } from "../features/customer/documentVault/doumentVaultTypes";

const DocumentVaultAccordion = ({
  title,
  stepsData,
  // source,
}: {
  title: string;
  stepsData: StepData;
  source?: string;
}) => {
  const sortedSteps = Object.entries(stepsData).sort(
    ([, a], [, b]) => a.stepNumber - b.stepNumber
  );

  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {sortedSteps.map(([stepName, stepDetails]) => (
        <Accordion key={stepName}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              Step {stepDetails.stepNumber}: {stepName}
            </Typography>
          </AccordionSummary>
         <AccordionDetails>
              {stepDetails.documents.length > 0 ? (
                <List>
                  {stepDetails.documents.map((doc, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <a
                          href={doc.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              color: "black",
                              textTransform: "none",
                              borderRadius: "20px",
                            }}
                          >
                            Preview
                          </Button>
                        </a>
                      }
                    >
                      <ListItemIcon>
                        <div className="bg-neutrals-200 text-white p-3 rounded-xl">
                          <Icon
                            icon={"carbon:document"}
                            width="24"
                            height="24"
                          />
                        </div>
                      </ListItemIcon>

                      <ListItemText primary={doc.question} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No documents uploaded for this step.
                </Typography>
              )}
            </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default DocumentVaultAccordion;
