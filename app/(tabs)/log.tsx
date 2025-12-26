
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import Colors from '@/constants/Colors';
import { analyzeImage, NutritionData } from '@/services/gemini';
import { useAppDispatch } from '@/store/hooks';
import { addMeal } from '@/store/slices/logSlice';
import Ionicons from '@expo/vector-icons/Ionicons';
import { legacy as FileSystem } from 'expo-file-system';
// @ts-ignore
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

export default function LogScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<NutritionData | null>(null);
    const [mealType, setMealType] = useState('Breakfast');
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Manual Entry State
    const [modalVisible, setModalVisible] = useState(false);
    const [manualName, setManualName] = useState('');
    const [manualCalories, setManualCalories] = useState('');
    const [manualProtein, setManualProtein] = useState('');
    const [manualCarbs, setManualCarbs] = useState('');
    const [manualFat, setManualFat] = useState('');

    const pickImage = async (useCamera: boolean) => {
        let result;
        if (useCamera) {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
            });
        }

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setResult(null); // Reset previous result
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setLoading(true);
        try {
            const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
            const data = await analyzeImage(base64);
            setResult(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to analyze image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        if (result) {
            dispatch(addMeal({
                id: Date.now().toString(),
                name: result.foodName,
                calories: result.calories,
                protein: result.protein,
                carbs: result.carbs,
                fat: result.fat,
                imageUri: image!,
                timestamp: Date.now(),
            }));
            Alert.alert('Success', 'Meal logged successfully!');
            setImage(null);
            setResult(null);
            router.push('/(tabs)');
        }
    };

    const handleManualSubmit = () => {
        if (!manualName || !manualCalories) {
            Alert.alert('Error', 'Please enter at least a name and calories.');
            return;
        }

        dispatch(addMeal({
            id: Date.now().toString(),
            name: manualName,
            calories: parseInt(manualCalories) || 0,
            protein: parseInt(manualProtein) || 0,
            carbs: parseInt(manualCarbs) || 0,
            fat: parseInt(manualFat) || 0,
            timestamp: Date.now(),
        }));

        setModalVisible(false);
        setManualName('');
        setManualCalories('');
        setManualProtein('');
        setManualCarbs('');
        setManualFat('');
        Alert.alert('Success', 'Meal logged manually!');
        router.push('/(tabs)');
    };

    const MacroCircle = ({ value, label, color, max }: { value: number, label: string, color: string, max: number }) => {
        const radius = 16;
        const circumference = 2 * Math.PI * radius;
        const progress = Math.min(value / max, 1);
        const strokeDashoffset = circumference - progress * circumference;

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
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Top App Bar */}
            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#111811" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Log Meal</Text>
                <TouchableOpacity>
                    <Text style={styles.todayText}>Today</Text>
                </TouchableOpacity>
            </View>

            {/* Meal Type Segmented Buttons */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mealTypeContainer}>
                {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        onPress={() => setMealType(type)}
                        style={[
                            styles.mealTypeChip,
                            mealType === type && styles.mealTypeChipActive
                        ]}
                    >
                        <Text style={[
                            styles.mealTypeText,
                            mealType === type && styles.mealTypeTextActive
                        ]}>{type}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#9CA3AF" />
                        <Text style={styles.searchPlaceholder}>Search food database...</Text>
                        <TouchableOpacity style={styles.scanButton}>
                            <Ionicons name="barcode-outline" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Content Area */}
                {!image ? (
                    <View style={styles.placeholderContainer}>
                        <TouchableOpacity onPress={() => pickImage(true)} style={styles.heroButton}>
                            <Ionicons name="camera" size={32} color="#059669" />
                            <Text style={styles.heroButtonText}>Take a Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.secondaryButtonRow}>
                            <Ionicons name="add-circle-outline" size={24} color="#111811" />
                            <Text style={styles.secondaryButtonText}>Add Custom Item</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        {/* AI Analysis Card */}
                        <View style={styles.aiCard}>
                            <View style={styles.aiHeader}>
                                <View style={styles.imagePreviewWrapper}>
                                    <Image source={{ uri: image }} style={styles.imagePreview} />
                                    <View style={styles.aiBadge}>
                                        <Ionicons name="sparkles" size={16} color="white" />
                                    </View>
                                </View>
                                <View style={styles.aiInfo}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.aiTitle}>AI Analysis</Text>
                                        {result && (
                                            <View style={styles.confidenceBadge}>
                                                <Text style={styles.confidenceText}>Confidence 94%</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.aiSubtitle}>Based on your photo</Text>

                                    {!result && !loading && (
                                        <Button
                                            title="Analyze Now"
                                            onPress={handleAnalyze}
                                            size="sm"
                                            style={{ marginTop: 8 }}
                                        />
                                    )}
                                    {loading && <Text style={{ color: Colors.dark.primary, marginTop: 8 }}>Analyzing...</Text>}

                                    <TouchableOpacity onPress={() => { setImage(null); setResult(null) }} style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ color: Colors.dark.primary, fontSize: 12, fontWeight: '600' }}>Retake Photo</Text>
                                        <Ionicons name="camera-outline" size={14} color={Colors.dark.primary} style={{ marginLeft: 4 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Detected Items */}
                            {result && (
                                <View style={styles.detectedItems}>
                                    <View style={styles.itemRow}>
                                        <Ionicons name="checkmark-circle" size={24} color={Colors.dark.primary} />
                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={styles.itemName}>{result.foodName}</Text>
                                                <Text style={styles.itemName}>{result.calories} <Text style={{ fontSize: 12, fontWeight: 'normal', color: '#6B7280' }}>kcal</Text></Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                                                <Text style={styles.itemMeta}>1 serving</Text>
                                                <Ionicons name="pencil" size={16} color="#9CA3AF" />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* Manual Add Section Placeholder */}
                <View style={{ marginTop: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={styles.sectionTitle}>Additional Items</Text>
                        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="add-circle" size={20} color={Colors.dark.primary} />
                            <Text style={{ color: Colors.dark.primary, marginLeft: 4, fontWeight: '600' }}>Add Custom</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Quick Add Placeholder */}
                    <TouchableOpacity style={styles.quickAddPlaceholder}>
                        <Ionicons name="search" size={24} color="#9CA3AF" />
                        <Text style={{ color: '#9CA3AF', marginLeft: 8 }}>Search for more food</Text>
                    </TouchableOpacity>
                </View>

                {/* Spacer for sticky footer */}
                <View style={{ height: 100 }} />

            </ScrollView>

            {/* Bottom Summary Sheet (Fixed Footer) */}
            {result && (
                <View style={styles.footer}>
                    <View style={styles.dragHandle} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
                        <View>
                            <Text style={styles.totalLabel}>TOTAL CALORIES</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                <Text style={styles.totalValue}>{result.calories}</Text>
                                <Text style={styles.totalUnit}>kcal</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 16 }}>
                            <MacroCircle value={result.protein} label="Protein" color="#60A5FA" max={100} />
                            <MacroCircle value={result.carbs} label="Carbs" color="#FB923C" max={100} />
                            <MacroCircle value={result.fat} label="Fat" color="#FACC15" max={100} />
                        </View>
                    </View>
                    <Button
                        title="Confirm & Save Log"
                        onPress={handleSave}
                        size="lg"
                        icon={<Ionicons name="checkmark" size={20} color="white" style={{ marginRight: 8 }} />}
                    />
                </View>
            )}

            {/* Manual Entry Modal (Preserved) */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Manual Entry</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#111811" />
                            </TouchableOpacity>
                        </View>

                        <Input label="Food Name" placeholder="e.g. Banana" value={manualName} onChangeText={setManualName} />
                        <View style={styles.row}>
                            <Input label="Calories" placeholder="0" keyboardType="numeric" value={manualCalories} onChangeText={setManualCalories} containerStyle={{ flex: 1, marginRight: 8 }} />
                            <Input label="Protein (g)" placeholder="0" keyboardType="numeric" value={manualProtein} onChangeText={setManualProtein} containerStyle={{ flex: 1, marginLeft: 8 }} />
                        </View>
                        <View style={styles.row}>
                            <Input label="Carbs (g)" placeholder="0" keyboardType="numeric" value={manualCarbs} onChangeText={setManualCarbs} containerStyle={{ flex: 1, marginRight: 8 }} />
                            <Input label="Fat (g)" placeholder="0" keyboardType="numeric" value={manualFat} onChangeText={setManualFat} containerStyle={{ flex: 1, marginLeft: 8 }} />
                        </View>

                        <Button title="Log Meal" onPress={handleManualSubmit} style={{ marginTop: 16 }} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    appBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111811',
        fontFamily: 'InterBold',
    },
    todayText: {
        color: Colors.dark.primary,
        fontWeight: 'bold',
        fontFamily: 'InterSemiBold',
    },
    mealTypeContainer: {
        flexGrow: 0,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    mealTypeChip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    mealTypeChipActive: {
        backgroundColor: '#F0FDF4',
        borderColor: Colors.dark.primary,
    },
    mealTypeText: {
        color: '#6B7280',
        fontWeight: '500',
    },
    mealTypeTextActive: {
        color: Colors.dark.primary,
        fontWeight: '600',
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    searchContainer: {
        marginVertical: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 48,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    searchPlaceholder: {
        flex: 1,
        marginLeft: 12,
        color: '#9CA3AF',
    },
    scanButton: {
        padding: 4,
    },
    placeholderContainer: {
        gap: 16,
    },
    heroButton: {
        backgroundColor: '#F0FDF4', // Light Sage
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#86EFAC', // Sage 300
        borderStyle: 'dashed',
    },
    heroButtonText: {
        color: '#064E3B',
        marginTop: 8,
        fontWeight: '600',
    },
    secondaryButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    secondaryButtonText: {
        color: '#111811',
        marginLeft: 8,
        fontWeight: '600',
    },
    aiCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
    },
    aiHeader: {
        padding: 16,
        flexDirection: 'row',
        gap: 16,
    },
    imagePreviewWrapper: {
        width: 80,
        height: 80,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    aiBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiInfo: {
        flex: 1,
    },
    aiTitle: {
        color: '#111811',
        fontWeight: 'bold',
        fontSize: 16,
    },
    aiSubtitle: {
        color: '#6B7280',
        fontSize: 12,
        marginTop: 2,
    },
    confidenceBadge: {
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BBF7D0',
    },
    confidenceText: {
        color: '#166534',
        fontSize: 10,
        fontWeight: 'bold',
    },
    detectedItems: {
        backgroundColor: '#F9FAFB',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    itemRow: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    itemName: {
        color: '#111811',
        fontWeight: 'bold',
        fontSize: 14,
    },
    itemMeta: {
        color: '#6B7280',
        fontSize: 12,
    },
    sectionTitle: {
        color: '#111811',
        fontSize: 18,
        fontWeight: 'bold',
    },
    quickAddPlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 16,
        backgroundColor: '#F9FAFB',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 20,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        color: '#6B7280',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 4,
    },
    totalValue: {
        color: '#111811',
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'InterBold',
    },
    totalUnit: {
        color: '#6B7280',
        fontSize: 14,
        marginLeft: 4,
        marginBottom: 6,
    },
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


    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 32,
        minHeight: '60%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111811',
        fontFamily: 'InterBold',
    },
    row: {
        flexDirection: 'row',
    }
});
