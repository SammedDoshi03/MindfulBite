import Colors from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    textStyle,
    onPress,
    ...props
}) => {
    const isDark = true; // For now assuming dark mode primarily or getting from context in future
    const { disabled, style } = props;

    const getBackgroundColor = () => {
        if (disabled) return isDark ? '#374151' : '#E5E7EB';
        if (variant === 'primary') return Colors.dark.primary;
        if (variant === 'secondary') return Colors.dark.secondary;
        if (variant === 'outline') return 'transparent';
        if (variant === 'ghost') return 'transparent';
        return Colors.dark.primary;
    };

    const getTextColor = () => {
        if (disabled) return '#9CA3AF';
        if (variant === 'primary') return '#FFFFFF'; // Contrast on primary
        if (variant === 'secondary') return '#FFFFFF';
        if (variant === 'outline') return Colors.dark.primary;
        if (variant === 'ghost') return Colors.dark.text;
        return '#FFFFFF';
    };

    const getBorder = () => {
        if (variant === 'outline') return { borderWidth: 1, borderColor: Colors.dark.primary };
        return {};
    };

    const getHeight = () => {
        if (size === 'sm') return 36;
        if (size === 'lg') return 56;
        return 48; // md
    };

    const getFontSize = () => {
        if (size === 'sm') return 14;
        if (size === 'lg') return 18;
        return 16;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.7}
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    height: getHeight(),
                    ...getBorder(),
                },
                style,
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {icon}
                    <Text
                        style={[
                            styles.text,
                            {
                                color: getTextColor(),
                                fontSize: getFontSize(),
                            },
                            // textStyle, // Removed as per instruction
                        ]}
                    >
                        {title}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        flexDirection: 'row',
    },
    text: {
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
    },
});
