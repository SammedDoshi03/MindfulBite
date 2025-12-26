import Colors from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addWater, setWaterState, updateDate } from '@/store/slices/waterSlice';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function WaterTrackerScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Redux State
    const { intake, goal, date } = useAppSelector((state: any) => state.water);

    // Persistence & Daily Reset Logic
    React.useEffect(() => {
        const load = async () => {
            try {
                // 1. Get today's date string
                const today = new Date().toISOString().split('T')[0];

                // 2. Load saved state
                const saved = await AsyncStorage.getItem('water_state');

                if (saved) {
                    const parsed = JSON.parse(saved);

                    if (parsed.date !== today) {
                        // NEW DAY: Archive old data and reset
                        await AsyncStorage.setItem('water_history_' + parsed.date, JSON.stringify(parsed));
                        // Dispatch update to new day (resets intake to 0)
                        dispatch(updateDate(today));
                    } else {
                        // SAME DAY: Hydrate Redux
                        dispatch(setWaterState(parsed));
                    }
                } else {
                    // No save found, just ensure date is right
                    dispatch(updateDate(today));
                }
            } catch (e) {
                console.error("Failed to load water state", e);
            }
        };
        load();
    }, []);

    // Save on Change
    React.useEffect(() => {
        const save = async () => {
            await AsyncStorage.setItem('water_state', JSON.stringify({ intake, goal, date }));
        };
        save();
    }, [intake, goal, date]);


    // Calculate fill percentage (clamped 0-1)
    const percentage = goal > 0 ? Math.min(Math.max(intake / goal, 0), 1) : 0;

    // ... existing UI code ...

    const handleAddWater = (amount: number) => {
        dispatch(addWater(amount));
    };

    const [historyVisible, setHistoryVisible] = React.useState(false);

    // Mock History Data (Ideally load from Async Storage properly)
    // For now we keep the mock for visual demonstration as full history loading is complex for this step
    const history = [
        { date: 'Today', amount: intake, goal: goal, achieved: intake >= goal },
        // ... mocks
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111811" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hydration</Text>
                <TouchableOpacity style={styles.historyBtn} onPress={() => setHistoryVisible(true)}>
                    <Ionicons name="time-outline" size={24} color={Colors.dark.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Visualization */}
                <View style={styles.visualContainer}>
                    <Text style={styles.percentageText}>{Math.round(percentage * 100)}%</Text>
                    <Text style={styles.goalText}>{intake} / {goal} ml</Text>

                    <View style={styles.cupContainer}>
                        {/* Cup Outline */}
                        <View style={styles.cupOutline}>
                            <View style={[styles.cupFill, { height: `${percentage * 100}%` } as ViewStyle]} />
                        </View>
                        {/* Highlights/Reflection */}
                        <View style={styles.reflection} />
                    </View>
                </View>

                {/* Quick Add Buttons */}
                <View style={styles.controlsContainer}>
                    <Text style={styles.sectionTitle}>Quick Add</Text>
                    <View style={styles.buttonGrid}>
                        <TouchableOpacity style={styles.addButton} onPress={() => handleAddWater(250)}>
                            <Ionicons name="water-outline" size={24} color="#0EA5E9" />
                            <Text style={styles.addText}>250ml</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addButton} onPress={() => handleAddWater(500)}>
                            <Ionicons name="beer-outline" size={24} color="#0EA5E9" />
                            <Text style={styles.addText}>500ml</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addButton} onPress={() => handleAddWater(750)}>
                            <Ionicons name="flask-outline" size={24} color="#0EA5E9" />
                            <Text style={styles.addText}>750ml</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* History Modal */}
            {historyVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Hydration History</Text>
                            <TouchableOpacity onPress={() => setHistoryVisible(false)}>
                                <Ionicons name="close" size={24} color="#111811" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{ maxHeight: 300 }}>
                            {history.map((item, index) => (
                                <View key={index} style={styles.historyRow}>
                                    <View>
                                        <Text style={styles.historyDate}>{item.date}</Text>
                                        <Text style={styles.historyAmount}>{item.amount} / {item.goal} ml</Text>
                                    </View>
                                    {item.achieved && (
                                        <Ionicons name="checkmark-circle" size={24} color={Colors.dark.primary} />
                                    )}
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F9FF', // Very light blue bg
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
    },
    backBtn: {
        padding: 8,
        marginLeft: -8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111811',
        fontFamily: 'InterBold',
    },
    historyBtn: {
        padding: 8,
        backgroundColor: '#F0FDF4',
        borderRadius: 12,
    },

    // Modal
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111811',
    },
    historyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    historyDate: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111811',
    },
    historyAmount: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 48,
    },
    visualContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 60,
    },
    percentageText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#0EA5E9', // Sky 500
        marginBottom: 8,
        fontFamily: 'InterBold',
    },
    goalText: {
        fontSize: 16,
        color: '#64748B',
        marginBottom: 32,
        fontFamily: 'InterSemiBold',
    },
    cupContainer: {
        width: 140,
        height: 200,
        position: 'relative',
    },
    cupOutline: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 4,
        borderColor: '#E0F2FE', // Sky 100
        overflow: 'hidden',
        justifyContent: 'flex-end', // Fill from bottom
        shadowColor: "#0EA5E9",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    cupFill: {
        width: '100%',
        backgroundColor: '#38BDF8', // Sky 400
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    reflection: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 10,
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111811',
        marginBottom: 16,
        fontFamily: 'InterBold',
    },
    controlsContainer: {
        marginBottom: 32,
    },
    buttonGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    addButton: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#0EA5E9",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        gap: 8,
    },
    addText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111811',
        fontFamily: 'InterSemiBold',
    },
});
