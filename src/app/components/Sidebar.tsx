"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { List, ListItem, ListItemText, Divider, Typography, Box } from "@mui/material";

const Sidebar = ({ role }: { role: "admin" | "lawyer" }) => {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNavigation = (route: string) => {
    setSelected(route);
    router.push(route);
  };

  return (
    <Box sx={{ width: 250, padding: 2, background: "#f7f7f7" }}>
      <Typography variant="h6" gutterBottom>
        {role === "admin" ? "Admin Panel" : "Lawyer Panel"}
      </Typography>
      <List component="nav">
        {role === "admin" ? (
          <>
            <ListItem
              component="div"
              onClick={() => handleNavigation("/admin")}
              sx={{
                cursor: 'pointer',
                backgroundColor: selected === "/admin" ? '#e0e0e0' : 'transparent',
                '&:hover': { backgroundColor: '#f0f0f0' },
              }}
            >
              <ListItemText primary="Admin Domain List" />
            </ListItem>
            <Divider />
          </>
        ) : (
          <>
            <ListItem
              component="div"
              onClick={() => handleNavigation("/lawyer")}
              sx={{
                cursor: 'pointer',
                backgroundColor: selected === "/lawyer" ? '#e0e0e0' : 'transparent',
                '&:hover': { backgroundColor: '#f0f0f0' },
              }}
            >
              <ListItemText primary="Lawyer Domain List" />
            </ListItem>
            <Divider />
          </>
        )}
        <ListItem
          component="div"
          onClick={() => handleNavigation("/requests")}
          sx={{
            cursor: 'pointer',
            backgroundColor: selected === "/requests" ? '#e0e0e0' : 'transparent',
            '&:hover': { backgroundColor: '#f0f0f0' },
          }}
        >
          <ListItemText primary="Request List" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
