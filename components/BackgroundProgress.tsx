import { Animated, StyleSheet, View, useAnimatedValue } from "react-native";
import React, { useImperativeHandle, forwardRef } from "react";

type BackgroundProgressProps = {
  content?: "dark" | "light";
  duration?: number;
};

type BackgroundProgress = {
  startAnimation: (value: number) => void;
};

const BackgroundProgress = forwardRef<
  BackgroundProgress,
  BackgroundProgressProps
>(({ content, duration = 100 }, ref) => {
  const animated = useAnimatedValue(0);

  const startAnimation = (toValue: number) => {
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

  const hide = () => {
    animated.setValue(0);
  };

  useImperativeHandle(
    ref,
    () => ({
      startAnimation,
    }),
    [startAnimation]
  );

  return (
    <View style={[styles.container]}>
      <Animated.View
        style={{
          ...styles.inner,
          flex: animated,
          backgroundColor:
            content === "light" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
        }}
      />
    </View>
  );
});

export default BackgroundProgress;

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    flexDirection: "row",
  },
  inner: {
    alignSelf: "stretch",
  },
});
