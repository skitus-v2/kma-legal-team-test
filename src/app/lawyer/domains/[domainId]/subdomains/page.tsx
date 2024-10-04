/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { CircularProgress, List, ListItem, ListItemText, Typography, Button, Box } from "@mui/material";
import { useFetchLawyerSubdomains } from "../../../../hooks/useLawyerSubdomainRequest"; // Adjust the path to your hooks
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const SubdomainListPage = ({ params }: { params: { domainId: string } }) => {
  const domainId = parseInt(params.domainId, 10); // Convert domainId to number
  const { data: subdomainData, isLoading, isError } = useFetchLawyerSubdomains(domainId);
  const router = useRouter(); // Initialize the router for navigation

  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (isError) return <Typography variant="h6" color="error">Error loading subdomains...</Typography>;

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Subdomains for Domain: {subdomainData[0]?.domains?.domain_name || 'N/A'}
      </Typography>
      
      {/* Back Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.back()}
        sx={{ mb: 3 }}
      >
        Go Back to Domains
      </Button>
      
      <List>
        {subdomainData?.map((subdomain: any) => (
          <ListItem
            key={subdomain.id}
            onClick={() => router.push(`/lawyer/subdomains/${subdomain.id}/files`)}
            sx={{ mb: 1, borderBottom: '1px solid #ccc', cursor: 'pointer' }}
          >
            <ListItemText
              primary={subdomain.subdomain_name}
              secondary={`Domain: ${subdomain.domains?.domain_name || 'Unknown domain'}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SubdomainListPage;
