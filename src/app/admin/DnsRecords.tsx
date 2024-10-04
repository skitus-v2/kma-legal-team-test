/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Typography,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { useFetchDnsRecords } from "../hooks/useFetchDnsRecords";
import { useCreateDnsRecord } from "../hooks/useCreateDnsRecord";
import { useUpdateDnsRecord } from "../hooks/useUpdateDnsRecord";
import { useDeleteDnsRecord } from "../hooks/useDeleteDnsRecord";
import { useFetchRequests } from "../hooks/useFetchRequests";
import { useUpdateConfig } from "../hooks/useUpdateConfig";
import { useFetchFiles } from "../hooks/useFetchFile";

const DnsRecords = ({ domainId, domainName }: { domainId: string; domainName: string }) => {
  const { data: records = [], isLoading, isError } = useFetchDnsRecords(domainId);
  const { mutate: createDnsRecord } = useCreateDnsRecord(domainId);
  const { mutate: updateDnsRecord } = useUpdateDnsRecord(domainId);
  const { mutate: deleteDnsRecord } = useDeleteDnsRecord(domainId);
  const { data: requests = [], isLoading: isRequestsLoading } = useFetchRequests();
  const { data: files = [], isLoading: isFilesLoading } = useFetchFiles(); // Fetching files from S3
  const { mutate: updateConfig } = useUpdateConfig();

  const [editRecordId, setEditRecordId] = useState<string | null>(null);
  const [editRecordData, setEditRecordData] = useState({ type: "", name: "", content: "", proxied: false });
  const [newRecord, setNewRecord] = useState({ type: "", name: "", content: "", proxied: false });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<string | null>(null);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedSubdomain, setSelectedSubdomain] = useState("");
  const [pickFromS3, setPickFromS3] = useState(false); // Toggle for S3 files

  const handleEditClick = (record: any) => {
    setEditRecordId(record.id);
    setEditRecordData({
      type: record.type,
      name: record.name,
      content: record.content,
      proxied: record.proxied,
    });
  };

  const handleSaveEdit = () => {
    if (editRecordId) {
      updateDnsRecord({ recordId: editRecordId, record: editRecordData });
      setEditRecordId(null);
    }
  };

  const handleAddNewRecord = () => {
    createDnsRecord(newRecord);
    setNewRecord({ type: "", name: "", content: "", proxied: false });
    setIsAddModalOpen(false);
  };

  const handleDelete = (recordId: string) => {
    deleteDnsRecord(recordId);
    setIsDeleteModalOpen(null);
  };

  const handleOpenRequestModal = () => {
    setIsRequestModalOpen(true);
  };

  const handleCloseRequestModal = () => {
    setIsRequestModalOpen(false);
    setSelectedRequest(null);
    setSelectedFile(null);
    setSelectedSubdomain("");
    setPickFromS3(false);
  };

  const handleUpdateConfig = () => {
    let selectedFileName = "";
    let source = ""; 
    let requestId = null;

    if (pickFromS3 && selectedFile) {
      selectedFileName = selectedFile.key;
      source = "s3";
    } else if (!pickFromS3 && selectedRequest) {
      selectedFileName = selectedRequest.file_name;
      source = "request";
      requestId = selectedRequest.id;
    }

    if (selectedFileName && selectedSubdomain) {
      const s3Link = `${process.env.NEXT_PUBLIC_AWS_S3}${selectedFileName}`; 
      updateConfig({
        domain: domainName,
        subdomain: selectedSubdomain,
        s3Link,
        source,
        requestId,
      });
      handleCloseRequestModal();
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography variant="h6">Error fetching DNS records</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        DNS Records for Domain: {domainName}
      </Typography>
      
      <List>
        {records.map((record: any) => (
          <ListItem key={record.id}>
            {editRecordId === record.id ? (
              <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%', cursor: 'pointer' }}>
                <TextField
                  label="Type"
                  value={editRecordData.type}
                  onChange={(e) => setEditRecordData({ ...editRecordData, type: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Name"
                  value={editRecordData.name}
                  onChange={(e) => setEditRecordData({ ...editRecordData, name: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Content"
                  value={editRecordData.content}
                  onChange={(e) => setEditRecordData({ ...editRecordData, content: e.target.value })}
                  fullWidth
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography>Proxied</Typography>
                  <Switch
                    checked={editRecordData.proxied}
                    onChange={(e) => setEditRecordData({ ...editRecordData, proxied: e.target.checked })}
                  />
                </Box>
                <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
              </Box>
            ) : (
              <>
                <ListItemText
                  primary={`${record.type} - ${record.name}`}
                  secondary={`Content: ${record.content}, Proxied: ${record.proxied ? 'Yes' : 'No'}`}
                />
                <Button onClick={() => handleEditClick(record)}>Edit</Button>
                <Button color="secondary" onClick={() => setIsDeleteModalOpen(record.id)}>Delete</Button>
              </>
            )}
          </ListItem>
        ))}
      </List>

      <Button variant="contained" color="primary" onClick={() => setIsAddModalOpen(true)} sx={{ mt: 2 }}>
        Add New Record
      </Button>

      {/* Add New Record Dialog */}
      <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <DialogTitle>Add New DNS Record</DialogTitle>
        <DialogContent>
          <TextField
            label="Type"
            fullWidth
            value={newRecord.type}
            onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Name"
            fullWidth
            value={newRecord.name}
            onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Content"
            fullWidth
            value={newRecord.content}
            onChange={(e) => setNewRecord({ ...newRecord, content: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>Proxied</Typography>
            <Switch
              checked={newRecord.proxied}
              onChange={(e) => setNewRecord({ ...newRecord, proxied: e.target.checked })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddNewRecord}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Record Dialog */}
      <Dialog open={Boolean(isDeleteModalOpen)} onClose={() => setIsDeleteModalOpen(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this DNS record?</DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteModalOpen(null)}>Cancel</Button>
          <Button color="secondary" onClick={() => handleDelete(isDeleteModalOpen!)}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Update Config Dialog */}
      <Button variant="contained" color="secondary" onClick={handleOpenRequestModal} sx={{ mt: 3 }}>
        Update Config
      </Button>

      <Dialog open={isRequestModalOpen} onClose={handleCloseRequestModal}>
        <DialogTitle>Select DNS Record Request or File</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography>Pick file from S3?</Typography>
            <Switch checked={pickFromS3} onChange={(e) => setPickFromS3(e.target.checked)} />
          </Box>

          {pickFromS3 ? (
            isFilesLoading ? (
              <CircularProgress />
            ) : (
              <FormControl fullWidth margin="normal">
                <InputLabel>Select S3 File</InputLabel>
                <Select
                  value={selectedFile ? selectedFile.key : ""}
                  onChange={(e) => {
                    const file = files.find((f: any) => f.key === e.target.value);
                    setSelectedFile(file);
                  }}
                >
                  {files.map((file: any) => (
                    <MenuItem key={file.key} value={file.key}>
                      {file.key}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )
          ) : (
            <>
              {isRequestsLoading ? (
                <CircularProgress />
              ) : (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Select Request</InputLabel>
                  <Select
                    value={selectedRequest ? selectedRequest.id : ""}
                    onChange={(e) => {
                      const request = requests.find((r: any) => r.id === e.target.value);
                      setSelectedRequest(request);
                    }}
                  >
                    {requests.map((request: any) => (
                      <MenuItem key={request.id} value={request.id}>
                        {`${request.project} - ${request.type_file} - ${request.file_name}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </>
          )}

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Subdomain</InputLabel>
            <Select
              value={selectedSubdomain}
              onChange={(e) => setSelectedSubdomain(e.target.value)}
            >
              {records.map((subdomain: any) => (
                <MenuItem key={subdomain.id} value={subdomain.name.split(".")[0]}>
                  {subdomain.name.split(".")[0]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRequestModal}>Cancel</Button>
          <Button
            color="primary"
            onClick={handleUpdateConfig}
            disabled={
              pickFromS3 ? !selectedFile || !selectedSubdomain : !selectedRequest || !selectedSubdomain
            }
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DnsRecords;
