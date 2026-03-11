// Mock AsyncStorage before imports
jest.mock('@react-native-async-storage/async-storage', () => {
  const storage = {};
  return {
    getItem: jest.fn(async (key) => storage[key] ?? null),
    setItem: jest.fn(async (key, value) => { storage[key] = value; }),
    removeItem: jest.fn(async (key) => { delete storage[key]; }),
    clear: jest.fn(async () => { Object.keys(storage).forEach(k => delete storage[k]); }),
  };
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getMembers,
  saveMembers,
  addMember,
  deleteMember,
  addTransaction,
  getTransactions,
  addMeeting,
  getMeetings,
  exportAllData,
  importAllData,
} from '../src/utils/storage';

beforeEach(() => {
  jest.clearAllMocks();
  AsyncStorage.getItem.mockResolvedValue(null);
});

describe('Members storage', () => {
  it('returns empty array when no data', async () => {
    const members = await getMembers();
    expect(members).toEqual([]);
  });

  it('adds a member', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    AsyncStorage.setItem.mockResolvedValue(undefined);

    const member = await addMember({
      name: 'Ramesh Kumar',
      phone: '9876543210',
      village: 'Test Village',
      shares: 5,
    });

    expect(member.name).toBe('Ramesh Kumar');
    expect(member.id).toBeDefined();
    expect(member.createdAt).toBeDefined();
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('deletes a member', async () => {
    const existingMembers = [
      { id: '123', name: 'Test User', phone: '1234567890' },
    ];
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingMembers));
    AsyncStorage.setItem.mockResolvedValue(undefined);

    await deleteMember('123');

    const savedData = JSON.parse(AsyncStorage.setItem.mock.calls[0][1]);
    expect(savedData).toHaveLength(0);
  });
});

describe('Transactions storage', () => {
  it('returns empty array when no data', async () => {
    const txns = await getTransactions();
    expect(txns).toEqual([]);
  });

  it('adds a transaction', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    AsyncStorage.setItem.mockResolvedValue(undefined);

    const tx = await addTransaction({
      type: 'income',
      amount: 10000,
      category: 'Sales',
      date: '2024-01-15',
    });

    expect(tx.type).toBe('income');
    expect(tx.amount).toBe(10000);
    expect(tx.id).toBeDefined();
  });
});

describe('Meetings storage', () => {
  it('returns empty array when no data', async () => {
    const meetings = await getMeetings();
    expect(meetings).toEqual([]);
  });

  it('adds a meeting', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    AsyncStorage.setItem.mockResolvedValue(undefined);

    const meeting = await addMeeting({
      title: 'Board Meeting',
      meetingType: 'board',
      date: '2024-02-01',
      venue: 'Village Hall',
    });

    expect(meeting.title).toBe('Board Meeting');
    expect(meeting.id).toBeDefined();
    expect(meeting.meetingType).toBe('board');
  });
});

describe('exportAllData', () => {
  it('exports data with correct structure', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    const data = await exportAllData();
    expect(data.version).toBe('1.0');
    expect(data.exportedAt).toBeDefined();
    expect(data.members).toBeInstanceOf(Array);
    expect(data.transactions).toBeInstanceOf(Array);
    expect(data.meetings).toBeInstanceOf(Array);
  });
});

describe('importAllData', () => {
  it('throws for invalid backup data', async () => {
    await expect(importAllData(null)).rejects.toThrow('Invalid backup file format');
    await expect(importAllData({})).rejects.toThrow('Invalid backup file format');
    await expect(importAllData({ noVersion: true })).rejects.toThrow('Invalid backup file format');
  });

  it('imports valid backup data', async () => {
    AsyncStorage.setItem.mockResolvedValue(undefined);
    AsyncStorage.getItem.mockResolvedValue(null);

    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      members: [{ id: '1', name: 'Test User' }],
      transactions: [{ id: '2', type: 'income', amount: 1000 }],
      meetings: [{ id: '3', title: 'AGM' }],
      fpoInfo: { name: 'Test FPO' },
    };

    const result = await importAllData(backupData);
    expect(result).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(4);
  });
});
