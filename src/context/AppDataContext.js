import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getMembers,
  getTransactions,
  getMeetings,
  getFPOInfo,
  addMember,
  updateMember,
  deleteMember,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  addMeeting,
  updateMeeting,
  deleteMeeting,
  saveFPOInfo,
  exportAllData,
  importAllData,
} from '../utils/storage';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [fpoInfo, setFpoInfo] = useState({
    name: 'My FPO',
    registrationNumber: '',
    address: '',
    phone: '',
    email: '',
    establishedYear: '',
  });
  const [loading, setLoading] = useState(true);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [m, t, mt, info] = await Promise.all([
        getMembers(),
        getTransactions(),
        getMeetings(),
        getFPOInfo(),
      ]);
      setMembers(m);
      setTransactions(t);
      setMeetings(mt);
      setFpoInfo(info);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Member operations
  const handleAddMember = async (member) => {
    const newMember = await addMember(member);
    setMembers((prev) => [...prev, newMember]);
    return newMember;
  };

  const handleUpdateMember = async (id, updates) => {
    const updated = await updateMember(id, updates);
    setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
    return updated;
  };

  const handleDeleteMember = async (id) => {
    await deleteMember(id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Transaction operations
  const handleAddTransaction = async (transaction) => {
    const newTx = await addTransaction(transaction);
    setTransactions((prev) => [...prev, newTx]);
    return newTx;
  };

  const handleUpdateTransaction = async (id, updates) => {
    const updated = await updateTransaction(id, updates);
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const handleDeleteTransaction = async (id) => {
    await deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Meeting operations
  const handleAddMeeting = async (meeting) => {
    const newMeeting = await addMeeting(meeting);
    setMeetings((prev) => [...prev, newMeeting]);
    return newMeeting;
  };

  const handleUpdateMeeting = async (id, updates) => {
    const updated = await updateMeeting(id, updates);
    setMeetings((prev) => prev.map((m) => (m.id === id ? updated : m)));
    return updated;
  };

  const handleDeleteMeeting = async (id) => {
    await deleteMeeting(id);
    setMeetings((prev) => prev.filter((m) => m.id !== id));
  };

  // FPO info operations
  const handleSaveFPOInfo = async (info) => {
    await saveFPOInfo(info);
    setFpoInfo(info);
  };

  // Backup & Restore
  const handleExportData = async () => {
    return exportAllData();
  };

  const handleImportData = async (data) => {
    await importAllData(data);
    await loadAllData();
  };

  return (
    <AppDataContext.Provider
      value={{
        members,
        transactions,
        meetings,
        fpoInfo,
        loading,
        // Member operations
        addMember: handleAddMember,
        updateMember: handleUpdateMember,
        deleteMember: handleDeleteMember,
        // Transaction operations
        addTransaction: handleAddTransaction,
        updateTransaction: handleUpdateTransaction,
        deleteTransaction: handleDeleteTransaction,
        // Meeting operations
        addMeeting: handleAddMeeting,
        updateMeeting: handleUpdateMeeting,
        deleteMeeting: handleDeleteMeeting,
        // FPO Info
        saveFPOInfo: handleSaveFPOInfo,
        // Backup/Restore
        exportData: handleExportData,
        importData: handleImportData,
        // Refresh
        refreshData: loadAllData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}

export default AppDataContext;
