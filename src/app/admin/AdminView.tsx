"use client";

import React, { useState } from 'react';
import DnsRecords from './DnsRecords';
import DomainList from './DomainAdminList';
import Sidebar from '../components/Sidebar'; // Импорт Sidebar
import { Box } from '@mui/material';

const AdminView = () => {
  const [selectedDomain, setSelectedDomain] = useState<{ id: string, name: string } | null>(null);

  const handleDomainSelect = (domain: { id: string, name: string }) => {
    setSelectedDomain(domain); // Передаем весь объект домена
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar role="admin" /> {/* Добавляем Sidebar для админов */}
      <Box sx={{ flexGrow: 1, padding: '20px' }}>
        {!selectedDomain ? (
          <DomainList onDomainSelect={handleDomainSelect} />
        ) : (
          <DnsRecords domainId={selectedDomain.id} domainName={selectedDomain.name} />
        )}
      </Box>
    </Box>
  );
};

export default AdminView;
