import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import ConsultationsTable from "./ConsultationsTable";
import { useFetchAllConsultationsQuery } from "../../../features/admin/consultations/consultationApi";
import { useEffect, useState } from "react";
import { AllConsultationsTypes } from "../../../features/admin/consultations/consultationTypes";
import { useSearchPagination } from "../../../features/searchPagination/useSearchPagination";
import { Search } from "@mui/icons-material";

const Consultations = () => {
  const [consultationData, setConsultationData] =
    useState<AllConsultationsTypes[]>();
  const [pagination, setPagination] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchPaginationState, searchPaginationActions] =
    useSearchPagination();

  const { data, isLoading, isError } = useFetchAllConsultationsQuery({
    ...searchPaginationState,
  });

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setConsultationData(data.consultations);
      setPagination(data.pagination);
    }
  }, [data, isLoading, isError]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPaginationActions.setSearch(searchInput);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput, searchPaginationActions]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const paginationProps = pagination
    ? {
        pagination,
        onPageChange: (page: number) => {
          searchPaginationActions.setPage(page);
        },
        onRowsPerPageChange: (limit: number) => {
          searchPaginationActions.setLimit(limit);
          searchPaginationActions.setPage(1);
        },
      }
    : undefined;

  return (
    <Box sx={{ ml: { xs: "-30px", md: 0 }, px: { md: 4 }, mt: { md: 3 } }}>
      {isLoading ? (
        <Box
          sx={{ ml: { xs: "40%", md: "45%" }, mt: { xs: "70%", md: "25%" } }}
        >
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Typography color="error">Failed to load consultations.</Typography>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <TextField
              placeholder="Search applications..."
              value={searchInput}
              onChange={handleSearchChange}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
          </Box>
          {consultationData?.length ? (
            <ConsultationsTable data={consultationData} {...paginationProps} />
          ) : (
            <Typography
              variant="h6"
              color="textSecondary"
              align="center"
              mt={35}
            >
              No consultations found.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default Consultations;
