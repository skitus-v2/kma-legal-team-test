/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
} from "@mui/material";
import { useRouter } from 'next/navigation';
import { useFetchLawyerFiles } from "../../../../hooks/useFetchLawyerFilesRequest";
import { useUpdateFileContent } from "../../../../hooks/useUpdateFileContentRequest"; 
import { useQueryClient } from '@tanstack/react-query';   

const S3_BUCKET_URL = process.env.NEXT_PUBLIC_AWS_S3 || "";

const FileListPage = ({ params }: { params: { subdomainId: string } }) => {
  const subdomainId = parseInt(params.subdomainId, 10);
  const { data: fileData, isLoading, isError } = useFetchLawyerFiles(subdomainId);
  const router = useRouter();
  const queryClient = useQueryClient(); // Initialize queryClient

  // State for handling file editing
  const [editFile, setEditFile] = useState<{ id: number; name: string } | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Initialize the file update mutation
  const updateFileMutation = useUpdateFileContent();

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFile(event.target.files[0]);
    }
  };

  // Submit changes for editing file
  const handleEditSubmit = () => {
    if (uploadedFile && editFile) {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      updateFileMutation.mutate(
        { fileName: editFile.name, formData },
        {
          onSuccess: () => {
            console.log(`File ${editFile.name} content has been replaced.`);
            setEditFile(null); // Close the modal
            setUploadedFile(null); // Clear the uploaded file
            queryClient.invalidateQueries({ queryKey: ['files', subdomainId] }); // Correct way to pass queryKey
          },
          onError: (error) => {
            console.error("Error updating file content:", error);
          },
        }
      );
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Error loading files...</div>;

  return (
    <>
      <Typography variant="h3">Files for Subdomain: {fileData[0]?.subdomains?.subdomain_name || 'N/A'}</Typography>
      
      {/* Back Button */}
      <Button variant="contained" color="primary" onClick={() => router.back()} sx={{ mb: 2 }}>
        Go Back to Subdomains
      </Button>

      <List>
        {fileData?.map((file: any) => (
          <ListItem key={file.id}>
            <ListItemText
              primary={
                <Link href={`${S3_BUCKET_URL}${file.file_name}`} target="_blank" rel="noopener noreferrer">
                  {file.file_name}
                </Link>
              }
              secondary={`Subdomain: ${file.subdomains?.subdomain_name || 'Unknown subdomain'}`}
            />
            <Button variant="outlined" color="primary" onClick={() => setEditFile({ id: file.id, name: file.file_name })}>
              Edit
            </Button>
          </ListItem>
        ))}
      </List>

      {/* Edit Modal */}
      <Dialog open={!!editFile} onClose={() => setEditFile(null)}>
        <DialogTitle>Edit File: {editFile?.name}</DialogTitle>
        <DialogContent>
          <input
            accept="*/*"
            type="file"
            onChange={handleFileUpload}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditFile(null)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleEditSubmit} disabled={!uploadedFile || updateFileMutation.status === 'pending'}>
            {updateFileMutation.status === "pending" ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FileListPage;
