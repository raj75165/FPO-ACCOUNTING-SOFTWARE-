# FPO Accounting Software 📊

A complete accounting solution for **Farmer Producer Organizations (FPO)** built with React Native (Expo).

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Overview of income, expenses, net balance, quick actions |
| 💰 **Transactions** | Add income & expense entries with categories, filter & search |
| 👥 **Members** | Manage FPO member records (name, village, shares, Aadhaar) |
| 📅 **Meetings** | Schedule & track meetings (Board, AGM, Training, General Body) |
| 📄 **Reports & Share** | Generate financial reports, share via WhatsApp/Email/Drive |
| 💾 **Backup & Restore** | Export all data as JSON, restore from backup at any time |
| ⚙️ **Settings** | Configure FPO name, registration number, address, contact |

---

## 📱 Screens

- **Dashboard** — Net balance, income/expense summary, quick actions, recent transactions, upcoming meetings
- **Transactions** — Add income/expense with categories (Sales, Grants, Purchase, Salary, etc.), filter by type, search
- **Members** — Add farmer members with phone, village, Aadhaar, shares; search by name/phone/village
- **Meetings** — Schedule meetings with agenda, venue, attendees; separate upcoming/past tabs
- **Reports** — Monthly/yearly breakdown, category-wise charts, share full report or quick summary
- **Backup/Restore** — One-tap JSON export (shareable via any app), import from file to restore

---

## 🏗️ Tech Stack

- **React Native** with **Expo** (~50)
- **React Navigation** (Bottom Tabs + Stack)
- **AsyncStorage** for local data persistence
- **expo-sharing** for sharing reports
- **expo-file-system** for backup file management
- **expo-document-picker** for restoring backup files
- **react-native-paper** for UI components

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your Android/iOS device

### Run on Device
```bash
npm install
npx expo start
# Scan QR code with Expo Go app
```

### Run Tests
```bash
npm test
```

---

## 📦 Build APK

### Using EAS Build (Recommended)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. Build APK:
   ```bash
   npm run build:apk
   # or
   eas build --platform android --profile preview
   ```

3. Download APK from the Expo dashboard after build completes.

### GitHub Actions CI
The repository includes a GitHub Actions workflow (`.github/workflows/build-apk.yml`) that automatically builds the APK on push. Set the `EXPO_TOKEN` secret in your repository settings.

---

## 📂 Project Structure

```
├── App.js                      # App entry point
├── app.json                    # Expo configuration
├── eas.json                    # EAS Build configuration
├── src/
│   ├── context/
│   │   └── AppDataContext.js   # Global state management
│   ├── navigation/
│   │   └── MainNavigator.js    # Tab + Stack navigation
│   ├── screens/
│   │   ├── DashboardScreen.js  # Home dashboard
│   │   ├── TransactionsScreen.js
│   │   ├── AddTransactionScreen.js
│   │   ├── MembersScreen.js
│   │   ├── AddMemberScreen.js
│   │   ├── MeetingsScreen.js
│   │   ├── AddMeetingScreen.js
│   │   ├── ReportsScreen.js    # Reports + Share
│   │   ├── BackupScreen.js     # Backup & Restore
│   │   └── SettingsScreen.js   # FPO settings
│   └── utils/
│       ├── storage.js          # AsyncStorage CRUD operations
│       ├── helpers.js          # Formatting, calculations, report generation
│       └── theme.js            # Colors, fonts, sizes
├── __tests__/
│   ├── helpers.test.js         # Unit tests for helpers
│   └── storage.test.js         # Unit tests for storage
└── .github/workflows/
    └── build-apk.yml           # GitHub Actions APK build
```

---

## 📊 Data Model

### Member
```json
{ "id", "name", "phone", "village", "district", "aadhar", "shares", "bankAccount", "joinedDate", "status" }
```

### Transaction
```json
{ "id", "type" (income/expense), "amount", "category", "description", "date", "createdAt" }
```

### Meeting
```json
{ "id", "title", "meetingType", "date", "time", "venue", "agenda", "attendees", "minutes", "status" }
```

---

## 🔒 Data Storage

All data is stored **locally on the device** using AsyncStorage. No internet connection required for core functionality. Use the Backup & Restore feature to keep your data safe.

---

## 📤 Sharing Reports

Reports can be shared via:
- WhatsApp
- Email
- Google Drive
- Any app that supports text file sharing
