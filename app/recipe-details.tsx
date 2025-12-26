import Colors from '@/constants/Colors';
import { Recipe } from '@/services/gemini';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecipeDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Parse the recipe object from params
    // Note: In complex apps, passing ID and fetching is better, but passing full object works for this demo.
    const recipe: Recipe = params.recipe ? JSON.parse(params.recipe as string) : null;

    if (!recipe) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Recipe not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Image */}
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' }}
                    style={styles.heroImage}
                />

                {/* Back Button Overlay */}
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#111811" />
                </TouchableOpacity>

                <View style={styles.contentContainer}>
                    {/* Header */}
                    <Text style={styles.title}>{recipe.title}</Text>
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={16} color="#6B7280" />
                            <Text style={styles.metaText}>{recipe.time}</Text>
                        </View>
                        <View style={styles.dot} />
                        <View style={styles.metaItem}>
                            <Ionicons name="flame-outline" size={16} color="#E11D48" />
                            <Text style={[styles.metaText, { color: '#E11D48' }]}>{recipe.calories} kcal</Text>
                        </View>
                    </View>

                    {/* Macros Grid */}
                    <View style={styles.macrosCard}>
                        <View style={styles.macroItem}>
                            <Text style={styles.macroLabel}>Protein</Text>
                            <Text style={styles.macroValue}>{recipe.macros?.protein || 0}g</Text>
                        </View>
                        <View style={styles.macroDivider} />
                        <View style={styles.macroItem}>
                            <Text style={styles.macroLabel}>Carbs</Text>
                            <Text style={styles.macroValue}>{recipe.macros?.carbs || 0}g</Text>
                        </View>
                        <View style={styles.macroDivider} />
                        <View style={styles.macroItem}>
                            <Text style={styles.macroLabel}>Fat</Text>
                            <Text style={styles.macroValue}>{recipe.macros?.fat || 0}g</Text>
                        </View>
                    </View>

                    <Text style={styles.description}>{recipe.description}</Text>

                    {/* Ingredients */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        <View style={styles.listContainer}>
                            {recipe.ingredients?.map((ing, i) => (
                                <View key={i} style={styles.listItem}>
                                    <View style={styles.bullet} />
                                    <Text style={styles.listText}>{ing}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Instructions */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Instructions</Text>
                        <View style={styles.stepContainer}>
                            {recipe.instructions?.map((step, i) => (
                                <View key={i} style={styles.stepItem}>
                                    <View style={styles.stepNumber}>
                                        <Text style={styles.stepNumText}>{i + 1}</Text>
                                    </View>
                                    <Text style={styles.stepText}>{step}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Padding for bottom */}
                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heroImage: {
        width: '100%',
        height: 300,
    },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    contentContainer: {
        marginTop: -30,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111811',
        marginBottom: 12,
        fontFamily: 'InterBold',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
        fontFamily: 'Inter',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 16,
    },
    macrosCard: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    macroItem: {
        flex: 1,
        alignItems: 'center',
    },
    macroLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    macroValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111811',
    },
    macroDivider: {
        width: 1,
        height: '100%',
        backgroundColor: '#E5E7EB',
    },
    description: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 24,
        marginBottom: 32,
        fontFamily: 'Inter',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111811',
        marginBottom: 16,
        fontFamily: 'InterBold',
    },
    listContainer: {
        gap: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.dark.primary,
        marginTop: 8,
        marginRight: 12,
    },
    listText: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 24,
        flex: 1,
    },
    stepContainer: {
        gap: 20,
    },
    stepItem: {
        flexDirection: 'row',
        gap: 16,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.dark.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    stepText: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 24,
        flex: 1,
    },
});
