import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useAppData } from '../context/AppDataContext';
import { COLORS, SIZES } from '../utils/theme';
import { formatDateTime, generateBackupFileName } from '../utils/helpers';

function ActionCard({ emoji, title, description, buttonLabel, onPress, buttonColor, loading }) {
  return (
    <View style={styles.actionCard}>
      <Text style={styles.cardEmoji}>{emoji}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{description}</Text>
      <TouchableOpacity
        style={[styles.cardBtn, { backgroundColor: buttonColor || COLORS.primary }, loading && styles.cardBtnDisabled]}
        onPress={onPress}
        disabled={loading}
      >
        <Text style={styles.cardBtnText}>{loading ? 'Please wait...' : buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function BackupScreen() {
  const { exportData, importData, members, transactions, meetings, fpoInfo } = useAppData();
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [lastBackup, setLastBackup] = useState(null);

  const handleBackup = async () => {
    setBackingUp(true);
    try {
      const data = await exportData();
      const json = JSON.stringify(data, null, 2);
      const fileName = generateBackupFileName(data.fpoInfo?.name);
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Save/Share FPO Backup',
        });
        setLastBackup(new Date().toISOString());
        Alert.alert('Backup Complete', 'Your data has been exported successfully. Save this file in a safe location.');
      } else {
        Alert.alert(
          'Backup Ready',
          `Backup file saved at:\n${fileUri}\n\nPlease copy this file to a safe location.`
        );
        setLastBackup(new Date().toISOString());
      }
    } catch (error) {
      Alert.alert('Backup Failed', 'Could not create backup: ' + error.message);
    } finally {
      setBackingUp(false);
    }
  };

  const handleRestore = async () => {
    Alert.alert(
      'Restore Data',
      'This will replace ALL existing data with data from the backup file. This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            setRestoring(true);
            try {
              const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true,
              });

              if (result.canceled || !result.assets || result.assets.length === 0) {
                setRestoring(false);
                return;
              }

              const fileUri = result.assets[0].uri;
              const content = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.UTF8,
              });

              const data = JSON.parse(content);

              if (!data.version) {
                Alert.alert('Invalid File', 'The selected file is not a valid FPO backup file.');
                setRestoring(false);
                return;
              }

              await importData(data);
              Alert.alert(
                'Restore Complete',
                `Data restored successfully!\n\nRestored:\n• ${data.members?.length || 0} Members\n• ${data.transactions?.length || 0} Transactions\n• ${data.meetings?.length || 0} Meetings`
              );
            } catch (error) {
              if (error instanceof SyntaxError) {
                Alert.alert('Invalid File', 'The backup file is corrupted or not valid JSON.');
              } else {
                Alert.alert('Restore Failed', 'Could not restore data: ' + error.message);
              }
            } finally {
              setRestoring(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Data Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 Current Data</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>{members.length}</Text>
              <Text style={styles.summaryLabel}>Members</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>{transactions.length}</Text>
              <Text style={styles.summaryLabel}>Transactions</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>{meetings.length}</Text>
              <Text style={styles.summaryLabel}>Meetings</Text>
            </View>
          </View>
          {lastBackup && (
            <Text style={styles.lastBackupText}>
              ✅ Last backup: {formatDateTime(lastBackup)}
            </Text>
          )}
        </View>

        {/* Backup */}
        <ActionCard
          emoji="☁️"
          title="Backup Data"
          description="Export all your FPO data (members, transactions, meetings) to a JSON file. Share or save it to Google Drive, WhatsApp, or Email for safekeeping."
          buttonLabel="📤 Create Backup"
          onPress={handleBackup}
          loading={backingUp}
          buttonColor={COLORS.primary}
        />

        {/* Restore */}
        <ActionCard
          emoji="📥"
          title="Restore Data"
          description="Import data from a previously created backup file (.json). WARNING: This will overwrite all existing data."
          buttonLabel="📂 Select Backup File"
          onPress={handleRestore}
          loading={restoring}
          buttonColor="#C62828"
        />

        {/* Help */}
        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>ℹ️ Backup Tips</Text>
          <Text style={styles.helpText}>• Create regular backups before adding new data</Text>
          <Text style={styles.helpText}>• Save backup files to Google Drive or Dropbox</Text>
          <Text style={styles.helpText}>• You can share backups via WhatsApp or Email</Text>
          <Text style={styles.helpText}>• Backup files have .json extension</Text>
          <Text style={styles.helpText}>• Keep at least 3 recent backup copies</Text>
        </View>

        <View style={{ height: 32 }} />
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
  },
  summaryCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.md,
  },
  summaryTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: SIZES.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNum: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  lastBackupText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: SIZES.sm,
    textAlign: 'center',
  },
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardEmoji: {
    fontSize: 40,
    marginBottom: SIZES.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  cardDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SIZES.md,
  },
  cardBtn: {
    borderRadius: 8,
    padding: SIZES.sm,
    alignItems: 'center',
    elevation: 2,
  },
  cardBtnDisabled: {
    opacity: 0.6,
  },
  cardBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  helpCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: SIZES.md,
    borderLeftWidth: 4,
    borderLeftColor: '#1565C0',
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: SIZES.sm,
  },
  helpText: {
    fontSize: 13,
    color: '#1565C0',
    marginBottom: SIZES.xs,
    lineHeight: 20,
  },
});
