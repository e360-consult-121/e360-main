import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import ClientEligibilityForm from "./ClientEligibilityForm";
import Consultations from "./Consultations";
import PaymentAndInvoiceManagement from "./PaymentAndInvoiceManagement";
import { ConsultationInfoTypes, EligibilityFormTypes, PaymentInfoTypes } from "../../../features/admin/clientInformation/clientInformationTypes";

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

  const ClientConsultation = ({
    consultationInfo,
    paymentInfo,
    eligibilityForm,
    formSubmisionDate
  }: {
    consultationInfo: ConsultationInfoTypes;
    paymentInfo: PaymentInfoTypes;
    eligibilityForm: EligibilityFormTypes;
    formSubmisionDate:string
  }) => {
    const tabs = [
      {
        label: "Client Eligibility Form",
        content: <ClientEligibilityForm formSubmisionDate={formSubmisionDate} eligibilityForm={eligibilityForm} />,
        show: eligibilityForm != null,
      },
      {
        label: "Consultations",
        content: <Consultations consultationInfo={consultationInfo} />,
        show: consultationInfo != null,
      },
      {
        label: "Payment & Invoice Management",
        content: <PaymentAndInvoiceManagement paymentInfo={paymentInfo} />,
        show: paymentInfo != null,
      },
    ].filter(tab => tab.show); // Only include tabs with valid data
  
    const [value, setValue] = useState(0);
  
    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
  
    return (
      <Box sx={{ px: 5, mt: 5, width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{ style: { backgroundColor: "black" } }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                sx={{
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "gray",
                  "&.Mui-selected": { color: "black" },
                }}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </Box>
        {tabs.map((tab, index) => (
          <CustomTabPanel key={index} value={value} index={index}>
            {tab.content}
          </CustomTabPanel>
        ))}
      </Box>
    );
  };
  

export default ClientConsultation;
