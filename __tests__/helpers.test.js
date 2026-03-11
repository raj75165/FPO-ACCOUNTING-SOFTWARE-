import {
  formatCurrency,
  formatDate,
  calculateTotals,
  getNetBalance,
  generateReportText,
  groupByCategory,
  filterTransactionsByMonth,
  TRANSACTION_CATEGORIES,
} from '../src/utils/helpers';

describe('formatCurrency', () => {
  it('formats positive amounts correctly', () => {
    expect(formatCurrency(1000)).toBe('₹1,000.00');
    expect(formatCurrency(50000)).toContain('₹');
    expect(formatCurrency(0)).toBe('₹0.00');
  });

  it('handles null/undefined/NaN', () => {
    expect(formatCurrency(null)).toBe('₹0.00');
    expect(formatCurrency(undefined)).toBe('₹0.00');
    expect(formatCurrency(NaN)).toBe('₹0.00');
  });

  it('formats decimal amounts', () => {
    expect(formatCurrency(100.5)).toBe('₹100.50');
    expect(formatCurrency(99.999)).toContain('₹100');
  });
});

describe('calculateTotals', () => {
  const transactions = [
    { id: '1', type: 'income', amount: 5000, date: '2024-01-01' },
    { id: '2', type: 'income', amount: 3000, date: '2024-01-15' },
    { id: '3', type: 'expense', amount: 2000, date: '2024-01-20' },
    { id: '4', type: 'expense', amount: 1500, date: '2024-02-01' },
  ];

  it('calculates income and expense totals', () => {
    const { totalIncome, totalExpense } = calculateTotals(transactions);
    expect(totalIncome).toBe(8000);
    expect(totalExpense).toBe(3500);
  });

  it('returns zeros for empty array', () => {
    const { totalIncome, totalExpense } = calculateTotals([]);
    expect(totalIncome).toBe(0);
    expect(totalExpense).toBe(0);
  });

  it('handles string amounts', () => {
    const txns = [
      { id: '1', type: 'income', amount: '1000' },
      { id: '2', type: 'expense', amount: '500' },
    ];
    const { totalIncome, totalExpense } = calculateTotals(txns);
    expect(totalIncome).toBe(1000);
    expect(totalExpense).toBe(500);
  });
});

describe('getNetBalance', () => {
  it('returns positive balance when income > expense', () => {
    expect(getNetBalance(10000, 3000)).toBe(7000);
  });

  it('returns negative balance when expense > income', () => {
    expect(getNetBalance(2000, 5000)).toBe(-3000);
  });

  it('returns zero when equal', () => {
    expect(getNetBalance(5000, 5000)).toBe(0);
  });
});

describe('groupByCategory', () => {
  const transactions = [
    { id: '1', type: 'income', amount: 5000, category: 'Sales' },
    { id: '2', type: 'income', amount: 3000, category: 'Sales' },
    { id: '3', type: 'income', amount: 2000, category: 'Grant/Subsidy' },
    { id: '4', type: 'expense', amount: 1000, category: 'Purchase' },
  ];

  it('groups by category correctly', () => {
    const grouped = groupByCategory(transactions);
    expect(grouped['Sales'].total).toBe(8000);
    expect(grouped['Sales'].count).toBe(2);
    expect(grouped['Grant/Subsidy'].total).toBe(2000);
    expect(grouped['Purchase'].total).toBe(1000);
  });

  it('uses General for missing category', () => {
    const txns = [{ id: '1', type: 'income', amount: 500 }];
    const grouped = groupByCategory(txns);
    expect(grouped['General']).toBeDefined();
    expect(grouped['General'].total).toBe(500);
  });
});

describe('filterTransactionsByMonth', () => {
  const transactions = [
    { id: '1', type: 'income', amount: 5000, date: '2024-01-15' },
    { id: '2', type: 'income', amount: 3000, date: '2024-01-20' },
    { id: '3', type: 'expense', amount: 2000, date: '2024-02-10' },
    { id: '4', type: 'income', amount: 1000, date: '2023-01-05' },
  ];

  it('filters by month and year', () => {
    const jan2024 = filterTransactionsByMonth(transactions, 0, 2024);
    expect(jan2024).toHaveLength(2);
  });

  it('returns empty for months with no transactions', () => {
    const mar2024 = filterTransactionsByMonth(transactions, 2, 2024);
    expect(mar2024).toHaveLength(0);
  });
});

describe('TRANSACTION_CATEGORIES', () => {
  it('has income categories', () => {
    expect(TRANSACTION_CATEGORIES.income).toBeInstanceOf(Array);
    expect(TRANSACTION_CATEGORIES.income.length).toBeGreaterThan(0);
    expect(TRANSACTION_CATEGORIES.income).toContain('Sales');
  });

  it('has expense categories', () => {
    expect(TRANSACTION_CATEGORIES.expense).toBeInstanceOf(Array);
    expect(TRANSACTION_CATEGORIES.expense.length).toBeGreaterThan(0);
    expect(TRANSACTION_CATEGORIES.expense).toContain('Purchase');
  });
});

describe('generateReportText', () => {
  const fpoInfo = {
    name: 'Test FPO',
    registrationNumber: 'FPO/2024/001',
    address: 'Test Village',
    phone: '9876543210',
  };
  const transactions = [
    { id: '1', type: 'income', amount: 5000, category: 'Sales', date: '2024-01-01', description: 'Crop sales' },
    { id: '2', type: 'expense', amount: 2000, category: 'Purchase', date: '2024-01-05' },
  ];
  const members = [
    { id: '1', name: 'Ramesh Kumar', phone: '9876543210', shares: 10 },
  ];
  const meetings = [
    { id: '1', title: 'Board Meeting', date: '2024-01-15', venue: 'Village Hall', attendees: 20 },
  ];

  it('generates report with FPO info', () => {
    const report = generateReportText(fpoInfo, transactions, members, meetings, null);
    expect(report).toContain('Test FPO');
    expect(report).toContain('FPO/2024/001');
  });

  it('includes financial summary', () => {
    const report = generateReportText(fpoInfo, transactions, members, meetings, null);
    expect(report).toContain('FINANCIAL SUMMARY');
    expect(report).toContain('5,000.00');
    expect(report).toContain('2,000.00');
  });

  it('includes members and meetings', () => {
    const report = generateReportText(fpoInfo, transactions, members, meetings, null);
    expect(report).toContain('Ramesh Kumar');
    expect(report).toContain('Board Meeting');
  });
});
