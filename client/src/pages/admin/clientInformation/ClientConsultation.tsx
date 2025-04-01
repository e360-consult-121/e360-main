import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import ClientEligibilityForm from "./ClientEligibilityForm";
import Consultations from "./Consultations";
import PaymentAndInvoiceManagement from "./PaymentAndInvoiceManagement";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

const ClientConsultation = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ px: 5, mt: 5, width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        TabIndicatorProps={{ style: { backgroundColor: "black" } }} 
      >
        <Tab
          label="Client Eligibility Form"
          sx={{
            textTransform:"none",
            fontSize:"16px",
            fontWeight:"bold",
            color: "gray", 
            "&.Mui-selected": { color: "black", }, 
          }}
          {...a11yProps(0)}
        />
        <Tab
          label="Consultations"
          sx={{
            textTransform:"none",
            fontSize:"16px",
            fontWeight:"bold",
            color: "gray",
            "&.Mui-selected": { color: "black" },
          }}
          {...a11yProps(1)}
        />
        <Tab
          label="Payment & Invoice Management"
          sx={{
            textTransform:"none",
            fontSize:"16px",
            fontWeight:"bold",
            color: "gray",
            "&.Mui-selected": { color: "black" },
          }}
          {...a11yProps(2)}
        />
      </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ClientEligibilityForm/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Consultations/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <PaymentAndInvoiceManagement/>
      </CustomTabPanel>
    </Box>
  );
};

export default ClientConsultation;
