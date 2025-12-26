
import Colors from '@/constants/Colors';
import { useAppSelector } from '@/store/hooks';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AchievementsScreen() {
    const router = useRouter();
    const { meals } = useAppSelector((state) => state.log);
    const { intake, goal: waterGoal } = useAppSelector((state) => state.water);
    const { user } = useAppSelector((state) => state.auth);

    // Calculate Progress
    const totalMeals = meals.length;
    const waterGoalMet = intake >= waterGoal;

    // Check Profile Completion
    const profileComplete = user && user.name && user.age && user.weight && user.height && user.goal;

    // Badges Logic
    const badges = [
        {
            id: 1,
            name: 'First Bite',
            icon: 'restaurant',
            unlocked: totalMeals >= 1,
            desc: 'Logged your first meal'
        },
        {
            id: 2,
            name: 'Hydration Hero',
            icon: 'water',
            unlocked: waterGoalMet,
            desc: 'Hit your daily water goal'
        },
        {
            id: 3,
            name: 'Dedicated Logger',
            icon: 'flame',
            unlocked: totalMeals >= 5,
            desc: 'Logged 5 or more items'
        },
        {
            id: 4,
            name: 'Profile Perfect',
            icon: 'person-circle',
            unlocked: !!profileComplete,
            desc: 'Completed all profile details'
        },
        {
            id: 5,
            name: 'Protein Power',
            icon: 'barbell',
            unlocked: meals.some(m => m.protein > 30),
            desc: 'Logged a meal with 30g+ protein'
        },
        {
            id: 6,
            name: 'Snack Smart',
            icon: 'leaf',
            unlocked: meals.some(m => m.calories < 200),
            desc: 'Logged a low-cal snack (<200kcal)'
        },
    ];

    const unlockedCount = badges.filter(b => b.unlocked).length;

    // XP Calculation Strategy
    // Base: 100 XP per badge
    // Meal Bonus: 10 XP per meal
    const currentXP = (unlockedCount * 100) + (totalMeals * 10);
    const level = Math.floor(currentXP / 500) + 1;
    const nextLevelXP = level * 500;
    const progress = (currentXP % 500) / 500;

    const renderProgressBar = () => (
        <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
            </View>
            <Text style={styles.xpText}>{currentXP} / {nextLevelXP} XP</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>

                {/* Header Actions */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#111811" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Achievements</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Level Card */}
                <View style={styles.levelCard}>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelNum}>{level}</Text>
                        <Text style={styles.levelLabel}>LEVEL</Text>
                    </View>
                    <View style={styles.levelInfo}>
                        <Text style={styles.levelTitle}>Health Novice</Text>
                        <Text style={styles.levelSubtitle}>
                            {unlockedCount} / {badges.length} Badges Unlocked
                        </Text>
                        {renderProgressBar()}
                    </View>
                </View>

                {/* Badges Grid */}
                <Text style={styles.sectionTitle}>Badges</Text>
                <View style={styles.grid}>
                    {badges.map((badge) => (
                        <View key={badge.id} style={[styles.badgeCard, !badge.unlocked && styles.badgeLocked]}>
                            <View style={[styles.badgeIcon, !badge.unlocked && styles.badgeIconLocked]}>
                                <Ionicons
                                    name={badge.icon as any}
                                    size={32}
                                    color={badge.unlocked ? '#064E3B' : '#9CA3AF'}
                                />
                                {badge.unlocked && (
                                    <View style={styles.checkBadge}>
                                        <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                                    </View>
                                )}
                            </View>
                            <Text style={styles.badgeName}>{badge.name}</Text>
                            <Text style={styles.badgeDesc}>{badge.desc}</Text>
                        </View>
                    ))}
                </View>

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
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    backBtn: {
        padding: 8,
        marginLeft: -8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
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
    levelCard: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.primary, // Using primary color for impact
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    levelBadge: {
        width: 64,
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    levelNum: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'InterBold',
        lineHeight: 36,
    },
    levelLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 1,
    },
    levelInfo: {
        flex: 1,
    },
    levelTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'InterBold',
        marginBottom: 4,
    },
    levelSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'Inter',
        marginBottom: 12,
    },
    progressContainer: {
        width: '100%',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 3,
        marginBottom: 4,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
    },
    xpText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'right',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111811',
        marginBottom: 16,
        fontFamily: 'InterBold',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
    },
    badgeCard: {
        width: '47%', // roughly half minus gap
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    badgeLocked: {
        opacity: 0.7,
        backgroundColor: '#F9FAFB',
        borderStyle: 'dashed',
    },
    badgeIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#ecfccb', // Lime 100 equivalent or sage light
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        position: 'relative',
    },
    badgeIconLocked: {
        backgroundColor: '#E5E7EB',
    },
    checkBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.dark.primary,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    badgeName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111811',
        textAlign: 'center',
        marginBottom: 4,
        fontFamily: 'InterSemiBold',
    },
    badgeDesc: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 16,
    },
});
