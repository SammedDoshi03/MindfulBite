
import { Button } from '@/components/Button';
import Colors from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';

import { useLocalSearchParams } from 'expo-router';

export default function GoalsScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const params = useLocalSearchParams();
    const isEditMode = params.mode === 'edit';

    const user = useAppSelector((state) => state.auth.user);

    // Initial State - Prefer existing target if available
    const [calories, setCalories] = useState(user?.calorieTarget || 2000);
    // Approximate macros from target if exists, else defaults
    const [protein, setProtein] = useState(Math.round((calories * 0.3) / 4));
    const [carbs, setCarbs] = useState(Math.round((calories * 0.4) / 4));
    const [fat, setFat] = useState(Math.round((calories * 0.3) / 9));

    // Auto-Calculate BMR & TDEE on Mount ONLY if new user (no target set)
    useEffect(() => {
        if (!user?.calorieTarget && user && user.weight && user.height && user.age && user.gender) {
            // Mifflin-St Jeor Equation
            let bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age);
            bmr += user.gender === 'Male' ? 5 : -161;

            // Activity Multiplier (Assuming Sedentary/Light Active 1.375 for now as a baseline)
            let tdee = bmr * 1.375;

            // Goal Adjustment
            if (user.goal === 'lose') tdee -= 500;
            if (user.goal === 'gain') tdee += 500;

            const target = Math.round(tdee);
            setCalories(target);

            // Default Macro Split (30% P / 40% C / 30% F)
            setProtein(Math.round((target * 0.3) / 4));
            setCarbs(Math.round((target * 0.4) / 4));
            setFat(Math.round((target * 0.3) / 9));
        }
    }, [user]);

    // Recalculate total if macros change manually
    const totalMacroCalories = (protein * 4) + (carbs * 4) + (fat * 9);

    useEffect(() => {
        // Only update total if the variance is significant (prevents loops on small rounding)
        if (Math.abs(totalMacroCalories - calories) > 50) {
            setCalories(Math.round(totalMacroCalories / 10) * 10);
        }
    }, [protein, carbs, fat]);

    const handleContinue = () => {
        dispatch(updateUser({
            calorieTarget: calories,
        }));

        if (isEditMode) {
            router.back();
        } else {
            router.push('/(onboarding)/permissions');
        }
    };

    // Donut Chart Calculations
    const radius = 70;
    const circumference = 2 * Math.PI * radius;

    const pCal = protein * 4;
    const cCal = carbs * 4;
    const fCal = fat * 9;
    const total = pCal + cCal + fCal || 1;

    const pPct = pCal / total;
    const cPct = cCal / total;
    const fPct = fCal / total;

    const pStroke = pPct * circumference;
    const cStroke = cPct * circumference;
    const fStroke = fPct * circumference;

    const renderMacroCard = (label: string, value: number, unit: string, setter: (v: number) => void, color: string, pct: number) => (
        <View style={styles.macroRow}>
            <View style={[styles.indicator, { backgroundColor: color }]} />
            <View style={{ flex: 1 }}>
                <Text style={styles.macroLabel}>{label} <Text style={styles.macroPct}>({Math.round(pct * 100)}%)</Text></Text>
                <Text style={styles.macroValue}>{value}{unit}</Text>
            </View>
            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => setter(Math.max(0, value - 5))}
                >
                    <Ionicons name="remove" size={20} color={Colors.dark.text} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => setter(value + 5)}
                >
                    <Ionicons name="add" size={20} color={Colors.dark.text} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.dark.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Adjust Your Goals</Text>
                    <Text style={styles.subtitle}>Fine-tune your daily nutrition targets.</Text>
                </View>

                {/* Donut Chart Section */}
                <View style={styles.chartContainer}>
                    <View style={styles.chartWrapper}>
                        <Svg height="180" width="180" viewBox="0 0 180 180">
                            <G rotation="-90" origin="90, 90">
                                {/* Background Circle */}
                                <Circle
                                    cx="90"
                                    cy="90"
                                    r={radius}
                                    stroke="#374151"
                                    strokeWidth="20"
                                    fill="transparent"
                                />
                                {/* Protein Segment */}
                                <Circle
                                    cx="90"
                                    cy="90"
                                    r={radius}
                                    stroke={Colors.dark.primary}
                                    strokeWidth="20"
                                    fill="transparent"
                                    strokeDasharray={`${pStroke} ${circumference}`}
                                    strokeDashoffset={0}
                                    strokeLinecap="round"
                                />
                                {/* Carbs Segment */}
                                <Circle
                                    cx="90"
                                    cy="90"
                                    r={radius}
                                    stroke="#F59E0B" // Amber 500
                                    strokeWidth="20"
                                    fill="transparent"
                                    strokeDasharray={`${cStroke} ${circumference}`}
                                    strokeDashoffset={-pStroke}
                                    strokeLinecap="round"
                                />
                                {/* Fat Segment */}
                                <Circle
                                    cx="90"
                                    cy="90"
                                    r={radius}
                                    stroke="#EF4444" // Red 500
                                    strokeWidth="20"
                                    fill="transparent"
                                    strokeDasharray={`${fStroke} ${circumference}`}
                                    strokeDashoffset={-(pStroke + cStroke)}
                                    strokeLinecap="round"
                                />
                            </G>
                        </Svg>
                        <View style={styles.centeredText}>
                            <Text style={styles.totalCalVal}>{calories}</Text>
                            <Text style={styles.totalCalLabel}>kcal</Text>
                        </View>
                    </View>
                </View>

                {/* Macros Controls */}
                <View style={styles.macrosContainer}>
                    {renderMacroCard('Protein', protein, 'g', setProtein, Colors.dark.primary, pPct)}
                    <View style={styles.divider} />
                    {renderMacroCard('Carbs', carbs, 'g', setCarbs, '#F59E0B', cPct)}
                    <View style={styles.divider} />
                    {renderMacroCard('Fat', fat, 'g', setFat, '#EF4444', fPct)}
                </View>

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={20} color="#9CA3AF" style={{ marginTop: 2 }} />
                    <Text style={styles.infoText}>
                        We've calculated these based on your profile. You can adjust them anytime in settings.
                    </Text>
                </View>

                <Button
                    title={isEditMode ? "Save Changes" : "Complete Setup"}
                    onPress={handleContinue}
                    size="lg"
                    style={styles.button}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    content: {
        padding: 24,
        paddingBottom: 48,
    },
    header: {
        marginBottom: 32,
    },
    backButton: {
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111811',
        fontFamily: 'InterBold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        fontFamily: 'Inter',
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    chartWrapper: {
        position: 'relative',
        width: 180,
        height: 180,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centeredText: {
        position: 'absolute',
        alignItems: 'center',
    },
    totalCalVal: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111811',
        fontFamily: 'InterBold',
    },
    totalCalLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'InterSemiBold',
    },
    macrosContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 8,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    macroRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    indicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 16,
    },
    macroLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Inter',
        marginBottom: 4,
    },
    macroPct: {
        color: '#9CA3AF',
        fontSize: 12,
    },
    macroValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111811',
        fontFamily: 'InterSemiBold',
    },
    controls: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    controlBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 16,
    },
    infoBox: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
        paddingHorizontal: 8,
    },
    infoText: {
        flex: 1,
        color: '#9CA3AF',
        fontSize: 13,
        lineHeight: 20,
        fontFamily: 'Inter',
    },
    button: {
        marginBottom: 24,
    },
});
