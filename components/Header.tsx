import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Text,
  GestureResponderEvent,
  ImageSourcePropType,
} from "react-native";
import { images, colors } from "../res";
import { CustomMenu } from "./CustomMenu";
import BackgroundProgress from "./BackgroundProgress";
import { ExtraMenuItem } from "..";

type HeaderProps = {
  backgroundColor: string;
  title: string;
  contentType: "dark" | "light";
  onPressClose: (event: GestureResponderEvent) => void;
  url: string;
  openBrowserTitle: string;
  copyLinkTitle: string;
  extraMenuItems?: ExtraMenuItem[];
  backgroundProgressRefOnChange: React.RefObject<BackgroundProgress>;
  canGoBack: boolean;
  canGoForward: boolean;
  navigationVisible: boolean;
  onPressBack: (event: GestureResponderEvent) => void;
  onPressForward: (event: GestureResponderEvent) => void;
  closeIcon?: ImageSourcePropType;
};

export const Header = ({
  backgroundColor,
  title,
  contentType,
  onPressClose,
  url,
  openBrowserTitle,
  copyLinkTitle,
  extraMenuItems,
  backgroundProgressRefOnChange,
  canGoBack,
  canGoForward: canForward,
  navigationVisible,
  onPressBack,
  onPressForward,
  closeIcon,
}: HeaderProps) => {
  let forward;
  let back;
  if (!canGoBack) back = images.backDisabled;
  else if (contentType == "light") back = images.backLight;
  else back = images.backDark;

  if (!canForward) forward = images.forwardDisabled;
  else if (contentType == "light") forward = images.forwardLight;
  else forward = images.forwardDark;
  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <Icon
        onPress={onPressClose}
        content={
          closeIcon
            ? closeIcon
            : contentType === "light"
            ? images.closeLight
            : images.closeDark
        }
      />
      {navigationVisible && <Icon onPress={onPressBack} content={back} />}
      <BackgroundProgress
        content={contentType}
        ref={backgroundProgressRefOnChange}
      />
      <View style={styles.body}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            {
              color:
                contentType === "light"
                  ? colors.defaultBackground
                  : colors.dark,
            },
          ]}
        >
          {title}
        </Text>
        <Text numberOfLines={1} style={[styles.subtitle]}>
          {url}
        </Text>
      </View>
      {navigationVisible && <Icon onPress={onPressForward} content={forward} />}
      <View>
        <CustomMenu
          extraMenuItems={extraMenuItems}
          contentType={contentType}
          openBrowserTitle={openBrowserTitle}
          copyLinkTitle={copyLinkTitle}
          url={url}
        />
      </View>
    </View>
  );
};

type IconProps = {
  onPress?: (event: GestureResponderEvent) => void;
  content: ImageSourcePropType;
};

const Icon = ({ onPress, content }: IconProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconButton}>
      {<Image source={content} style={styles.icon} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    height: Platform.OS == "android" ? 20 : 30,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    borderBottomColor: colors.lightGray,
    borderBottomWidth: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
  },
  body: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
  },
  subtitle: {
    fontSize: 12,
    color: colors.lightGray,
    fontWeight: "bold",
  },
});
