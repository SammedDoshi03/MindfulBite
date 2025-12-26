import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const [notifications, setNotifications] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Settings', headerBackTitle: 'Profile', headerTintColor: Colors.dark.text, headerStyle: { backgroundColor: Colors.dark.background } }} />
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Preferences</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Enable Notifications</Text>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: '#767577', true: Colors.dark.primary }}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Dark Mode</Text>
                    <Switch
                        value={darkMode}
                        onValueChange={setDarkMode}
                        trackColor={{ false: '#767577', true: Colors.dark.primary }}
                    />
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>App Version 1.0.0</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    content: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 24,
        fontFamily: 'InterBold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        backgroundColor: Colors.dark.card,
        padding: 16,
        borderRadius: 16,
    },
    label: {
        fontSize: 16,
        color: Colors.dark.text,
        fontFamily: 'Inter',
    },
    infoBox: {
        marginTop: 40,
        alignItems: 'center',
    },
    infoText: {
        color: Colors.dark.tabIconDefault,
        fontSize: 14,
        fontFamily: 'Inter',
    },
});
