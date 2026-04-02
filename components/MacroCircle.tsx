import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface MacroCircleProps {
    value: number;
    label: string;
    color: string;
    max: number;
}

export default function MacroCircle({ value, label, color, max }: MacroCircleProps) {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(value / max, 1);
    const strokeDashoffset = Math.max(0, circumference - progress * circumference);

    return (
        <View style={styles.macroItem}>
            <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                <Svg width="40" height="40" viewBox="0 0 40 40">
                    <Circle cx="20" cy="20" r={radius} stroke="#374151" strokeWidth="4" fill="transparent" />
                    <Circle
                        cx="20"
                        cy="20"
                        r={radius}
                        stroke={color}
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin="20, 20"
                    />
                </Svg>
                <Text style={[styles.macroValueAbsolute, { color: Colors.dark.text }]}>{value}</Text>
            </View>
            <Text style={styles.macroLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    macroItem: {
        alignItems: 'center',
        gap: 4,
    },
    macroValueAbsolute: {
        position: 'absolute',
        fontSize: 10,
        fontWeight: 'bold',
    },
    macroLabel: {
        color: '#6B7280',
        fontSize: 10,
        fontWeight: '500',
    },
});
