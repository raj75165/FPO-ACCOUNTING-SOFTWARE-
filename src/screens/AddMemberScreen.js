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

export default function AddMemberScreen({ navigation }) {
  const { addMember } = useAppData();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [shares, setShares] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Member name is required.');
      return;
    }
    if (phone && !/^\d{10}$/.test(phone)) {
      Alert.alert('Validation Error', 'Phone number must be 10 digits.');
      return;
    }

    setSaving(true);
    try {
      await addMember({
        name: name.trim(),
        phone: phone.trim(),
        village: village.trim(),
        district: district.trim(),
        aadhar: aadhar.trim(),
        shares: parseInt(shares, 10) || 0,
        bankAccount: bankAccount.trim(),
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'active',
      });
      Alert.alert('Success', 'Member added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add member. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter member's full name"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="10-digit mobile number"
          keyboardType="phone-pad"
          maxLength={10}
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Village / Town</Text>
        <TextInput
          style={styles.input}
          value={village}
          onChangeText={setVillage}
          placeholder="Village or town name"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>District</Text>
        <TextInput
          style={styles.input}
          value={district}
          onChangeText={setDistrict}
          placeholder="District name"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.sectionTitle}>Financial Information</Text>

        <Text style={styles.label}>Aadhar Number</Text>
        <TextInput
          style={styles.input}
          value={aadhar}
          onChangeText={setAadhar}
          placeholder="12-digit Aadhar number"
          keyboardType="number-pad"
          maxLength={12}
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Number of Shares</Text>
        <TextInput
          style={styles.input}
          value={shares}
          onChangeText={setShares}
          placeholder="0"
          keyboardType="number-pad"
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={styles.label}>Bank Account Number</Text>
        <TextInput
          style={styles.input}
          value={bankAccount}
          onChangeText={setBankAccount}
          placeholder="Bank account number"
          keyboardType="number-pad"
          placeholderTextColor={COLORS.textSecondary}
        />

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Adding...' : 'Add Member'}</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SIZES.md,
    marginBottom: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SIZES.xs,
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
