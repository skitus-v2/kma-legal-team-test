/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useCreateRequest } from "../hooks/useCreateRequest";
import DomainLawyerList from "./DomainLawyerList"; // No need to pass onDomainSelect now
import Sidebar from "../components/Sidebar";

const LawyerView = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [typeFile, setTypeFile] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const createRequestMutation = useCreateRequest();

  const handleOpenRequestModal = () => {
    setIsRequestModalOpen(true);
  };

  const handleCloseRequestModal = () => {
    setIsRequestModalOpen(false);
    setProjectName("");
    setTypeFile("");
    setUploadedFile(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const handleSubmitRequest = async () => {
    if (!projectName || !typeFile || !uploadedFile) {
      console.error("Project name, file type, and file are required");
      return;
    }

    const formData = new FormData();
    formData.append("projectName", projectName);
    formData.append("typeFile", typeFile);
    formData.append("file", uploadedFile);

    createRequestMutation.mutate(formData, {
      onSuccess: (data) => {
        console.log("Request created successfully", data);
        handleCloseRequestModal();
      },
      onError: (error) => {
        console.error("Failed to create request", error);
      },
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar role="lawyer" /> {/* Sidebar for lawyers */}
      <Box sx={{ flexGrow: 1, padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Domain List (Lawyer)
        </Typography>

        <Button variant="contained" color="primary" onClick={handleOpenRequestModal} sx={{ mb: 3 }}>
          Create request
        </Button>

        <Dialog open={isRequestModalOpen} onClose={handleCloseRequestModal}>
          <DialogTitle>Create request</DialogTitle>
          <DialogContent>
            <TextField
              label="Project"
              fullWidth
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Type file"
              fullWidth
              value={typeFile}
              onChange={(e) => setTypeFile(e.target.value)}
              sx={{ mb: 2 }}
            />
            <input
              accept="*/*"
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              style={{ marginBottom: '16px' }} // Consistent spacing for file input
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRequestModal}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitRequest}
              disabled={createRequestMutation.status === 'pending'}
            >
              {createRequestMutation.status === 'pending' ? <CircularProgress size={24} /> : "Create request"}
            </Button>
          </DialogActions>
        </Dialog>

        <DomainLawyerList />
      </Box>
    </Box>
  );
};

export default LawyerView;
