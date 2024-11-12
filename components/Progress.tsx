import { Animated, StyleSheet, useAnimatedValue } from "react-native";
import React, { useImperativeHandle, forwardRef } from "react";
import { colors } from "../res";

type ProgressProps = {
  height: number;
  color: string;
  duration?: number;
};

type Progress = {
  startAnimation: (value: number) => void;
};

const Progress = forwardRef<Progress, ProgressProps>(
  ({ height, color, duration = 100 }, ref) => {
    const animated = useAnimatedValue(0);
    const animatedHeight = useAnimatedValue(height || 3);

    const startAnimation = (toValue: number) => {
      if (toValue <= 0.12) show();
      Animated.timing(animated, {
        toValue: toValue,
        duration: duration,
        useNativeDriver: false,
      }).start();
      if (toValue == 1) {
        setTimeout(() => {
          hide();
        }, duration);
      }
    };

    const show = () => {
      Animated.timing(animatedHeight, {
        toValue: height || 3,
        duration: 50,
        useNativeDriver: false,
      }).start();
    };

    const hide = () => {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start();

      setTimeout(() => {
        animated.setValue(0);
      }, 120);
    };

    useImperativeHandle(
      ref,
      () => ({
        startAnimation,
      }),
      [startAnimation]
    );

    return (
      <Animated.View style={[styles.container, { height: animatedHeight }]}>
        <Animated.View
          style={{
            ...styles.inner,
            flex: animated,
            backgroundColor: color || colors.progress,
          }}
        />
      </Animated.View>
    );
  }
);

export default Progress;

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    flexDirection: "row",
  },
  inner: {
    alignSelf: "stretch",
  },
});
