import React, { useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import EditIconOutlined from "@mui/icons-material/EditOutlined";
import SaveIcon from "@mui/icons-material/Save";
import TextInput from "../../../components/TextInput";

interface BankDetailsSection {
  id: string;
  title: string;
  fields: { id: string; label: string; value: string }[];
  isEditing: boolean;
}

const GrenadaInvestmentOptions: React.FC = () => {
  const isTablet = useMediaQuery("(max-width:900px)");

  // State for bank details sections - Using same structure but with Grenada-specific IDs
  const [sections, setSections] = useState<BankDetailsSection[]>([
    {
      id: "grenada-etf",
      title: "Economical Transformation Fund (ETF) Donation",
      isEditing: false,
      fields: [
        { id: "grenada-etf-bank1", label: "Bank Name", value: "" },
        { id: "grenada-etf-bank2", label: "Account Number", value: "" },
        { id: "grenada-etf-bank3", label: "Account Holder Name", value: "" },
        { id: "grenada-etf-bank4", label: "SWIFT/BIC Code", value: "" },
        {
          id: "grenada-etf-bank5",
          label: "IBAN Number (if applicable)",
          value: "",
        },
        { id: "grenada-etf-bank6", label: "IFSC Code", value: "" },
      ],
    },
    {
      id: "grenada-real-estate",
      title: "Real Estate Investment",
      isEditing: false,
      fields: [
        { id: "grenada-re-bank1", label: "Bank Name", value: "" },
        { id: "grenada-re-bank2", label: "Account Number", value: "" },
        { id: "grenada-re-bank3", label: "Account Holder Name", value: "" },
        { id: "grenada-re-bank4", label: "SWIFT/BIC Code", value: "" },
        {
          id: "grenada-re-bank5",
          label: "IBAN Number (if applicable)",
          value: "",
        },
        { id: "grenada-re-bank6", label: "IFSC Code", value: "" },
      ],
    },
  ]);

  const handleBankDetailsChange = (
    sectionId: string,
    fieldId: string,
    value: string
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: section.fields.map((field) => {
              if (field.id === fieldId) {
                return { ...field, value };
              }
              return field;
            }),
          };
        }
        return section;
      })
    );
  };

  const toggleEditMode = (sectionId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            isEditing: !section.isEditing,
          };
        }
        return section;
      })
    );
  };

  return (
    <>
      {sections.map((section) => (
        <Box
          key={section.id}
          sx={{
            mb: 0,
            p: 2,
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              mt: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontSize: "18px", fontWeight: 600 }}>
              {section.title}
            </Typography>
            <Box
              onClick={() => toggleEditMode(section.id)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {section.isEditing ? (
                <SaveIcon />
              ) : (
                <EditIconOutlined sx={{ color: "#000" }} />
              )}
              <Typography>
                {section.isEditing ? "Save " : "Edit Details"}
              </Typography>
            </Box>
          </Box>

          {/* Flexbox container instead of Grid */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              margin: "-12px", // Negative margin to offset padding of child items
            }}
          >
            {section.fields.map((field) => (
              <Box
                key={field.id}
                sx={{
                  width: {
                    xs: "100%", // Full width on mobile
                    sm: isTablet ? "50%" : "33.33%", // Half width on tablet, one-third on desktop
                  },
                  padding: "12px", // Padding for spacing
                  boxSizing: "border-box",
                }}
              >
                <TextInput
                  label={field.label}
                  value={field.value}
                  onChange={(e) =>
                    handleBankDetailsChange(
                      section.id,
                      field.id,
                      e.target.value
                    )
                  }
                  required={true}
                  placeholder="Enter Bank Details"
                  disabled={!section.isEditing}
                />
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </>
  );
};

export default GrenadaInvestmentOptions;
