import Colors from '@/constants/Colors';
import { useAppSelector } from '@/store/hooks';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { chatWithAI } from '@/services/gemini';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AiCoachScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const scrollViewRef = useRef<ScrollView>(null);
    const { meals } = useAppSelector(state => state.log);

    const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
        { role: 'ai', text: 'Hi! I am your AI Nutrition Coach. 🧠\n\nHow can I help you optimize your diet today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        const msg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: msg }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

        // Build context for AI
        const today = new Date().toDateString();
        const totalCals = meals.filter(m => new Date(m.timestamp).toDateString() === today).reduce((acc, m) => acc + m.calories, 0);
        const totalProtein = meals.filter(m => new Date(m.timestamp).toDateString() === today).reduce((acc, m) => acc + m.protein, 0);

        const context = `The user has consumed ${totalCals} kcal and ${totalProtein}g of protein today.`;

        const reply = await chatWithAI(msg, context);

        setMessages(prev => [...prev, { role: 'ai', text: reply }]);
        setIsTyping(false);
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    };

    return (
        <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#111811" />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.headerTitle}>Mindful Coach</Text>
                    <Text style={{ fontSize: 12, color: '#10B981', fontWeight: 'bold' }}>● Online</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView 
                    ref={scrollViewRef}
                    contentContainerStyle={styles.chatContent}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.map((m, i) => (
                        <Animated.View 
                            key={i} 
                            entering={FadeInDown.duration(300)}
                            style={[
                                styles.messageBubble, 
                                m.role === 'user' ? styles.bubbleUser : styles.bubbleAi
                            ]}
                        >
                            <Text style={[styles.messageText, m.role === 'user' ? { color: '#FFFFFF' } : { color: '#111811' }]}>
                                {m.text}
                            </Text>
                        </Animated.View>
                    ))}
                    {isTyping && (
                        <Animated.View entering={FadeInDown} style={[styles.messageBubble, styles.bubbleAi]}>
                            <Text style={{ color: '#9CA3AF', fontStyle: 'italic' }}>Typing...</Text>
                        </Animated.View>
                    )}
                </ScrollView>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputBox}
                        placeholder="Ask about your diet..."
                        placeholderTextColor="#9CA3AF"
                        value={input}
                        onChangeText={setInput}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                        <Ionicons name="send" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111811',
    },
    chatContent: {
        padding: 16,
        paddingBottom: 24,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
    },
    bubbleAi: {
        backgroundColor: '#FFFFFF',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    bubbleUser: {
        backgroundColor: Colors.dark.primary,
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    inputBox: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        maxHeight: 100,
        fontSize: 15,
        color: '#111811',
    },
    sendBtn: {
        backgroundColor: Colors.dark.primary,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    }
});
