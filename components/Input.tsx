import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    leftIcon?: keyof typeof Ionicons.glyphMap;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    style,
    leftIcon,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error ? styles.inputError : null]}>
                {leftIcon && (
                    <Ionicons
                        name={leftIcon}
                        size={20}
                        color="#9CA3AF"
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor="#9CA3AF"
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
        fontFamily: 'InterSemiBold',
        color: '#4B5563',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6', // Light gray background
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 52, // Slightly taller
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    input: {
        flex: 1,
        height: '100%',
        color: '#111827', // Dark text
        fontFamily: 'Inter',
        fontSize: 16,
    },
    icon: {
        marginRight: 8,
    },
    inputError: {
        borderColor: Colors.dark.error,
    },
    errorText: {
        color: Colors.dark.error,
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'Inter',
    },
});
