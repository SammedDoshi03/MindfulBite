import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShoppingListScreen() {
    const router = useRouter();
    const [newItem, setNewItem] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Produce');
    const [items, setItems] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const categories = ['Produce', 'Dairy', 'Meat', 'Bakery', 'Pantry', 'Other'];

    // Load items on mount
    useEffect(() => {
        const loadItems = async () => {
            try {
                const saved = await AsyncStorage.getItem('shopping_list');
                if (saved) {
                    setItems(JSON.parse(saved));
                }
            } catch (e) {
                console.error("Failed to load shopping list", e);
            } finally {
                setIsLoaded(true);
            }
        };
        loadItems();
    }, []);

    // Save items on change
    useEffect(() => {
        if (isLoaded) {
            AsyncStorage.setItem('shopping_list', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = () => {
        if (!newItem.trim()) return;
        const item = {
            id: Date.now().toString(),
            name: newItem.trim(),
            category: selectedCategory,
            done: false
        };
        setItems(prev => [item, ...prev]);
        setNewItem('');
        // Don't dismiss keyboard to allow rapid entry
    };

    const toggleItem = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, done: !item.done } : item
        ));
    };

    const deleteItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleShare = async () => {
        try {
            const listString = items
                .map((i: any) => `${i.done ? '[x]' : '[ ]'} ${i.name} (${i.category})`)
                .join('\n');

            await Share.share({
                message: `My Shopping List:\n\n${listString}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.itemRow}>
            <TouchableOpacity
                style={[styles.checkbox, item.done && styles.checkboxChecked]}
                onPress={() => toggleItem(item.id)}
            >
                {item.done && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </TouchableOpacity>

            <View style={styles.itemInfo}>
                <Text style={[styles.itemName, item.done && styles.itemNameDone]}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
            </View>

            <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
        </View>
    );

    const pendingCount = items.filter(i => !i.done).length;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
                <View style={styles.content}>

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Ionicons name="arrow-back" size={24} color="#111811" />
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.title}>Shopping List</Text>
                            <Text style={styles.subtitle}>{pendingCount} items to buy</Text>
                        </View>
                        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                            <Ionicons name="share-outline" size={24} color={Colors.dark.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* List */}
                    <FlatList
                        data={items}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled" // Critical for interacting while keyboard up
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Ionicons name="basket-outline" size={48} color="#D1D5DB" />
                                <Text style={styles.emptyText}>Your list is empty.</Text>
                            </View>
                        }
                    />

                    {/* Input Area */}
                    <View style={styles.inputArea}>

                        {/* Category Selector */}
                        <View style={styles.categoryRow}>
                            <FlatList
                                horizontal
                                data={categories}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={item => item}
                                renderItem={({ item: cat }) => (
                                    <TouchableOpacity
                                        style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
                                        onPress={() => setSelectedCategory(cat)}
                                    >
                                        <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>{cat}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <Input
                                placeholder="Add new item..."
                                value={newItem}
                                onChangeText={setNewItem}
                                containerStyle={styles.inputContainer}
                                leftIcon="add"
                                returnKeyType="done"
                                onSubmitEditing={addItem}
                            />
                            <Button
                                title="Add"
                                onPress={addItem}
                                size="md"
                                style={styles.addBtn}
                                disabled={!newItem.trim()}
                            />
                        </View>
                        {/* Safe Area Bottom Spacer for newest iPhones */}
                        <View style={{ height: Platform.OS === 'ios' ? 20 : 0 }} />
                    </View>

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
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
    },
    backBtn: {
        padding: 8,
        marginLeft: -8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111811',
        fontFamily: 'InterBold',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Inter',
    },
    shareBtn: {
        padding: 8,
        backgroundColor: '#FFFFFF', // White for consisteny
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    listContent: {
        padding: 24,
        paddingBottom: 24,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    checkboxChecked: {
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primary,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111811',
        fontFamily: 'InterSemiBold',
        marginBottom: 2,
    },
    itemNameDone: {
        textDecorationLine: 'line-through',
        color: '#D1D5DB',
    },
    itemCategory: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    deleteBtn: {
        padding: 8,
        backgroundColor: '#FEF2F2',
        borderRadius: 10,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 64,
        gap: 16,
        opacity: 0.5,
    },
    emptyText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
    inputArea: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        paddingTop: 20,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    categoryRow: {
        marginBottom: 16,
    },
    catChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    catChipActive: {
        backgroundColor: '#F0FDF4',
        borderColor: Colors.dark.primary,
    },
    catText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6B7280',
    },
    catTextActive: {
        color: Colors.dark.primary,
        fontWeight: '600',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    inputContainer: {
        flex: 1,
        marginRight: 12,
        marginBottom: 0,
    },
    addBtn: {
        width: 80,
    },
});
