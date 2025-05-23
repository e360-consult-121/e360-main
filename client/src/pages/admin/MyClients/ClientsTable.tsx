import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Modal,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import countryList from "react-select-country-list";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const customStyles = {
  control: (base: any) => ({
    ...base,
    padding: "9px 10px", // y = 6px, x = 10px
    minHeight: "40px",
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
};

interface TableProps {
  data: any[] | undefined;
  onAddClient: any;
}

const ClientsTable: React.FC<TableProps> = ({ data, onAddClient }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    nationality: "",
    amount: "",
    currency: "",
  });

  const countryOptions = useMemo(() => countryList().getData(), []);

  const navigate = useNavigate();

  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name!]: value }));
  };

  const handleAddClient = async () => {
    // console.log("Form Data:", formData,selectedFile);
    try {
      setIsLoading(true);
      await onAddClient({data:formData,file: selectedFile}).unwrap();
      toast.success("Client added successfully!");
    } catch (err) {
      console.error("Failed to add client:", err);
      toast.error("Failed to add client.");
    } finally {
      setFormData({
        name: "",
        email: "",
        phone: "",
        serviceType: "",
        nationality: "",
        amount: "",
        currency: "",
      });
      setIsLoading(false);
      setOpenModal(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) =>
    setPage(newPage);
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateFilterChange = (event: any) => {
    setDateFilter(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const filteredData =
    data
      ?.filter((item) => {
        if (statusFilter === "All") return true;
        return item.status === statusFilter;
      })
      .filter((item) => {
        const startingDate = dayjs(item?.startTime).format("YYYY-MM-DD");
        if (dateFilter === "All") return true;
        if (dateFilter === "Today") return startingDate === today;
        if (dateFilter === "Yesterday") return startingDate === yesterday;
        return false;
      }) || [];

  return (
    <>
      <Paper sx={{ p: 2, boxShadow: "none" }}>
        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bolder", mb: 2 }}>
            My Clients
          </Typography>

          <Box sx={{ display: "flex", gap: 5, mb: 1 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Date</InputLabel>
              <Select
                value={dateFilter}
                onChange={handleDateFilterChange}
                label="Date"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Today">Today</MenuItem>
                <MenuItem value="Yesterday">Yesterday</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Status"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Application Approved">
                  Application Approved
                </MenuItem>
                <MenuItem value="Ongoing Application">
                  Ongoing Application
                </MenuItem>
              </Select>
            </FormControl>

            <Button
              sx={{
                textTransform: "none",
                borderRadius: "20px",
                bgcolor: "#F6C328",
                color: "#282827",
                my: 1,
                px: 2,
              }}
              onClick={() => setOpenModal(true)}
            >
              Add New Client
            </Button>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Name",
                  "Case ID",
                  "Last Service",
                  "Starting Date",
                  "Total Revenue",
                  "Status",
                  "Action",
                ].map((header) => (
                  <TableCell key={header} sx={{ color: "#8D8883" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((client) => (
                  <TableRow key={client._id}>
                    {/* <TableCell sx={{ borderBottom: "none" }}>{consultation._id}</TableCell> */}
                    <TableCell sx={{ borderBottom: "none" }}>
                      {client.name}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {client.caseId}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {client.lastService}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {client.startingDate}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {client.totalRevenue}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      <Typography
                        sx={{
                          color:
                            client.status === "Application Approved"
                              ? "#64AE65"
                              : "#F6C328",
                        }}
                      >
                        {client.status}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      <Button
                        sx={{
                          color: "black",
                          textTransform: "none",
                          marginLeft: "10px",
                        }}
                        onClick={() =>
                          navigate(`/admin/myclient/${client.userId}`)
                        }
                      >
                        View &gt;
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* Add client Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2} textAlign="center" fontWeight="bold">
            Add a New Client
          </Typography>

          {/* First Row */}
          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              label="Enter Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Enter Email ID"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Enter Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Box>

          {/* Second Row */}
          <Box display="flex" gap={2} mb={2}>
            <FormControl fullWidth>
              <InputLabel>Service Taken</InputLabel>
              <Select
                name="serviceType"
                value={formData.serviceType}
                label="Service Taken"
                onChange={(e: any) => handleInputChange(e)}
              >
                <MenuItem value="Dominica">Dominica Passport</MenuItem>
                <MenuItem value="Grenada">Grenada Passport</MenuItem>
                <MenuItem value="Portugal">Portugal D7 Visa</MenuItem>
                <MenuItem value="Dubai">Dubai Residency</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <Box>
                <ReactSelect
                  styles={customStyles}
                  options={countryOptions}
                  value={countryOptions.find(
                    (c: any) => c.label === formData.nationality
                  )}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      nationality: selectedOption?.label || "",
                    })
                  }
                />
              </Box>
            </FormControl>
          </Box>

          <Box display="flex" gap={2} mb={2}>
            <FormControl fullWidth>
              <InputLabel>Currency Type</InputLabel>
              <Select
                name="currency"
                value={formData.currency}
                label="Currency Type"
                onChange={(e: any) => handleInputChange(e)}
              >
                <MenuItem value="inr">₹ (INR)</MenuItem>
                <MenuItem value="usd">$ (USD)</MenuItem>
                <MenuItem value="eur">€ (EUR)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Charged Amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
            />
          </Box>

          {/* ✅ File Upload Section */}
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Button
              variant="outlined"
              component="label"
              sx={{
                color: "black",
                border: "1px solid gray",
                borderRadius: "20px",
                px: 3,
                textTransform: "none",
              }}
              startIcon={<FileUploadIcon sx={{ color: "black" }} />}
            >
              Upload Payment Invoice
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                  }
                }}
              />
            </Button>
            <Typography variant="body2">
              {selectedFile ? selectedFile.name : "No file selected"}
            </Typography>
          </Box>

          {/* Buttons */}
          <Box display="flex" justifyContent="center" gap={2} mt={2}>
            <Button
              onClick={() => setOpenModal(false)}
              sx={{
                color: "black",
                border: "1px solid gray",
                borderRadius: "20px",
                px: 4,
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddClient}
              disabled={
                !formData.name ||
                !formData.email ||
                !formData.phone ||
                !formData.serviceType ||
                !formData.nationality ||
                !formData.amount ||
                !selectedFile ||
                isLoading === true
              }
              sx={{
                boxShadow: "none",
                borderRadius: "20px",
                px: 5,
                textTransform: "none",
              }}
            >
              {isLoading ? "Adding client..." : "Add client"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ClientsTable;
