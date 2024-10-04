/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback } from "react";
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Pagination,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useFetchLawyerDomains } from "../hooks/useLawyerDomainRequest";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";

const DomainLawyerList = () => {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState<string>(""); // Tracks immediate input value
  const [search, setSearch] = useState<string | null>(null); // Tracks debounced search value
  const router = useRouter(); // Initialize router from Next.js

  // Function to update search query after a debounce delay
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setPage(1); // Reset to page 1 for new searches
    }, 400),
    []
  );

  // Handles input change immediately, debounces the search update
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // Update input field value immediately
    debouncedSetSearch(event.target.value); // Trigger debounced search update
  };

  // Fetch domain data from the server with the debounced search value
  const { data: domainData, isLoading, isError } = useFetchLawyerDomains(page, 10, search);

  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto' }} />;
  if (isError) return <Typography variant="h6" color="error">Error loading domains...</Typography>;

  // Handle domain selection and navigate to the subdomain page
  const handleDomainSelect = (domainId: number) => {
    router.push(`/lawyer/domains/${domainId}/subdomains`); // Navigate to the subdomain page
  };

  return (
    <Box sx={{ width: '100%', padding: '20px' }}>
      <TextField
        label="Поиск доменов"
        variant="outlined"
        fullWidth
        value={inputValue} // Use immediate input value for the field
        onChange={handleInputChange}
        placeholder="Введите имя домена"
        sx={{ mb: 3 }}
      />

      {/* Domain list */}
      <List>
        {domainData?.domains?.map((domain: any) => (
          <ListItem
            key={domain.id}
            onClick={() => handleDomainSelect(domain.id)}
            sx={{
              mb: 1,
              borderBottom: '1px solid #ccc',
              cursor: 'pointer', // Ensure it's clear this is clickable
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            <ListItemText
              primary={domain.domain_name}
              secondary={`ID: ${domain.id}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(domainData?.total / 10)} // Total number of pages
        page={page}
        onChange={(_, value) => setPage(value)}
        sx={{ mt: 3 }}
      />
    </Box>
  );
};

export default DomainLawyerList;
