
import Colors from '@/constants/Colors';
import { useAppSelector } from '@/store/hooks';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
    const router = useRouter();
    const { meals } = useAppSelector((state) => state.log);

    const sortedMeals = [...meals].sort((a, b) => b.timestamp - a.timestamp);

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.mealItem}>
            <View style={styles.mealIcon}>
                <Text style={{ fontSize: 24 }}>🥗</Text>
            </View>
            <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{item.name}</Text>
                <View style={styles.mealMeta}>
                    <Text style={styles.mealCals}>{item.calories} kcal</Text>
                    <Text style={styles.mealDot}>•</Text>
                    <Text style={styles.mealTime}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}
                    </Text>
                </View>
            </View>
            <View style={styles.macros}>
                <View style={styles.macroTag}>
                    <View style={[styles.macroDot, { backgroundColor: '#60A5FA' }]} />
                    <Text style={styles.macroText}>{item.protein}p</Text>
                </View>
                <View style={styles.macroTag}>
                    <View style={[styles.macroDot, { backgroundColor: '#FB923C' }]} />
                    <Text style={styles.macroText}>{item.carbs}c</Text>
                </View>
                <View style={styles.macroTag}>
                    <View style={[styles.macroDot, { backgroundColor: '#FACC15' }]} />
                    <Text style={styles.macroText}>{item.fat}f</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#111811" />
                </TouchableOpacity>
                <Text style={styles.title}>History</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Chart Section */}
                {sortedMeals.length > 0 && (
                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Last 7 Days</Text>
                        <BarChart
                            data={{
                                labels: last7Days.map(d => d.label),
                                datasets: [{ data: last7Days.map(d => d.calories) }]
                            }}
                            width={Object.keys(last7Days).length * 50 + 50} // Approximate width or Dimensions.get('window').width - 48
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Emerald 500
                                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                                barPercentage: 0.7,
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                                marginRight: 16, // Right padding fix
                            }}
                            showValuesOnTopOfBars
                            fromZero
                        />
                    </View>
                )}

                <Text style={styles.sectionTitle}>Recent Meals</Text>

                {sortedMeals.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
                        <Text style={styles.emptyText}>No meals logged yet</Text>
                    </View>
                ) : (
                    sortedMeals.map(item => (
                        <View key={item.id} style={styles.mealItem}>
                            <View style={styles.mealIcon}>
                                <Text style={{ fontSize: 24 }}>🥗</Text>
                            </View>
                            <View style={styles.mealInfo}>
                                <Text style={styles.mealName}>{item.name}</Text>
                                <View style={styles.mealMeta}>
                                    <Text style={styles.mealCals}>{item.calories} kcal</Text>
                                    <Text style={styles.mealDot}>•</Text>
                                    <Text style={styles.mealTime}>
                                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}
                                    </Text>
                                    <Text style={styles.mealDot}>•</Text>
                                    <Text style={styles.mealTime}>
                                        {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.macros}>
                                <View style={styles.macroTag}>
                                    <View style={[styles.macroDot, { backgroundColor: '#60A5FA' }]} />
                                    <Text style={styles.macroText}>{item.protein}p</Text>
                                </View>
                                <View style={styles.macroTag}>
                                    <View style={[styles.macroDot, { backgroundColor: '#FB923C' }]} />
                                    <Text style={styles.macroText}>{item.carbs}c</Text>
                                </View>
                                <View style={styles.macroTag}>
                                    <View style={[styles.macroDot, { backgroundColor: '#FACC15' }]} />
                                    <Text style={styles.macroText}>{item.fat}f</Text>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
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
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111811',
        fontFamily: 'InterBold',
    },
    content: {
        flex: 1,
    },
    listContent: {
        padding: 24,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        color: '#9CA3AF',
        fontSize: 16,
        fontWeight: '500',
    },
    mealItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    mealIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    mealInfo: {
        flex: 1,
    },
    mealName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111811',
        marginBottom: 4,
    },
    mealMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mealCals: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.primary,
    },
    mealDot: {
        marginHorizontal: 6,
        color: '#D1D5DB',
        fontSize: 10,
    },
    mealTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    macros: {
        alignItems: 'flex-end',
        gap: 4,
    },
    macroTag: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    macroDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },
    macroText: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '500',
        width: 24,
        textAlign: 'right',
    },
    chartCard: {
        backgroundColor: '#FFFFFF',
        margin: 24,
        marginBottom: 16,
        marginTop: 0,
        padding: 16,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111811',
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111811',
        marginLeft: 24,
        marginBottom: 12,
    },
});
