/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFetchRequests } from "../hooks/useFetchRequests";
import { CircularProgress, List, ListItem, ListItemText, Typography, Button, Link, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState } from "react";
import { useUpdateFileContent } from "../hooks/useUpdateFileContentRequest";
import { useDeleteRequest } from "../hooks/useDeleteRequest";
import { useQueryClient } from "@tanstack/react-query"; // Import useQueryClient

// Get S3 bucket URL from environment variable
const S3_BUCKET_URL = process.env.NEXT_PUBLIC_AWS_S3 || "";

const RequestList = () => {
  const { data: requests, isLoading, isError } = useFetchRequests();
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null); // Selected request for editing
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // File for editing
  const [requestToDelete, setRequestToDelete] = useState<any | null>(null); // Selected request for deletion
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for showing/hiding delete confirmation

  const queryClient = useQueryClient(); // Create an instance of the query client

  const updateFileMutation = useUpdateFileContent(); // Hook for updating files
  const deleteRequestMutation = useDeleteRequest(); // Hook for deleting requests

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const handleEditSubmit = () => {
    if (selectedRequest && uploadedFile) {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      updateFileMutation.mutate(
        { fileName: selectedRequest.file_name, formData },
        {
          onSuccess: () => {
            console.log("File updated successfully.");
            setSelectedRequest(null); // Clear selection after updating
            setUploadedFile(null); // Clear uploaded file
          },
          onError: (error) => {
            console.error("Error updating file:", error);
          },
        }
      );
    }
  };

  const handleDeleteRequest = () => {
    if (requestToDelete) {
      deleteRequestMutation.mutate(
        { requestId: requestToDelete.id, fileName: requestToDelete.file_name },
        {
          onSuccess: () => {
            console.log("Request deleted successfully.");
            setIsDeleteModalOpen(false); // Close modal
            setRequestToDelete(null); // Clear selected request

            // Invalidate and refetch the requests query to reflect the updated list
            queryClient.invalidateQueries({queryKey: ["requests"]}); // Ensure the query name matches the one in useFetchRequests
          },
          onError: (error) => {
            console.error("Error deleting request:", error);
          },
        }
      );
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography variant="h6">Error fetching requests</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Request List</Typography>
      <List>
        {requests?.map((request: any) => (
          <ListItem key={request.id}>
            <ListItemText
              primary={`Project: ${request.project} | Type: ${request.type_file}`}
              secondary={
                <>
                  File:{" "}
                  <Link
                    href={`${S3_BUCKET_URL}${request.file_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                  >
                    {request.file_name}
                  </Link>{" "}
                  | Created at: {new Date(request.created_at).toLocaleString()}
                </>
              }
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setSelectedRequest(request)} // Open editing dialog
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setRequestToDelete(request);
                setIsDeleteModalOpen(true); // Open delete confirmation modal
              }}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>

      {/* Editing dialog */}
      {selectedRequest && (
        <div style={{ marginTop: 20 }}>
          <Typography variant="h6">Edit Request: {selectedRequest.file_name}</Typography>
          <input type="file" onChange={handleFileUpload} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditSubmit}
            disabled={!uploadedFile || updateFileMutation.status === 'pending'}
          >
            {updateFileMutation.status === 'pending' ? "Saving..." : "Save"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => setSelectedRequest(null)}>
            Cancel
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this request?</DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={handleDeleteRequest}>
            {deleteRequestMutation.status === 'pending' ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RequestList;
