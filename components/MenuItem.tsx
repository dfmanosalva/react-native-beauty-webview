import React from "react";

import {
  GestureResponderEvent,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

type Props = TouchableOpacityProps & {
  disabledTextColor?: string;
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const MenuItem = ({
  children,
  disabled,
  disabledTextColor = "#bdbdbd",
  ellipsizeMode = Platform.OS === "ios" ? "clip" : "tail",
  style,
  textStyle,
  ...props
}: Props) => {
  return (
    <TouchableOpacity {...props}>
      <View style={[styles.container, style]}>
        <Text
          ellipsizeMode={ellipsizeMode}
          numberOfLines={1}
          style={[
            styles.title,
            disabled && { color: disabledTextColor },
            textStyle,
          ]}
        >
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    justifyContent: "center",
    maxWidth: 248,
    minWidth: 124,
  },
  title: {
    fontSize: 14,
    fontWeight: "400",
    paddingHorizontal: 16,
    textAlign: "left",
  },
});

export default MenuItem;
