
import { Button } from '@/components/Button';
import Colors from '@/constants/Colors';
import { useAppDispatch } from '@/store/hooks';
import { completeOnboarding } from '@/store/slices/authSlice';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PermissionsScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Camera Permission (Real)
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();

    // Notifications Permission (Mocked for now as package not installed)
    const [notifGranted, setNotifGranted] = useState(false);

    const handleComplete = async () => {
        // Just proceed, permissions are optional-ish or handled
        dispatch(completeOnboarding());
        router.replace('/(tabs)');
    };

    const toggleNotifications = () => {
        setNotifGranted(!notifGranted);
        // Here we would call requestPermissionsAsync() from expo-notifications
    };

    const renderPermissionCard = (
        icon: keyof typeof Ionicons.glyphMap,
        iconColor: string,
        title: string,
        desc: string,
        isGranted: boolean,
        onPress: () => void
    ) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: isGranted ? '#F0FDF4' : '#F3F4F6' }]}>
                    <Ionicons
                        name={icon}
                        size={28}
                        color={isGranted ? Colors.dark.primary : '#9CA3AF'}
                    />
                </View>
                <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardStatus}>{isGranted ? 'Enabled' : 'Not Enabled'}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.toggleBtn, isGranted && styles.toggleBtnActive]}
                    onPress={onPress}
                >
                    <Text style={[styles.toggleBtnText, isGranted && styles.toggleBtnTextActive]}>
                        {isGranted ? 'On' : 'Enable'}
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.cardDesc}>{desc}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#111811" />
                    </TouchableOpacity>
                    <Text style={styles.stepText}>Step 3 of 3</Text>
                </View>

                <View style={styles.main}>
                    <Text style={styles.title}>Enable Access</Text>
                    <Text style={styles.subtitle}>
                        To get the most out of MindfulBite, we need access to a few features.
                    </Text>

                    <View style={styles.cardsContainer}>
                        {/* Camera Card */}
                        {renderPermissionCard(
                            'camera',
                            Colors.dark.primary,
                            'Camera',
                            'Required to analyze your food photos instantly with AI.',
                            cameraPermission?.granted || false,
                            requestCameraPermission
                        )}

                        {/* Notifications Card */}
                        {renderPermissionCard(
                            'notifications',
                            Colors.dark.secondary,
                            'Notifications',
                            'Stay consistent with meal and water remainders.',
                            notifGranted,
                            toggleNotifications
                        )}
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.policyContainer}>
                        <Ionicons name="shield-checkmark-outline" size={16} color={Colors.dark.primary} />
                        <Text style={styles.policyText}>We prioritize your privacy. Your data is secure.</Text>
                    </View>
                    <Button
                        title="Start Tracking"
                        onPress={handleComplete}
                        size="lg"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    stepText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.primary,
        fontFamily: 'InterSemiBold',
    },
    main: {
        flex: 1,
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
        lineHeight: 24,
        marginBottom: 40,
    },
    cardsContainer: {
        gap: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111811',
        fontFamily: 'InterBold',
    },
    cardStatus: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    toggleBtn: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    toggleBtnActive: {
        backgroundColor: Colors.dark.primary,
    },
    toggleBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4B5563',
    },
    toggleBtnTextActive: {
        color: '#111811',
    },
    cardDesc: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        fontFamily: 'Inter',
    },
    footer: {
        marginBottom: 24,
    },
    policyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24,
        backgroundColor: '#F0FDF4',
        padding: 12,
        borderRadius: 12,
    },
    policyText: {
        fontSize: 12,
        color: '#064E3B',
        fontFamily: 'InterSemiBold',
    },
});
