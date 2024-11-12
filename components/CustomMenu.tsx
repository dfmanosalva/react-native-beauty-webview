import React, { useRef, useState } from "react";
import Menu from "./Menu";
import MenuItem from "./MenuItem";
import MenuDivider from "./MenuDivider";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  View,
  GestureResponderEvent,
  Alert,
} from "react-native";
import { images } from "../res";
import Clipboard from "@react-native-community/clipboard";
import { ExtraMenuItem } from "..";

type CustomMenuProps = {
  contentType: "dark" | "light";
  openBrowserTitle: string;
  copyLinkTitle: string;
  url: string;
  extraMenuItems?: ExtraMenuItem[];
};

export const CustomMenu = ({
  contentType,
  openBrowserTitle,
  copyLinkTitle,
  url,
  extraMenuItems,
}: CustomMenuProps) => {
  const menu = useRef<Menu>(null);

  const hideMenu = () => {
    if (menu.current) {
      menu.current.hide();
    }
  };

  const onPressCopy = () => {
    Clipboard.setString(url);
    hideMenu();
  };

  const onPressOpenBrowser = () => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("No se puede abrir la URL: " + url);
      }
    });
    hideMenu();
  };

  const openMenu = () => {
    if (menu.current) {
      menu.current.show();
    }
  };

  const renderExtraMenuItems: (
    value: ExtraMenuItem,
    index: number,
    array: ExtraMenuItem[]
  ) => React.JSX.Element = (res, i) => {
    return (
      <View key={i}>
        <MenuDivider />
        <MenuItem
          onPress={(event) => {
            if (res.onPress) {
              res.onPress(event);
            }
            hideMenu();
          }}
        >
          {res.title}
        </MenuItem>
      </View>
    );
  };

  return (
    <Menu
      ref={menu}
      button={<MenuButton onPress={openMenu} contentType={contentType} />}
    >
      <MenuItem onPress={onPressOpenBrowser}>{openBrowserTitle}</MenuItem>
      <MenuDivider />
      <MenuItem onPress={onPressCopy}>{copyLinkTitle}</MenuItem>
      {extraMenuItems &&
        extraMenuItems.length > 0 &&
        extraMenuItems.map(renderExtraMenuItems)}
    </Menu>
  );
};

type MenuButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
  contentType: "dark" | "light";
};

const MenuButton = ({ onPress, contentType }: MenuButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconButton}>
      <Image
        source={contentType === "light" ? images.menuLight : images.menuDark}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
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
});
