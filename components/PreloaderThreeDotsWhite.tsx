import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function AnimatedSVGPath() {
  const animatedValues = useRef([...Array(3)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = animatedValues.map((value, index) =>
      Animated.timing(value, {
        toValue: 1,
        duration: 3000,
        delay: index * 660,
        useNativeDriver: true,
        isInteraction: false,
      })
    );

    Animated.loop(Animated.sequence(animations)).start();
  }, []);

  return (
    <View>
      <Svg width={24} height={24} viewBox="0 0 24 24">
        {animatedValues.map((value, index) => (
          <Circle
            key={index}
            cx={index * 6 + 6}
            cy={12}
            r={value.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 2, 0],
            })}
            fill="white"
          />
        ))}
      </Svg>
    </View>
  );
}
