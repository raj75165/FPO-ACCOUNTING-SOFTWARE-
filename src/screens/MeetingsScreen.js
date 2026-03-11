import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppData } from '../context/AppDataContext';
import { COLORS, SIZES } from '../utils/theme';
import { formatDate, formatDateTime } from '../utils/helpers';

const MEETING_TYPES = {
  board: { label: 'Board Meeting', emoji: '🏛️', color: '#1565C0' },
  general: { label: 'General Body', emoji: '👥', color: '#2E7D32' },
  agm: { label: 'AGM', emoji: '📋', color: '#6A1B9A' },
  training: { label: 'Training', emoji: '📚', color: '#E65100' },
  other: { label: 'Other', emoji: '📅', color: '#424242' },
};

function MeetingCard({ item, onDelete }) {
  const typeInfo = MEETING_TYPES[item.meetingType] || MEETING_TYPES.other;
  const meetingDate = new Date(item.date);
  const isPast = meetingDate < new Date();

  return (
    <View style={[styles.card, isPast && styles.pastCard]}>
      <View style={[styles.typeTag, { backgroundColor: typeInfo.color }]}>
        <Text style={styles.typeTagText}>{typeInfo.emoji} {typeInfo.label}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detail}>📅 {formatDate(item.date)}</Text>
        {item.time ? <Text style={styles.detail}>🕐 {item.time}</Text> : null}
      </View>
      {item.venue ? (
        <Text style={styles.detail}>📍 {item.venue}</Text>
      ) : null}
      {item.agenda ? (
        <Text style={styles.agenda} numberOfLines={2}>{item.agenda}</Text>
      ) : null}
      <View style={styles.cardFooter}>
        <Text style={styles.attendees}>👤 {item.attendees || 0} attendees</Text>
        {isPast && <Text style={styles.pastBadge}>Completed</Text>}
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Text style={styles.deleteBtn}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MeetingsScreen({ navigation }) {
  const { meetings, deleteMeeting } = useAppData();
  const [activeTab, setActiveTab] = useState('upcoming');

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const up = meetings
      .filter((m) => new Date(m.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    const pt = meetings
      .filter((m) => new Date(m.date) < now)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    return { upcoming: up, past: pt };
  }, [meetings]);

  const displayList = activeTab === 'upcoming' ? upcoming : past;

  const handleDelete = (id) => {
    Alert.alert('Delete Meeting', 'Are you sure you want to delete this meeting?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMeeting(id),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            Upcoming ({upcoming.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
            Past ({past.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MeetingCard item={item} onDelete={handleDelete} />}
        contentContainerStyle={{ padding: SIZES.md, paddingBottom: 80 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'upcoming' ? 'No upcoming meetings' : 'No past meetings'}
            </Text>
            {activeTab === 'upcoming' && (
              <Text style={styles.emptySubtext}>Tap + to schedule a meeting</Text>
            )}
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddMeeting')}>
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  pastCard: {
    opacity: 0.85,
  },
  typeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: SIZES.xs,
  },
  typeTagText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  detailRow: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  detail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  agenda: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.sm,
    paddingTop: SIZES.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  attendees: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  pastBadge: {
    backgroundColor: '#E8F5E9',
    color: COLORS.success,
    fontSize: 11,
    paddingHorizontal: SIZES.xs,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: '600',
  },
  deleteBtn: {
    fontSize: 18,
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
