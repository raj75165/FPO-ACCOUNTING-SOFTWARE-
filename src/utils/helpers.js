/**
 * Format a number as Indian currency (₹)
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
  return '₹' + parseFloat(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format a date string to display format
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a date-time string
 */
export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get today's date in ISO format (date only)
 */
export function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Calculate totals from transactions array
 */
export function calculateTotals(transactions) {
  return transactions.reduce(
    (acc, t) => {
      const amount = parseFloat(t.amount) || 0;
      if (t.type === 'income') {
        acc.totalIncome += amount;
      } else if (t.type === 'expense') {
        acc.totalExpense += amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );
}

/**
 * Get net balance from totals
 */
export function getNetBalance(totalIncome, totalExpense) {
  return totalIncome - totalExpense;
}

/**
 * Generate a report text from data
 */
export function generateReportText(fpoInfo, transactions, members, meetings, dateRange) {
  const { totalIncome, totalExpense } = calculateTotals(transactions);
  const netBalance = getNetBalance(totalIncome, totalExpense);

  const header = `
========================================
       FPO ACCOUNTING REPORT
========================================
Organization: ${fpoInfo.name || 'N/A'}
Registration No: ${fpoInfo.registrationNumber || 'N/A'}
Address: ${fpoInfo.address || 'N/A'}
Phone: ${fpoInfo.phone || 'N/A'}
Report Generated: ${formatDateTime(new Date().toISOString())}
${dateRange ? `Period: ${dateRange.from} to ${dateRange.to}` : ''}
========================================

FINANCIAL SUMMARY
-----------------
Total Income:   ${formatCurrency(totalIncome)}
Total Expense:  ${formatCurrency(totalExpense)}
Net Balance:    ${formatCurrency(netBalance)}

TRANSACTIONS (${transactions.length} records)
-----------------------------------------`;

  const transactionLines = transactions.map(
    (t, i) =>
      `${i + 1}. [${t.type.toUpperCase()}] ${t.category || 'General'} - ${formatCurrency(t.amount)}
   Date: ${formatDate(t.date)} | ${t.description || ''}`
  );

  const memberSection = `

MEMBERS SUMMARY
--------------
Total Members: ${members.length}
${members.map((m, i) => `${i + 1}. ${m.name} - ${m.phone || 'N/A'} (Shares: ${m.shares || 0})`).join('\n')}`;

  const meetingSection = `

MEETINGS SUMMARY
----------------
Total Meetings: ${meetings.length}
${meetings
  .slice(-5)
  .map(
    (m, i) =>
      `${i + 1}. ${m.title} - ${formatDate(m.date)}
   Venue: ${m.venue || 'N/A'} | Attendees: ${m.attendees || 0}`
  )
  .join('\n')}

========================================
        END OF REPORT
========================================`;

  return [header, transactionLines.join('\n'), memberSection, meetingSection].join('\n');
}

/**
 * Get month name from number (0-based)
 */
export function getMonthName(monthIndex) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[monthIndex] || '';
}

/**
 * Filter transactions by month and year
 */
export function filterTransactionsByMonth(transactions, month, year) {
  return transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
}

/**
 * Group transactions by category
 */
export function groupByCategory(transactions) {
  return transactions.reduce((acc, t) => {
    const key = t.category || 'General';
    if (!acc[key]) {
      acc[key] = { total: 0, count: 0, items: [] };
    }
    acc[key].total += parseFloat(t.amount) || 0;
    acc[key].count += 1;
    acc[key].items.push(t);
    return acc;
  }, {});
}

export const TRANSACTION_CATEGORIES = {
  income: [
    'Sales', 'Member Contribution', 'Grant/Subsidy', 'Loan',
    'Interest Income', 'Service Income', 'Other Income',
  ],
  expense: [
    'Purchase', 'Salary/Wages', 'Rent', 'Utilities', 'Transport',
    'Maintenance', 'Office Expenses', 'Loan Repayment', 'Other Expense',
  ],
};
