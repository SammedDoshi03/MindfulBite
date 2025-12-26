
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import Colors from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

export default function PersonalizeScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    // State
    const [image, setImage] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | null>(null);
    const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain' | null>(null);

    // Pre-fill data if available
    React.useEffect(() => {
        if (user) {
            if (user.name) setName(user.name);
            if (user.height) setHeight(user.height.toString());
            if (user.weight) setWeight(user.weight.toString());
            if (user.age) setAge(user.age.toString());
            if (user.gender && ['Male', 'Female', 'Other'].includes(user.gender)) setGender(user.gender as any);
            if (user.goal && ['lose', 'maintain', 'gain'].includes(user.goal)) setGoal(user.goal as any);
            if (user.photoUri) setImage(user.photoUri);
        }
    }, [user]);

    // Unit Toggles state
    const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
    const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleContinue = () => {
        dispatch(updateUser({
            name,
            height: parseFloat(height),
            weight: parseFloat(weight),
            age: parseInt(age),
            gender: gender || 'Other',
            goal: goal || 'maintain',
            photoUri: image || undefined,
        }));
        router.push('/(onboarding)/goals');
    };

    const isFormValid = name && height && weight && age && gender && goal;

    // ... (renderGenderOption and renderGoalOption helpers remain the same)

    const renderGenderOption = (label: string, value: 'Male' | 'Female', iconName: keyof typeof Ionicons.glyphMap) => (
        <TouchableOpacity
            style={[
                styles.genderOption,
                gender === value && styles.optionSelected,
            ]}
            onPress={() => setGender(value)}
        >
            <Ionicons
                name={iconName}
                size={24}
                color={gender === value ? Colors.dark.primary : '#6B7280'}
            />
            <Text style={[
                styles.genderText,
                gender === value && styles.optionTextSelected
            ]}>{label}</Text>
        </TouchableOpacity>
    );

    const renderGoalOption = (label: string, value: 'lose' | 'maintain' | 'gain', desc: string, icon: keyof typeof Ionicons.glyphMap) => (
        <TouchableOpacity
            style={[
                styles.goalOption,
                goal === value && styles.optionSelected,
            ]}
            onPress={() => setGoal(value)}
            activeOpacity={0.7}
        >
            <View style={[styles.goalIconContainer, goal === value && styles.goalIconContainerSelected]}>
                <Ionicons name={icon} size={24} color={goal === value ? '#FFFFFF' : Colors.dark.primary} />
            </View>
            <View style={styles.goalTextContainer}>
                <Text style={[styles.goalTitle, goal === value && styles.optionTextSelected]}>{label}</Text>
                <Text style={styles.goalDesc}>{desc}</Text>
            </View>
            {goal === value && (
                <View style={styles.checkIcon}>
                    <Ionicons name="checkmark-circle" size={24} color={Colors.dark.primary} />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#111811" />
                        </TouchableOpacity>
                        <Text style={styles.stepText}>Step 1 of 3</Text>
                    </View>

                    <Text style={styles.title}>Tell us about yourself</Text>
                    <Text style={styles.subtitle}>To calculate your personalized calorie and macro goals, we need a few details.</Text>

                    {/* Photo Upload Section */}
                    <View style={{ alignItems: 'center', marginBottom: 32 }}>
                        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.profileImage} />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <Ionicons name="camera" size={32} color="#9CA3AF" />
                                    <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                                </View>
                            )}
                            <View style={styles.editBadge}>
                                <Ionicons name="pencil" size={12} color="#FFFFFF" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Goal Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>What is your main goal?</Text>
                        {renderGoalOption('Lose Weight', 'lose', 'Burn fat & get lean', 'trending-down')}
                        {renderGoalOption('Maintain', 'maintain', 'Stay healthy & fit', 'bicycle')}
                        {renderGoalOption('Build Muscle', 'gain', 'Gain mass & strength', 'barbell')}
                    </View>

                    {/* Details Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your Details</Text>

                        {/* Name Input */}
                        <Input
                            label="Name"
                            placeholder="e.g. John Doe"
                            value={name}
                            onChangeText={setName}
                            containerStyle={{ marginBottom: 16 }}
                            leftIcon="person-outline"
                        />

                        {/* Gender */}
                        <View style={styles.genderRow}>
                            {renderGenderOption('Male', 'Male', 'male')}
                            {renderGenderOption('Female', 'Female', 'female')}
                        </View>

                        {/* Age */}
                        <Input
                            label="Age"
                            placeholder="e.g. 25"
                            keyboardType="numeric"
                            value={age}
                            onChangeText={setAge}
                            containerStyle={{ marginTop: 16 }}
                            leftIcon="calendar-outline"
                        />

                        {/* Height */}
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <View style={styles.labelRow}>
                                    <Text style={styles.inputLabel}>Height</Text>
                                    <View style={styles.unitToggle}>
                                        <TouchableOpacity onPress={() => setHeightUnit('cm')}>
                                            <Text style={[styles.unitText, heightUnit === 'cm' && styles.unitTextActive]}>cm</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.unitDivider}>/</Text>
                                        <TouchableOpacity onPress={() => setHeightUnit('ft')}>
                                            <Text style={[styles.unitText, heightUnit === 'ft' && styles.unitTextActive]}>ft</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Input
                                    placeholder={heightUnit === 'cm' ? "175" : "5.9"}
                                    keyboardType="numeric"
                                    value={height}
                                    onChangeText={setHeight}
                                />
                            </View>

                            {/* Weight */}
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <View style={styles.labelRow}>
                                    <Text style={styles.inputLabel}>Weight</Text>
                                    <View style={styles.unitToggle}>
                                        <TouchableOpacity onPress={() => setWeightUnit('kg')}>
                                            <Text style={[styles.unitText, weightUnit === 'kg' && styles.unitTextActive]}>kg</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.unitDivider}>/</Text>
                                        <TouchableOpacity onPress={() => setWeightUnit('lb')}>
                                            <Text style={[styles.unitText, weightUnit === 'lb' && styles.unitTextActive]}>lb</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Input
                                    placeholder={weightUnit === 'kg' ? "70" : "154"}
                                    keyboardType="numeric"
                                    value={weight}
                                    onChangeText={setWeight}
                                />
                            </View>
                        </View>

                    </View>

                    <Button
                        title="Continue"
                        onPress={handleContinue}
                        disabled={!isFormValid}
                        size="lg"
                        style={styles.button}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
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
        lineHeight: 24,
        fontFamily: 'Inter',
        marginBottom: 32,
    },
    imagePicker: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        position: 'relative',
    },
    imagePlaceholder: {
        alignItems: 'center',
    },
    imagePlaceholderText: {
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 4,
        fontWeight: '600',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.dark.primary,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111811',
        marginBottom: 16,
        fontFamily: 'InterBold',
    },

    // Goals
    goalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    optionSelected: {
        borderColor: Colors.dark.primary,
        backgroundColor: '#F0FDF4', // Very light green
    },
    goalIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    goalIconContainerSelected: {
        backgroundColor: Colors.dark.primary,
    },
    goalTextContainer: {
        flex: 1,
    },
    goalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111811',
        marginBottom: 4,
        fontFamily: 'InterSemiBold',
    },
    goalDesc: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Inter',
    },
    optionTextSelected: {
        color: '#064E3B', // Darker green for text
    },
    checkIcon: {
        marginLeft: 8,
    },

    // Gender
    genderRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    genderOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 8,
    },
    genderText: {
        fontWeight: '600',
        color: '#4B5563',
        fontFamily: 'InterSemiBold',
    },

    // Inputs
    row: {
        flexDirection: 'row',
        marginTop: 16,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        fontFamily: 'InterSemiBold',
    },
    unitToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    unitText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    unitTextActive: {
        color: Colors.dark.primary,
    },
    unitDivider: {
        marginHorizontal: 4,
        color: '#D1D5DB',
        fontSize: 12,
    },

    button: {
        marginTop: 16,
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
});
