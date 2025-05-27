import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';

export default function SplashScreen({ onAnimationEnd }) {
    const opacity = useSharedValue(1);
    const scale = useSharedValue(0.8);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    useEffect(() => {
        scale.value = withTiming(1, {
            duration: 800,
            easing: Easing.out(Easing.exp),
        });

        opacity.value = withTiming(
            0,
            { duration: 600, delay: 5000 },
            (finished) => {
                if (finished) runOnJS(onAnimationEnd)();
            }
        );
    }, []);

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Image source={require('../../assets/splash.png')} style={styles.logo} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
});
