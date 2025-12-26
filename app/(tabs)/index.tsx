import Colors from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLogState } from '@/store/slices/logSlice';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { meals } = useAppSelector((state) => state.log);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Persistence: Load Logs
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const savedjs = await AsyncStorage.getItem('meal_logs');
        if (savedjs) {
          dispatch(setLogState(JSON.parse(savedjs)));
        }
      } catch (e) {
        console.error("Failed to load logs", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadLogs();
  }, []);

  // Persistence: Save Logs
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('meal_logs', JSON.stringify(meals));
    }
  }, [meals, isLoaded]);

  // Totals
  const consumed = meals.reduce((acc, meal) => acc + meal.calories, 0);
  const target = user?.calorieTarget || 2200;
  const remaining = Math.max(0, target - consumed);
  const progress = Math.min(consumed / target, 1);

  // Macros (Mocked targets for demo)
  const proteinTotal = meals.reduce((acc, meal) => acc + meal.protein, 0);
  const carbsTotal = meals.reduce((acc, meal) => acc + meal.carbs, 0);
  const fatTotal = meals.reduce((acc, meal) => acc + meal.fat, 0);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const renderQuickAction = (icon: keyof typeof Ionicons.glyphMap, label: string, color: string, route: string) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={() => router.push(route as any)}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Friend'}!</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.profileBtn}>
            <View style={styles.avatarCrl}>
              <Text style={styles.avatarText}>{user?.name?.[0] || 'U'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Hero Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View>
              <Text style={styles.summaryLabel}>Calories Left</Text>
              <Text style={styles.summaryValue}>{remaining}</Text>
              <Text style={styles.summarySub}>of {target} kcal goal</Text>
            </View>
            <View style={styles.ringContainer}>
              <Svg width="120" height="120" viewBox="0 0 120 120">
                <G rotation="-90" origin="60, 60">
                  <Circle cx="60" cy="60" r={radius} stroke="rgba(255,255,255,0.2)" strokeWidth="10" fill="transparent" />
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#FFFFFF"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </G>
              </Svg>
              <View style={styles.ringOverlay}>
                <Ionicons name="flame" size={24} color="#FFFFFF" />
              </View>
            </View>
          </View>

          {/* Mini Macros within card */}
          <View style={styles.miniMacros}>
            <View style={styles.miniMacro}>
              <Text style={styles.miniLabel}>Protein</Text>
              <Text style={styles.miniValue}>{proteinTotal}g</Text>
            </View>
            <View style={styles.miniDivider} />
            <View style={styles.miniMacro}>
              <Text style={styles.miniLabel}>Carbs</Text>
              <Text style={styles.miniValue}>{carbsTotal}g</Text>
            </View>
            <View style={styles.miniDivider} />
            <View style={styles.miniMacro}>
              <Text style={styles.miniLabel}>Fat</Text>
              <Text style={styles.miniValue}>{fatTotal}g</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {renderQuickAction('add-circle', 'Log Meal', Colors.dark.primary, '/(tabs)/log')}
          {renderQuickAction('water', 'Hydration', '#0EA5E9', '/water-tracker')}
          {renderQuickAction('cart', 'Shopping', '#F59E0B', '/shopping-list')}
          {renderQuickAction('trophy', 'Awards', '#8B5CF6', '/achievements')}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <TouchableOpacity onPress={() => router.push('/history' as any)}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {meals.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
              <Ionicons name="restaurant-outline" size={32} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyText}>No meals tracked yet.</Text>
            <Text style={styles.emptySub}>Your progress starts with the first bite!</Text>
          </View>
        ) : (
          <View style={styles.mealList}>
            {meals.slice(0, 3).map((meal) => (
              <View key={meal.id} style={styles.mealItem}>
                <View style={styles.mealIcon}>
                  <Text style={{ fontSize: 20 }}>🥗</Text>
                </View>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealCals}>{meal.calories} kcal</Text>
                </View>
                <Text style={styles.mealTime}>
                  {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}
                </Text>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Very light gray/white
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
    fontFamily: 'InterSemiBold',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111811',
    fontFamily: 'InterBold',
  },
  profileBtn: {
    padding: 4,
  },
  avatarCrl: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    fontFamily: 'InterBold',
  },
  summaryCard: {
    backgroundColor: Colors.dark.primary, // Sage Green
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'InterBold',
    marginBottom: 4,
  },
  summarySub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Inter',
  },
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOverlay: {
    position: 'absolute',
  },
  miniMacros: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  miniMacro: {
    alignItems: 'center',
    flex: 1,
  },
  miniLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  miniValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  miniDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111811',
    marginBottom: 16,
    fontFamily: 'InterBold',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.dark.primary,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderStyle: 'dashed',
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  mealList: {
    gap: 12,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  mealIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111811',
    marginBottom: 2,
  },
  mealCals: {
    fontSize: 13,
    color: '#6B7280',
  },
  mealTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
