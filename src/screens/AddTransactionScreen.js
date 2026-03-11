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
import { TRANSACTION_CATEGORIES, getTodayISO } from '../utils/helpers';

function TypeButton({ label, type, selected, onPress }) {
  const color = type === 'income' ? COLORS.income : COLORS.expense;
  return (
    <TouchableOpacity
      style={[styles.typeBtn, selected && { backgroundColor: color, borderColor: color }]}
      onPress={onPress}
    >
      <Text style={[styles.typeBtnText, selected && { color: COLORS.white }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function CategoryItem({ category, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.catItem, selected && styles.catItemSelected]}
      onPress={onPress}
    >
      <Text style={[styles.catText, selected && styles.catTextSelected]}>{category}</Text>
    </TouchableOpacity>
  );
}

export default function AddTransactionScreen({ navigation, route }) {
  const { addTransaction } = useAppData();
  const editItem = route.params?.transaction;

  const [type, setType] = useState(editItem?.type || 'income');
  const [amount, setAmount] = useState(editItem?.amount?.toString() || '');
  const [category, setCategory] = useState(editItem?.category || '');
  const [description, setDescription] = useState(editItem?.description || '');
  const [date, setDate] = useState(editItem?.date || getTodayISO());
  const [saving, setSaving] = useState(false);

  const categories = TRANSACTION_CATEGORIES[type] || [];

  const handleSave = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount.');
      return;
    }
    if (!category) {
      Alert.alert('Validation Error', 'Please select a category.');
      return;
    }
    if (!date) {
      Alert.alert('Validation Error', 'Please enter a date.');
      return;
    }

    setSaving(true);
    try {
      await addTransaction({
        type,
        amount: parseFloat(amount),
        category,
        description: description.trim(),
        date,
      });
      Alert.alert('Success', 'Transaction added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save transaction. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Type Selection */}
        <Text style={styles.label}>Transaction Type *</Text>
        <View style={styles.typeRow}>
          <TypeButton
            label="💰 Income"
            type="income"
            selected={type === 'income'}
            onPress={() => { setType('income'); setCategory(''); }}
          />
          <TypeButton
            label="💸 Expense"
            type="expense"
            selected={type === 'expense'}
            onPress={() => { setType('expense'); setCategory(''); }}
          />
        </View>

        {/* Amount */}
        <Text style={styles.label}>Amount (₹) *</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="decimal-pad"
          placeholderTextColor={COLORS.textSecondary}
        />

        {/* Date */}
        <Text style={styles.label}>Date (YYYY-MM-DD) *</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="2024-01-01"
          placeholderTextColor={COLORS.textSecondary}
        />

        {/* Category */}
        <Text style={styles.label}>Category *</Text>
        <View style={styles.catGrid}>
          {categories.map((cat) => (
            <CategoryItem
              key={cat}
              category={cat}
              selected={category === cat}
              onPress={() => setCategory(cat)}
            />
          ))}
        </View>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add notes or description..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          numberOfLines={3}
        />

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Transaction'}</Text>
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
  typeRow: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  typeBtn: {
    flex: 1,
    padding: SIZES.sm,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  typeBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
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
    height: 80,
    textAlignVertical: 'top',
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.xs,
  },
  catItem: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  catItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catText: {
    fontSize: 13,
    color: COLORS.text,
  },
  catTextSelected: {
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
