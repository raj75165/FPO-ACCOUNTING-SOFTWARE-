import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  MEMBERS: '@fpo_members',
  TRANSACTIONS: '@fpo_transactions',
  MEETINGS: '@fpo_meetings',
  FPO_INFO: '@fpo_info',
};

// Generic get
async function getItem(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
}

// Generic set
async function setItem(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    return false;
  }
}

// Members
export async function getMembers() {
  return (await getItem(KEYS.MEMBERS)) || [];
}

export async function saveMembers(members) {
  return setItem(KEYS.MEMBERS, members);
}

export async function addMember(member) {
  const members = await getMembers();
  const newMember = {
    ...member,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  members.push(newMember);
  await saveMembers(members);
  return newMember;
}

export async function updateMember(id, updates) {
  const members = await getMembers();
  const index = members.findIndex((m) => m.id === id);
  if (index !== -1) {
    members[index] = { ...members[index], ...updates, updatedAt: new Date().toISOString() };
    await saveMembers(members);
    return members[index];
  }
  return null;
}

export async function deleteMember(id) {
  const members = await getMembers();
  const filtered = members.filter((m) => m.id !== id);
  return saveMembers(filtered);
}

// Transactions
export async function getTransactions() {
  return (await getItem(KEYS.TRANSACTIONS)) || [];
}

export async function saveTransactions(transactions) {
  return setItem(KEYS.TRANSACTIONS, transactions);
}

export async function addTransaction(transaction) {
  const transactions = await getTransactions();
  const newTransaction = {
    ...transaction,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  transactions.push(newTransaction);
  await saveTransactions(transactions);
  return newTransaction;
}

export async function updateTransaction(id, updates) {
  const transactions = await getTransactions();
  const index = transactions.findIndex((t) => t.id === id);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates, updatedAt: new Date().toISOString() };
    await saveTransactions(transactions);
    return transactions[index];
  }
  return null;
}

export async function deleteTransaction(id) {
  const transactions = await getTransactions();
  const filtered = transactions.filter((t) => t.id !== id);
  return saveTransactions(filtered);
}

// Meetings
export async function getMeetings() {
  return (await getItem(KEYS.MEETINGS)) || [];
}

export async function saveMeetings(meetings) {
  return setItem(KEYS.MEETINGS, meetings);
}

export async function addMeeting(meeting) {
  const meetings = await getMeetings();
  const newMeeting = {
    ...meeting,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  meetings.push(newMeeting);
  await saveMeetings(meetings);
  return newMeeting;
}

export async function updateMeeting(id, updates) {
  const meetings = await getMeetings();
  const index = meetings.findIndex((m) => m.id === id);
  if (index !== -1) {
    meetings[index] = { ...meetings[index], ...updates, updatedAt: new Date().toISOString() };
    await saveMeetings(meetings);
    return meetings[index];
  }
  return null;
}

export async function deleteMeeting(id) {
  const meetings = await getMeetings();
  const filtered = meetings.filter((m) => m.id !== id);
  return saveMeetings(filtered);
}

// FPO Info
export async function getFPOInfo() {
  return (
    (await getItem(KEYS.FPO_INFO)) || {
      name: 'My FPO',
      registrationNumber: '',
      address: '',
      phone: '',
      email: '',
      establishedYear: '',
    }
  );
}

export async function saveFPOInfo(info) {
  return setItem(KEYS.FPO_INFO, info);
}

// Full backup
export async function exportAllData() {
  const [members, transactions, meetings, fpoInfo] = await Promise.all([
    getMembers(),
    getTransactions(),
    getMeetings(),
    getFPOInfo(),
  ]);
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    fpoInfo,
    members,
    transactions,
    meetings,
  };
}

// Full restore
export async function importAllData(data) {
  if (!data || !data.version) {
    throw new Error('Invalid backup file format');
  }
  await Promise.all([
    saveMembers(data.members || []),
    saveTransactions(data.transactions || []),
    saveMeetings(data.meetings || []),
    saveFPOInfo(data.fpoInfo || {}),
  ]);
  return true;
}

export default {
  KEYS,
  getMembers,
  saveMembers,
  addMember,
  updateMember,
  deleteMember,
  getTransactions,
  saveTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getMeetings,
  saveMeetings,
  addMeeting,
  updateMeeting,
  deleteMeeting,
  getFPOInfo,
  saveFPOInfo,
  exportAllData,
  importAllData,
};
