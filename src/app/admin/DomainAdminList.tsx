/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useFetchAdminDomains } from "../hooks/useFetchAdminDomains";
import {
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Pagination,
  Box,
} from "@mui/material";
import debounce from "lodash/debounce";

interface Domain {
  id: string;
  name: string;
  status: string;
  plan: {
    name: string;
  };
  created_on: string;
}

interface DomainListProps {
  onDomainSelect: (domain: { id: string; name: string }) => void;
}

const DomainList: React.FC<DomainListProps> = ({ onDomainSelect }) => {
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(searchTerm); 
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const { data: domains, isLoading, isError, isFetching } = useFetchAdminDomains(page, perPage, debouncedSearchTerm);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
      setPage(1);
    }, 300),
    [setPage, setDebouncedSearchTerm]
  );
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  if (isLoading || isFetching) return <CircularProgress />;
  if (isError) return <Typography variant="h6">Error fetching domains</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Domain List (Admin)
      </Typography>

      <TextField
        label="Search Domains"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleInputChange}
        sx={{ mb: 3 }}
      />

      <List>
        {domains?.result?.map((domain: Domain) => (
          <ListItem 
            key={domain.id} 
            onClick={() => onDomainSelect({ id: domain.id, name: domain.name })}
            sx={{ display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <ListItemText
              primary={`Domain: ${domain.name} | Status: ${domain.status} | Plan: ${domain.plan.name}`}
              secondary={`Created on: ${new Date(domain.created_on).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>

      <Pagination
        count={Math.ceil(domains?.result_info?.total_count / perPage)}
        page={page}
        onChange={handlePageChange}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default DomainList;
