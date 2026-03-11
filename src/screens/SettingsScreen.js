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

function MenuItem({ emoji, label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuEmoji}>{emoji}</Text>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const { fpoInfo, saveFPOInfo } = useAppData();

  const [name, setName] = useState(fpoInfo.name || '');
  const [regNo, setRegNo] = useState(fpoInfo.registrationNumber || '');
  const [address, setAddress] = useState(fpoInfo.address || '');
  const [phone, setPhone] = useState(fpoInfo.phone || '');
  const [email, setEmail] = useState(fpoInfo.email || '');
  const [year, setYear] = useState(fpoInfo.establishedYear || '');
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'FPO name is required.');
      return;
    }
    setSaving(true);
    try {
      await saveFPOInfo({
        name: name.trim(),
        registrationNumber: regNo.trim(),
        address: address.trim(),
        phone: phone.trim(),
        email: email.trim(),
        establishedYear: year.trim(),
      });
      setEditMode(false);
      Alert.alert('Saved', 'FPO information updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save FPO information.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* FPO Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏢 FPO Information</Text>
            <TouchableOpacity onPress={() => setEditMode(!editMode)}>
              <Text style={styles.editBtn}>{editMode ? 'Cancel' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>

          {editMode ? (
            <View>
              <Text style={styles.label}>FPO Name *</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="FPO Organization Name" placeholderTextColor={COLORS.textSecondary} />

              <Text style={styles.label}>Registration Number</Text>
              <TextInput style={styles.input} value={regNo} onChangeText={setRegNo} placeholder="e.g., FPO/2020/001" placeholderTextColor={COLORS.textSecondary} />

              <Text style={styles.label}>Address</Text>
              <TextInput style={[styles.input, styles.textArea]} value={address} onChangeText={setAddress} placeholder="Full address" multiline numberOfLines={3} placeholderTextColor={COLORS.textSecondary} />

              <Text style={styles.label}>Phone</Text>
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Contact number" keyboardType="phone-pad" placeholderTextColor={COLORS.textSecondary} />

              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email address" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={COLORS.textSecondary} />

              <Text style={styles.label}>Established Year</Text>
              <TextInput style={styles.input} value={year} onChangeText={setYear} placeholder="e.g., 2019" keyboardType="number-pad" maxLength={4} placeholderTextColor={COLORS.textSecondary} />

              <TouchableOpacity style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
                <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.infoCard}>
              <InfoRow label="Name" value={fpoInfo.name || 'Not set'} />
              <InfoRow label="Reg. No" value={fpoInfo.registrationNumber || 'Not set'} />
              <InfoRow label="Address" value={fpoInfo.address || 'Not set'} />
              <InfoRow label="Phone" value={fpoInfo.phone || 'Not set'} />
              <InfoRow label="Email" value={fpoInfo.email || 'Not set'} />
              <InfoRow label="Est. Year" value={fpoInfo.establishedYear || 'Not set'} />
            </View>
          )}
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.menuCard}>
            <MenuItem emoji="📊" label="Reports & Share" onPress={() => navigation.navigate('Reports')} />
            <View style={styles.menuDivider} />
            <MenuItem emoji="💾" label="Backup & Restore" onPress={() => navigation.navigate('Backup')} />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>FPO Accounting Software</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDesc}>
            A complete accounting solution for Farmer Producer Organizations
          </Text>
          <Text style={styles.appFeatures}>
            ✅ Income & Expense Tracking{'\n'}
            ✅ Member Management{'\n'}
            ✅ Meeting Scheduler{'\n'}
            ✅ Report Generation & Sharing{'\n'}
            ✅ Data Backup & Restore
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.md,
  },
  section: {
    marginBottom: SIZES.md,
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
  editBtn: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 15,
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
    height: 72,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: SIZES.md,
    alignItems: 'center',
    marginTop: SIZES.md,
    elevation: 2,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: SIZES.md,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    width: 80,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
  },
  menuEmoji: {
    fontSize: 20,
    marginRight: SIZES.sm,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  menuArrow: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SIZES.xl + SIZES.sm,
  },
  appInfo: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    alignItems: 'center',
    elevation: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  appVersion: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  appDesc: {
    fontSize: 13,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SIZES.sm,
  },
  appFeatures: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: SIZES.sm,
    lineHeight: 22,
    textAlign: 'left',
    width: '100%',
  },
});
