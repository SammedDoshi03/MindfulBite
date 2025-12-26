
import { Button } from '@/components/Button';
import Colors from '@/constants/Colors';
import { useAppSelector } from '@/store/hooks';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        tagIcon: 'sparkles' as const,
        tagText: 'AI ANALYZING...',
        boxText: '450 kcal',
        boxColor: Colors.dark.primary,
        overlayColor: 'rgba(16, 185, 129, 0.3)',
    },
    {
        id: '2',
        tagIcon: 'pie-chart' as const,
        tagText: 'MACROS TRACKED',
        boxText: 'Protein 30g',
        boxColor: '#3B82F6',
        overlayColor: 'rgba(59, 130, 246, 0.3)',
    },
    {
        id: '3',
        tagIcon: 'leaf' as const,
        tagText: 'HEALTHY CHOICE',
        boxText: 'Score 9/10',
        boxColor: '#F59E0B',
        overlayColor: 'rgba(245, 158, 11, 0.3)',
    },
];

export default function WelcomeScreen() {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (activeIndex < slides.length - 1) {
                flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
                setActiveIndex(activeIndex + 1);
            } else {
                flatListRef.current?.scrollToIndex({ index: 0, animated: true });
                setActiveIndex(0);
            }
        }, 5000); // 5 Seconds loop

        return () => clearInterval(interval);
    }, [activeIndex]);

    // Handle Manual Scroll
    const onViewRef = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    });
    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

    if (isAuthenticated) {
        return <Redirect href="/(tabs)" />;
    }

    const renderItem = ({ item }: { item: typeof slides[0] }) => (
        <View style={styles.carouselItem}>
            <View style={styles.imageWrapper}>
                <Image
                    source={require('../assets/images/welcome-hero.png')}
                    style={styles.heroImage}
                    resizeMode="cover"
                />
                {/* Gradient Overlay simulated */}
                <View style={styles.gradientOverlay} />

                {/* Scanning UI Overlay */}
                <View style={styles.scanOverlay}>
                    <View style={[styles.scanBox, { borderColor: item.overlayColor }]}>
                        <View style={[styles.corner, styles.cornerTL, { borderColor: item.boxColor }]} />
                        <View style={[styles.corner, styles.cornerTR, { borderColor: item.boxColor }]} />
                        <View style={[styles.corner, styles.cornerBL, { borderColor: item.boxColor }]} />
                        <View style={[styles.corner, styles.cornerBR, { borderColor: item.boxColor }]} />

                        <View style={styles.floatingTag}>
                            <Ionicons name={item.tagIcon} size={14} color="#111811" />
                            <Text style={styles.floatingTagText}>{item.tagText}</Text>
                        </View>

                        <View style={[styles.calorieTag, { backgroundColor: item.boxColor }]}>
                            <Text style={styles.calorieTagText}>{item.boxText}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.mainContent}>

                {/* Hero Card Carousel */}
                <View style={styles.heroContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={slides}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onViewableItemsChanged={onViewRef.current}
                        viewabilityConfig={viewConfigRef.current}
                        scrollEventThrottle={16}
                    />

                    {/* Pagination Dots */}
                    <View style={styles.pagination}>
                        {slides.map((_, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    flatListRef.current?.scrollToIndex({ index, animated: true });
                                    setActiveIndex(index);
                                }}
                            >
                                <View style={[styles.dot, activeIndex === index && styles.activeDot]} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Nutrition in a Snap</Text>
                    <Text style={styles.subtitle}>
                        Ditch the manual entry. Our AI analyzes your meal instantly to track calories and macros with just one photo.
                    </Text>
                </View>

                {/* Footer Actions */}
                <View style={styles.footer}>
                    <Button
                        title="Get Started"
                        onPress={() => router.push('/(auth)/login')}
                        size="lg"
                        style={styles.ctaButton}
                    />
                    <View style={styles.loginRow}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text style={styles.loginLink}>Log in</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
            {/* Decorative Background Elements */}
            <View style={styles.blobTop} />
            <View style={styles.blobBottom} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        zIndex: 10,
    },
    heroContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    carouselItem: {
        width: SCREEN_WIDTH,
        alignItems: 'center',
        paddingHorizontal: 24, // Account for main content padding logic
    },
    imageWrapper: {
        width: SCREEN_WIDTH - 48, // Full width minus padding
        aspectRatio: 4 / 5,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        backgroundColor: '#FFFFFF',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    scanOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanBox: {
        width: '75%',
        height: '75%',
        borderWidth: 1,
        borderRadius: 16,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderWidth: 3,
    },
    cornerTL: { top: -2, left: -2, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 12 },
    cornerTR: { top: -2, right: -2, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 12 },
    cornerBL: { bottom: -2, left: -2, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 12 },
    cornerBR: { bottom: -2, right: -2, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 12 },
    floatingTag: {
        position: 'absolute',
        top: -16,
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    floatingTagText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#111811',
        letterSpacing: 0.5,
    },
    calorieTag: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    calorieTagText: {
        color: '#111811', // Dark text on bright backgrounds (yellow, light blue, lime)
        fontWeight: 'bold',
        fontSize: 12,
    },
    pagination: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 0,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
    },
    activeDot: {
        width: 24,
        backgroundColor: Colors.dark.primary,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 32,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111811',
        textAlign: 'center',
        marginBottom: 12,
        fontFamily: 'InterBold',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: 'Inter',
        paddingHorizontal: 16,
    },
    footer: {
        marginTop: 'auto',
        marginBottom: 24,
        paddingHorizontal: 24,
    },
    ctaButton: {
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginText: {
        color: '#6B7280',
        fontSize: 14,
    },
    loginLink: {
        color: '#111811',
        fontWeight: 'bold',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    blobTop: {
        position: 'absolute',
        top: -80,
        right: -80,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        zIndex: 0,
    },
    blobBottom: {
        position: 'absolute',
        bottom: -80,
        left: -80,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        zIndex: 0,
    },
});
