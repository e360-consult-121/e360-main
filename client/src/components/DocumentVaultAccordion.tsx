import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { StepData } from "../features/customer/documentVault/doumentVaultTypes";

const DocumentVaultAccordion = ({
  title,
  stepsData,
  source,
}: {
  title: string;
  stepsData: StepData;
  source: string;
}) => {
  const sortedSteps = Object.entries(stepsData).sort(
    ([, a], [, b]) => a.stepNumber - b.stepNumber
  );

  const [dropdownVisibleIndex, setDropdownVisibleIndex] = useState<
    number | null
  >(null);
  const [selectedStep, setSelectedStep] = useState<string>("");

  const handleToggleDropdown = (index: number) => {
    setDropdownVisibleIndex((prev) => (prev === index ? null : index));
  };

  const handleMove = () => {
    console.log("Selected step to move to:", selectedStep);
  };

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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
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

                        {source === "Admin" && (
                          <>
                            <IconButton
                              onClick={() => handleToggleDropdown(index)}
                            >
                              <KeyboardDoubleArrowLeftIcon
                                sx={{
                                  transform:
                                    dropdownVisibleIndex === index
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  transition: "transform 0.5s ease",
                                }}
                              />
                            </IconButton>

                            {dropdownVisibleIndex === index && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Select
                                  size="small"
                                  value={selectedStep}
                                  onChange={(e) =>
                                    setSelectedStep(e.target.value)
                                  }
                                  displayEmpty
                                  sx={{ minWidth: 120 }}
                                >
                                  <MenuItem value="" disabled>
                                    Select Step
                                  </MenuItem>
                                  {sortedSteps.map(([targetStepName], i) => (
                                    <MenuItem key={i} value={targetStepName}>
                                      {targetStepName}
                                    </MenuItem>
                                  ))}
                                </Select>
                                <Button
                                  variant="outlined"
                                  onClick={handleMove}
                                  sx={{
                                    textTransform: "none",
                                    borderColor: "black",
                                    borderRadius: "20px",
                                    color: "black",
                                  }}
                                >
                                  Move
                                </Button>
                              </Box>
                            )}
                          </>
                        )}
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <div className="bg-neutrals-200 text-white p-3 rounded-xl">
                        <Icon icon={"carbon:document"} width="24" height="24" />
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
