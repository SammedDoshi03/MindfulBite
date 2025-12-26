
import { Button } from '@/components/Button';
import Colors from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        router.replace('/');
    };

    const renderMenuItem = (icon: keyof typeof Ionicons.glyphMap, title: string, subtitle: string, route: string, color: string = Colors.dark.primary) => (
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push(route as any)}>
            <View style={[styles.menuIcon, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{title}</Text>
                {subtitle ? <Text style={styles.menuSubtitle}>{subtitle}</Text> : null}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>

                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'U'}</Text>
                        <TouchableOpacity style={styles.editBadge} onPress={() => router.push('/(onboarding)/personalize')}>
                            <Ionicons name="pencil" size={12} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.name}>{user?.name || 'User Name'}</Text>
                    <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{user?.age || '-'}</Text>
                            <Text style={styles.statLabel}>Age</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{user?.weight || '-'}kg</Text>
                            <Text style={styles.statLabel}>Weight</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{user?.height || '-'}cm</Text>
                            <Text style={styles.statLabel}>Height</Text>
                        </View>
                    </View>
                </View>

                {/* My Health */}
                <Text style={styles.sectionTitle}>My Health</Text>
                <View style={styles.sectionCard}>
                    {renderMenuItem('body', 'Personal Details', 'Update your body stats', '/(onboarding)/personalize', '#0EA5E9')}
                    <View style={styles.divider} />
                    {renderMenuItem('locate', 'Diet & Goals', 'Calorie & macro targets', '/(onboarding)/goals?mode=edit', '#8B5CF6')}
                    <View style={styles.divider} />
                    {renderMenuItem('water', 'Hydration', 'Track water intake', '/water-tracker', '#06B6D4')}
                    <View style={styles.divider} />
                    {renderMenuItem('trophy', 'Achievements', 'View your progress', '/achievements', '#F59E0B')}
                </View>

                {/* Preferences */}
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.sectionCard}>
                    {renderMenuItem('notifications', 'Notifications', 'Reminders & Alerts', '/notifications-settings', '#EF4444')}
                    <View style={styles.divider} />
                    {renderMenuItem('help-circle', 'Help & Support', 'FAQs & Contact', '/help', '#10B981')}
                </View>

                <Button
                    title="Log Out"
                    onPress={handleLogout}
                    variant="ghost"
                    style={styles.logoutBtn}
                    textStyle={{ color: '#EF4444' }}
                />

                <Text style={styles.version}>Version 1.0.0</Text>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    content: {
        padding: 24,
        paddingBottom: 48,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: Colors.dark.primary,
        fontFamily: 'InterBold',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.dark.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111811',
        marginBottom: 4,
        fontFamily: 'InterBold',
    },
    email: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 24,
        fontFamily: 'Inter',
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        width: '100%',
        justifyContent: 'space-around',
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111811',
        marginBottom: 4,
        fontFamily: 'InterBold',
    },
    statLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'Inter',
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: '#F3F4F6',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111811',
        marginBottom: 12,
        fontFamily: 'InterBold',
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 8,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuText: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111811',
        marginBottom: 2,
        fontFamily: 'InterSemiBold',
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'Inter',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 68, // Align with text
    },
    logoutBtn: {
        marginTop: 8,
    },
    version: {
        textAlign: 'center',
        color: '#D1D5DB',
        fontSize: 12,
        marginTop: 16,
        fontFamily: 'Inter',
    },
});
