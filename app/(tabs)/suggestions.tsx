import { Button } from '@/components/Button';
import Colors from '@/constants/Colors';
import { generateRecipes, Recipe } from '@/services/gemini';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Initial Mock recipes (Fallback)
const INITIAL_RECIPES: Recipe[] = [
    {
        title: 'Quinoa & Black Bean Salad',
        calories: 380,
        time: '15 min',
        tags: ['Vegetarian', 'High Protein'],
        description: 'A refreshing salad with quinoa, black beans, corn, and lime dressing.',
        ingredients: ['1 cup cooked quinoa', '1/2 cup black beans', '1/4 cup corn', '1 tbsp olive oil', 'Lime juice'],
        instructions: ['Cook quinoa according to package.', 'Mix all ingredients in a bowl.', 'Drizzle dressing and serve.'],
        macros: { protein: 12, carbs: 45, fat: 10 }
    },
    {
        title: 'Grilled Salmon with Asparagus',
        calories: 450,
        time: '25 min',
        tags: ['Keto', 'Gluten Free'],
        description: 'Rich omega-3 salmon fillet grilled to perfection with lemon butter asparagus.',
        ingredients: ['1 Salmon fillet', '1 bunch asparagus', '1 tbsp butter', 'Lemon wedges', 'Garlic powder'],
        instructions: ['Season salmon with salt & herbs.', 'Grill for 5-7 mins per side.', 'Sauté asparagus in butter.', 'Serve hot.'],
        macros: { protein: 35, carbs: 5, fat: 28 }
    },
];

export default function SuggestionsScreen() {
    const router = useRouter();
    const [filter, setFilter] = useState('All');
    const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
    const [loading, setLoading] = useState(false);

    const filteredRecipes = recipes.filter(recipe => {
        if (filter === 'All') return true;
        if (filter === 'Vegetarian') return recipe.tags.includes('Vegetarian');
        if (filter === 'High Protein') return recipe.tags.includes('High Protein');
        if (filter === 'Breakfast') return recipe.tags.includes('Breakfast');
        return true;
    });

    const handleGenerate = async () => {
        setLoading(true);
        const newRecipes = await generateRecipes(filter === 'All' ? 'Balanced' : filter);
        if (newRecipes.length > 0) {
            setRecipes(newRecipes);
        }
        setLoading(false);
    };

    const openRecipe = (recipe: Recipe) => {
        router.push({
            pathname: '/recipe-details',
            params: { recipe: JSON.stringify(recipe) }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>AI Suggestions</Text>
                    <Text style={styles.subtitle}>Curated meals just for you.</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                    {['All', 'Vegetarian', 'High Protein', 'Breakfast'].map((tag) => (
                        <TouchableOpacity
                            key={tag}
                            style={[styles.filterChip, filter === tag && styles.filterChipActive]}
                            onPress={() => setFilter(tag)}
                        >
                            <Text style={[styles.filterText, filter === tag && styles.filterTextActive]}>{tag}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Button
                    title={loading ? "Generating..." : "Generate New Ideas"}
                    onPress={handleGenerate}
                    isLoading={loading}
                    style={{ marginBottom: 24 }}
                    icon={<Ionicons name="sparkles" size={18} color="white" style={{ marginRight: 8 }} />}
                />

                <View style={styles.grid}>
                    {filteredRecipes.map((recipe, index) => (
                        <TouchableOpacity key={index} style={styles.card} activeOpacity={0.9} onPress={() => openRecipe(recipe)}>
                            {/* Placeholder Image since AI doesn't return one yet */}
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400' }}
                                style={styles.cardImage}
                            />
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>{recipe.title}</Text>
                                    <View style={styles.ratingBox}>
                                        <Ionicons name="star" size={12} color="#F59E0B" />
                                        <Text style={styles.ratingText}>4.8</Text>
                                    </View>
                                </View>
                                <View style={styles.metaRow}>
                                    <Text style={styles.metaText}>{recipe.calories} kcal</Text>
                                    <Text style={styles.dot}>•</Text>
                                    <Text style={styles.metaText}>{recipe.time}</Text>
                                </View>
                                <Text style={styles.description} numberOfLines={2}>{recipe.description}</Text>
                                <View style={styles.tagsRow}>
                                    {recipe.tags?.slice(0, 3).map(tag => (
                                        <View key={tag} style={styles.tag}>
                                            <Text style={styles.tagText}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
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
    content: {
        padding: 24,
    },
    header: {
        marginBottom: 24,
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
    },
    filterRow: {
        marginBottom: 24,
        flexGrow: 0,
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    filterChipActive: {
        backgroundColor: Colors.dark.primary, // Keep primary for active for contrast
        borderColor: Colors.dark.primary,
    },
    filterText: {
        color: '#374151',
        fontFamily: 'InterSemiBold',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    grid: {
        gap: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardImage: {
        width: '100%',
        height: 180,
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111811',
        fontFamily: 'InterBold',
        flex: 1,
        marginRight: 8,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    ratingText: {
        color: '#F59E0B',
        fontWeight: 'bold',
        fontSize: 12,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    metaText: {
        color: '#6B7280',
        fontSize: 14,
        fontFamily: 'Inter',
    },
    dot: {
        color: '#D1D5DB',
        marginHorizontal: 8,
    },
    description: {
        color: '#4B5563',
        fontSize: 14,
        fontFamily: 'Inter',
        marginBottom: 12,
        lineHeight: 20,
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    tagText: {
        color: '#4B5563',
        fontSize: 12,
        fontFamily: 'Inter',
    },
});
