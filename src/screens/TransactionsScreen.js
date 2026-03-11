import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppData } from '../context/AppDataContext';
import { COLORS, SIZES } from '../utils/theme';
import { formatCurrency, formatDate, calculateTotals } from '../utils/helpers';

function FilterChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function TransactionItem({ item, onDelete }) {
  return (
    <View style={styles.txCard}>
      <View style={styles.txLeft}>
        <View style={[styles.txIcon, { backgroundColor: item.type === 'income' ? '#E8F5E9' : '#FFEBEE' }]}>
          <Text style={styles.txIconText}>{item.type === 'income' ? '📥' : '📤'}</Text>
        </View>
        <View style={styles.txInfo}>
          <Text style={styles.txCategory}>{item.category || 'General'}</Text>
          <Text style={styles.txDesc} numberOfLines={1}>{item.description || '—'}</Text>
          <Text style={styles.txDate}>{formatDate(item.date)}</Text>
        </View>
      </View>
      <View style={styles.txRight}>
        <Text style={[styles.txAmount, { color: item.type === 'income' ? COLORS.income : COLORS.expense }]}>
          {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
        </Text>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Text style={styles.deleteBtn}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TransactionsScreen({ navigation }) {
  const { transactions, deleteTransaction } = useAppData();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = transactions;
    if (filter !== 'all') {
      list = list.filter((t) => t.type === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          (t.category || '').toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filter, search]);

  const { totalIncome, totalExpense } = useMemo(() => calculateTotals(transactions), [transactions]);

  const handleDelete = (id) => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTransaction(id),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Summary Bar */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={[styles.summaryValue, { color: COLORS.income }]}>{formatCurrency(totalIncome)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Expense</Text>
          <Text style={[styles.summaryValue, { color: COLORS.expense }]}>{formatCurrency(totalExpense)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Balance</Text>
          <Text style={[styles.summaryValue, { color: totalIncome - totalExpense >= 0 ? COLORS.income : COLORS.expense }]}>
            {formatCurrency(totalIncome - totalExpense)}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        <FilterChip label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterChip label="Income" active={filter === 'income'} onPress={() => setFilter('income')} />
        <FilterChip label="Expense" active={filter === 'expense'} onPress={() => setFilter('expense')} />
      </View>

      {/* Transaction List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        contentContainerStyle={{ padding: SIZES.md, paddingBottom: 80 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💳</Text>
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubtext}>Tap + to add a transaction</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SIZES.md,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  searchContainer: {
    padding: SIZES.sm,
    paddingBottom: 0,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SIZES.sm,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
  },
  filterRow: {
    flexDirection: 'row',
    padding: SIZES.sm,
    gap: SIZES.xs,
  },
  chip: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.text,
  },
  chipTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  txCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: SIZES.sm,
    marginBottom: SIZES.xs,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  txIconText: {
    fontSize: 18,
  },
  txInfo: {
    flex: 1,
  },
  txCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  txDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  txDate: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
    gap: SIZES.xs,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  deleteBtn: {
    fontSize: 16,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SIZES.sm,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  fabText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
