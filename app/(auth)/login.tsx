
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import Colors from '@/constants/Colors';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const [isLogin, setIsLogin] = useState(false); // Default: Sign Up
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleAuth = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            const user = {
                id: '123',
                name: name || 'User',
                email: email,
            };
            dispatch(setUser(user));

            // Navigate based on flow
            if (isLogin) {
                router.replace('/(tabs)');
            } else {
                router.replace('/(onboarding)/personalize');
            }
        }, 1200);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                        {/* Header Branding */}
                        <View style={styles.header}>
                            <View style={styles.iconContainer}>
                                <Image source={require('@/assets/images/mindfulbite-icon.png')} style={styles.logoIcon} />
                            </View>
                            <Text style={styles.title}>MindfulBite</Text>
                        </View>

                        {/* Segmented Control */}
                        <View style={styles.segmentContainer}>
                            <TouchableOpacity
                                style={[styles.segmentButton, !isLogin && styles.activeSegment]}
                                onPress={() => setIsLogin(false)}
                            >
                                <Text style={[styles.segmentText, !isLogin && styles.activeSegmentText]}>Sign Up</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.segmentButton, isLogin && styles.activeSegment]}
                                onPress={() => setIsLogin(true)}
                            >
                                <Text style={[styles.segmentText, isLogin && styles.activeSegmentText]}>Log In</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Form Fields */}
                        <View style={styles.form}>
                            {!isLogin && (
                                <Input
                                    label="Full Name"
                                    placeholder="John Doe"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                    leftIcon="person-outline"
                                />
                            )}
                            <Input
                                label="Email Address"
                                placeholder="hello@example.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                leftIcon="mail-outline"
                            />
                            <Input
                                label="Password"
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                leftIcon="lock-closed-outline"
                            />

                            {isLogin && (
                                <TouchableOpacity style={styles.forgotPassword}>
                                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                </TouchableOpacity>
                            )}

                            <Button
                                title={isLogin ? 'Log In' : 'Create Account'}
                                onPress={handleAuth}
                                isLoading={isLoading}
                                style={styles.submitButton}
                                disabled={!email || !password || (!isLogin && !name)}
                                size="lg"
                            />
                        </View>

                        {/* Social Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>Or continue with</Text>
                            <View style={styles.line} />
                        </View>

                        {/* Social Buttons */}
                        <View style={styles.socialContainer}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Ionicons name="logo-google" size={24} color="#DB4437" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Ionicons name="logo-apple" size={24} color="#000000" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.termsText}>
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </Text>

                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollContent: {
        padding: 24,
        flexGrow: 1,
    },
    header: {
        alignItems: 'center',
        marginVertical: 32,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: Colors.light.card, // Light surface
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    logoIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111811',
        fontFamily: 'InterBold',
        letterSpacing: -0.5,
    },
    segmentContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        padding: 4,
        marginBottom: 32,
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    activeSegment: {
        backgroundColor: '#FFFFFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        fontFamily: 'InterSemiBold',
    },
    activeSegmentText: {
        color: '#111811',
    },
    form: {
        marginBottom: 24,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: Colors.dark.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    submitButton: {
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#9CA3AF',
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 32,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    termsText: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 12,
        marginTop: 'auto',
    },
});
