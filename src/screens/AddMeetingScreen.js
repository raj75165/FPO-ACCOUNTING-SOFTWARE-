import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppData } from '../context/AppDataContext';
import { COLORS, SIZES } from '../utils/theme';
import { getTodayISO } from '../utils/helpers';

const MEETING_TYPES = [
  { value: 'board', label: '🏛️ Board Meeting' },
  { value: 'general', label: '👥 General Body' },
  { value: 'agm', label: '📋 AGM' },
  { value: 'training', label: '📚 Training' },
  { value: 'other', label: '📅 Other' },
];

function TypeChip({ item, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item.label}</Text>
    </TouchableOpacity>
  );
}

export default function AddMeetingScreen({ navigation }) {
  const { addMeeting } = useAppData();

  const [title, setTitle] = useState('');
  const [meetingType, setMeetingType] = useState('general');
  const [date, setDate] = useState(getTodayISO());
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [agenda, setAgenda] = useState('');
  const [attendees, setAttendees] = useState('');
  const [minutes, setMinutes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Meeting title is required.');
      return;
    }
    if (!date) {
      Alert.alert('Validation Error', 'Meeting date is required.');
      return;
    }

    setSaving(true);
    try {
      await addMeeting({
        title: title.trim(),
        meetingType,
        date,
        time: time.trim(),
        venue: venue.trim(),
        agenda: agenda.trim(),
        attendees: parseInt(attendees, 10) || 0,
        minutes: minutes.trim(),
        status: new Date(date) < new Date() ? 'completed' : 'scheduled',
      });
      Alert.alert('Success', 'Meeting added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save meeting. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Meeting Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Monthly Board Meeting"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Meeting Type *</Text>
        <View style={styles.chipRow}>
          {MEETING_TYPES.map((t) => (
            <TypeChip
              key={t.value}
              item={t}
              selected={meetingType === t.value}
              onPress={() => setMeetingType(t.value)}
            />
          ))}
        </View>

        <Text style={styles.label}>Date (YYYY-MM-DD) *</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="2024-01-01"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Time (HH:MM)</Text>
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          placeholder="10:00 AM"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Venue / Location</Text>
        <TextInput
          style={styles.input}
          value={venue}
          onChangeText={setVenue}
          placeholder="Meeting venue or location"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Agenda</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={agenda}
          onChangeText={setAgenda}
          placeholder="Meeting agenda points..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Number of Attendees</Text>
        <TextInput
          style={styles.input}
          value={attendees}
          onChangeText={setAttendees}
          placeholder="0"
          keyboardType="number-pad"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Meeting Minutes / Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={minutes}
          onChangeText={setMinutes}
          placeholder="Record meeting minutes or decisions..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Meeting'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.md,
    paddingBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
    marginTop: SIZES.sm,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SIZES.sm,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.xs,
  },
  chip: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.text,
  },
  chipTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: SIZES.md,
    alignItems: 'center',
    marginTop: SIZES.lg,
    elevation: 3,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
