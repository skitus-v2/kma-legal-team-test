"use client";

import React, { useState } from "react";
import { Container, Button, Typography, Box } from "@mui/material";
import AdminView from "./AdminView";
import LawyerView from "../lawyer/LawyerView";
import Sidebar from "../components/Sidebar";

const AdminPanel = () => {
  const [role, setRole] = useState<"admin" | "lawyer" | null>(null); // Role state

  const handleLoginAsAdmin = () => {
    setRole("admin"); // Set role to admin
  };

  const handleLoginAsLawyer = () => {
    setRole("lawyer"); // Set role to lawyer
  };

  return (
    <Container>
      {role === null ? (
        <div>
          <Typography variant="h4" gutterBottom>
            Please choose a role to log in:
          </Typography>
          <Button variant="contained" color="primary" onClick={handleLoginAsAdmin}>
            Login as Admin
          </Button>
          <Button variant="contained" color="secondary" onClick={handleLoginAsLawyer} sx={{ ml: 2 }}>
            Login as Lawyer
          </Button>
        </div>
      ) : (
        <Box display="flex">
          {/* Sidebar */}
          <Sidebar role={role} />

          {/* Main Content based on the role */}
          <Box flex={1} p={3}>
            {role === "admin" ? <AdminView /> : <LawyerView />}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default AdminPanel;
