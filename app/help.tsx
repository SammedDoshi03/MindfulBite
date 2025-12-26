
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpScreen() {
    const router = useRouter();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const faqs = [
        {
            id: '1',
            question: 'How do I log a meal?',
            answer: 'Tap the "+" tab at the bottom, then choose to snap a photo or enter manually.',
        },
        {
            id: '2',
            question: 'Is the AI analysis accurate?',
            answer: 'Our AI is highly trained but estimates can vary. You can always edit the results manually.',
        },
        {
            id: '3',
            question: 'How do I change my goals?',
            answer: 'Go to Settings > Personal Details to update your weight, height, or goals.',
        },
        {
            id: '4',
            question: 'Can I track water intake?',
            answer: 'Yes! Access the Water Tracker from the Home screen or Profile.',
        },
    ];

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111811" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                <View style={styles.faqList}>
                    {faqs.map((faq) => (
                        <TouchableOpacity
                            key={faq.id}
                            style={styles.faqItem}
                            onPress={() => toggleExpand(faq.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.faqHeader}>
                                <Text style={styles.question}>{faq.question}</Text>
                                <Ionicons
                                    name={expandedId === faq.id ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#6B7280"
                                />
                            </View>
                            {expandedId === faq.id && (
                                <Text style={styles.answer}>{faq.answer}</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Contact Us</Text>
                <View style={styles.contactCard}>
                    <Text style={styles.contactText}>Need more help? Our team is here for you.</Text>
                    <TouchableOpacity style={styles.contactBtn}>
                        <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.contactBtnText}>Email Support</Text>
                    </TouchableOpacity>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backBtn: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111811',
        fontFamily: 'InterBold',
    },
    content: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111811',
        marginBottom: 16,
        marginTop: 8,
        fontFamily: 'InterBold',
    },
    faqList: {
        gap: 12,
        marginBottom: 32,
    },
    faqItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
        flex: 1,
        marginRight: 8,
        fontFamily: 'InterSemiBold',
    },
    answer: {
        marginTop: 12,
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        fontFamily: 'Inter',
    },
    contactCard: {
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginTop: 8,
    },
    contactText: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 16,
        textAlign: 'center',
        fontFamily: 'Inter',
    },
    contactBtn: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        gap: 8,
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    contactBtnText: {
        color: '#FFFFFF', // White text on dark primary
        // wait in Light theme primary might be dark green, so white text is good.
        // Actually check Colors.dark.primary
        // Typically primary light/dark are inverses or shared.
        // I'll stick to white text.
        fontWeight: 'bold',
        fontSize: 14,
    },
});
