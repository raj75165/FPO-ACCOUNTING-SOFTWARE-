import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppData } from '../context/AppDataContext';
import { COLORS, SIZES } from '../utils/theme';
import { formatCurrency, calculateTotals, formatDate } from '../utils/helpers';

function SummaryCard({ title, value, color, emoji }) {
  return (
    <View style={[styles.summaryCard, { borderLeftColor: color }]}>
      <Text style={styles.cardEmoji}>{emoji}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
    </View>
  );
}

function QuickStatRow({ label, value, color }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, color && { color }]}>{value}</Text>
    </View>
  );
}

export default function DashboardScreen({ navigation }) {
  const { transactions, members, meetings, fpoInfo, loading } = useAppData();

  const { totalIncome, totalExpense } = useMemo(
    () => calculateTotals(transactions),
    [transactions]
  );
  const netBalance = totalIncome - totalExpense;

  const recentTransactions = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [transactions]
  );

  const upcomingMeetings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return meetings
      .filter((m) => new Date(m.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  }, [meetings]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* FPO Header */}
        <View style={styles.fpoHeader}>
          <Text style={styles.fpoName}>{fpoInfo.name}</Text>
          {fpoInfo.registrationNumber ? (
            <Text style={styles.fpoReg}>Reg. No: {fpoInfo.registrationNumber}</Text>
          ) : null}
        </View>

        {/* Financial Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Overview</Text>
          <View style={styles.summaryGrid}>
            <SummaryCard
              title="Total Income"
              value={formatCurrency(totalIncome)}
              color={COLORS.income}
              emoji="💰"
            />
            <SummaryCard
              title="Total Expense"
              value={formatCurrency(totalExpense)}
              color={COLORS.expense}
              emoji="💸"
            />
          </View>
          <View style={[styles.balanceCard, { backgroundColor: netBalance >= 0 ? COLORS.primary : COLORS.expense }]}>
            <Text style={styles.balanceLabel}>Net Balance</Text>
            <Text style={styles.balanceValue}>{formatCurrency(netBalance)}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsCard}>
            <QuickStatRow label="Total Members" value={members.length.toString()} color={COLORS.primary} />
            <View style={styles.divider} />
            <QuickStatRow label="Total Transactions" value={transactions.length.toString()} />
            <View style={styles.divider} />
            <QuickStatRow label="Total Meetings" value={meetings.length.toString()} color={COLORS.info} />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Accounts', { screen: 'AddTransaction' })}
            >
              <Text style={styles.actionEmoji}>➕</Text>
              <Text style={styles.actionLabel}>Add Transaction</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Members', { screen: 'AddMember' })}
            >
              <Text style={styles.actionEmoji}>👤</Text>
              <Text style={styles.actionLabel}>Add Member</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Meetings', { screen: 'AddMeeting' })}
            >
              <Text style={styles.actionEmoji}>📅</Text>
              <Text style={styles.actionLabel}>Add Meeting</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('More', { screen: 'Reports' })}
            >
              <Text style={styles.actionEmoji}>📊</Text>
              <Text style={styles.actionLabel}>View Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Accounts')}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            {recentTransactions.map((tx) => (
              <View key={tx.id} style={styles.txRow}>
                <View style={styles.txLeft}>
                  <Text style={styles.txEmoji}>{tx.type === 'income' ? '📥' : '📤'}</Text>
                  <View>
                    <Text style={styles.txCategory}>{tx.category || 'General'}</Text>
                    <Text style={styles.txDate}>{formatDate(tx.date)}</Text>
                  </View>
                </View>
                <Text style={[styles.txAmount, { color: tx.type === 'income' ? COLORS.income : COLORS.expense }]}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Upcoming Meetings */}
        {upcomingMeetings.length > 0 && (
          <View style={[styles.section, { marginBottom: SIZES.xl }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Meetings</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Meetings')}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            {upcomingMeetings.map((meeting) => (
              <View key={meeting.id} style={styles.meetingRow}>
                <Text style={styles.meetingEmoji}>📅</Text>
                <View style={styles.meetingInfo}>
                  <Text style={styles.meetingTitle}>{meeting.title}</Text>
                  <Text style={styles.meetingDate}>{formatDate(meeting.date)} | {meeting.venue || 'TBD'}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SIZES.md,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  fpoHeader: {
    backgroundColor: COLORS.primary,
    padding: SIZES.md,
    alignItems: 'center',
  },
  fpoName: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  fpoReg: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 2,
  },
  section: {
    margin: SIZES.md,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  viewAll: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  balanceCard: {
    borderRadius: 12,
    padding: SIZES.md,
    marginTop: SIZES.sm,
    alignItems: 'center',
    elevation: 2,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  balanceValue: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.xs,
  },
  statLabel: {
    color: COLORS.text,
    fontSize: 15,
  },
  statValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.xs,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  actionBtn: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: SIZES.xs,
  },
  actionLabel: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.sm,
    borderRadius: 8,
    marginBottom: SIZES.xs,
    elevation: 1,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  txEmoji: {
    fontSize: 20,
  },
  txCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  txDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  meetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.sm,
    borderRadius: 8,
    marginBottom: SIZES.xs,
    elevation: 1,
    gap: SIZES.sm,
  },
  meetingEmoji: {
    fontSize: 24,
  },
  meetingInfo: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  meetingDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
