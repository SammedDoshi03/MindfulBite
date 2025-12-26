import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Configure Notifications Behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export default function NotificationsSettingsScreen() {
    const router = useRouter();

    // State
    const [settings, setSettings] = useState({
        mealReminders: false,
        waterReminders: false,
        weighInReminder: false,
        proTips: false,
    });

    const [times, setTimes] = useState<{ [key: string]: Date }>({
        breakfastTime: new Date(new Date().setHours(8, 0, 0, 0)),
        lunchTime: new Date(new Date().setHours(13, 0, 0, 0)),
        dinnerTime: new Date(new Date().setHours(19, 0, 0, 0)),
    });

    // Time Picker State
    const [showPicker, setShowPicker] = useState(false);
    const [activeTimeKey, setActiveTimeKey] = useState<string | null>(null);

    // Request Permissions on Mount
    useEffect(() => {
        (async () => {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                // We don't auto-request here to avoid annoying user immediately,
                // we request when they try to enable a toggle.
            }
        })();
    }, []);

    const requestPermissions = async () => {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            return status === 'granted';
        } catch (e) {
            console.warn("Permission request failed:", e);
            Alert.alert("Notice", "Notifications are not supported on this device/emulator configuration.");
            return false;
        }
    };

    // Configure Notification Channel for Android
    useEffect(() => {
        if (Platform.OS === 'android') {
            (async () => {
                try {
                    await Notifications.setNotificationChannelAsync('default', {
                        name: 'default',
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: '#FF231F7C',
                    });
                } catch (e) {
                    console.warn("Failed to set notification channel (likely Expo Go issue):", e);
                }
            })();
        }
    }, []);

    const scheduleNotification = async (title: string, body: string, trigger: Notifications.NotificationTriggerInput) => {
        try {
            await Notifications.scheduleNotificationAsync({
                content: { title, body },
                trigger,
            });
        } catch (e) {
            console.error("Error scheduling notification", e);
        }
    };

    const updateNotifications = async () => {
        // Cancel all first for simplicity in this demo
        await Notifications.cancelAllScheduledNotificationsAsync();

        if (settings.mealReminders) {
            const { breakfastTime, lunchTime, dinnerTime } = times;

            // Schedule Breakfast
            scheduleNotification("Breakfast Time!", "Don't forget to log your breakfast 🍳", {
                type: 'calendar', hour: breakfastTime.getHours(), minute: breakfastTime.getMinutes(), repeats: true
            });
            // Schedule Lunch
            scheduleNotification("Lunch Time!", "What's for lunch today? 🥗", {
                type: 'calendar', hour: lunchTime.getHours(), minute: lunchTime.getMinutes(), repeats: true
            });
            // Schedule Dinner
            scheduleNotification("Dinner Time!", "Time to log your dinner 🍽️", {
                type: 'calendar', hour: dinnerTime.getHours(), minute: dinnerTime.getMinutes(), repeats: true
            });
        }

        if (settings.waterReminders) {
            // Schedule repeating water reminder every 3 hours between 9am and 8pm.
            for (let i = 9; i <= 20; i += 3) {
                scheduleNotification("Hydration Check", "Time to drink some water! 💧", {
                    type: 'calendar', hour: i, minute: 0, repeats: true
                });
            }
        }
    };

    // Re-schedule whenever settings or times change
    useEffect(() => {
        updateNotifications();
    }, [settings, times]);


    const toggleSwitch = async (key: keyof typeof settings) => {
        if (!settings[key]) {
            // Turning ON
            const hasPermission = await requestPermissions();
            if (!hasPermission) {
                Alert.alert("Permission Required", "Please enable notifications in your phone settings to use this feature.");
                return;
            }
        }
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const onTimeChange = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate && activeTimeKey) {
            setTimes(prev => ({ ...prev, [activeTimeKey]: selectedDate }));
        }
        setActiveTimeKey(null);
    };

    const openTimePicker = (key: string) => {
        setActiveTimeKey(key);
        setShowPicker(true);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderToggleItem = (title: string, desc: string, key: keyof typeof settings) => (
        <View style={styles.itemRow}>
            <View style={{ flex: 1, paddingRight: 16 }}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text style={styles.itemDesc}>{desc}</Text>
            </View>
            <Switch
                trackColor={{ false: '#E5E7EB', true: Colors.dark.primary }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor="#E5E7EB"
                onValueChange={() => toggleSwitch(key)}
                value={settings[key]}
            />
        </View>
    );

    const renderTimeItem = (title: string, timeKey: string) => (
        <TouchableOpacity style={styles.itemRow} activeOpacity={0.7} onPress={() => openTimePicker(timeKey)}>
            <Text style={styles.itemTitle}>{title}</Text>
            <View style={styles.timeValueContainer}>
                <Text style={styles.timeValue}>{formatTime(times[timeKey])}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111811" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <Text style={styles.sectionHeader}>Meal Reminders</Text>
                <View style={styles.card}>
                    {renderToggleItem('Daily Reminders', 'Get notified to log your meals.', 'mealReminders')}
                    {settings.mealReminders && (
                        <>
                            <View style={styles.divider} />
                            {renderTimeItem('Breakfast', 'breakfastTime')}
                            <View style={styles.divider} />
                            {renderTimeItem('Lunch', 'lunchTime')}
                            <View style={styles.divider} />
                            {renderTimeItem('Dinner', 'dinnerTime')}
                        </>
                    )}
                </View>

                <Text style={styles.sectionHeader}>Health Habits</Text>
                <View style={styles.card}>
                    {renderToggleItem('Hydration Alerts', 'Reminders to drink water every 3 hours.', 'waterReminders')}
                    <View style={styles.divider} />
                    {renderToggleItem('Weekly Weigh-In', 'Reminder to track your weight every Monday.', 'weighInReminder')}
                </View>

                <Text style={styles.sectionHeader}>General</Text>
                <View style={styles.card}>
                    {renderToggleItem('Tips & Insights', 'Receive personalized nutrition tips.', 'proTips')}
                </View>

            </ScrollView>

            {showPicker && (
                <DateTimePicker
                    value={activeTimeKey ? times[activeTimeKey] : new Date()}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onTimeChange}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backBtn: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111811',
        fontFamily: 'InterBold',
    },
    content: {
        padding: 24,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 12,
        marginTop: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontFamily: 'InterSemiBold',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 8,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111811',
        fontFamily: 'InterSemiBold',
    },
    itemDesc: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 4,
        fontFamily: 'Inter',
        lineHeight: 18,
    },
    timeValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    timeValue: {
        fontSize: 16,
        color: Colors.dark.primary, // Or gray? Primary indicates clickable/active.
        fontFamily: 'InterSemiBold',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 16,
    },
});
