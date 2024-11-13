import {
  Animated,
  Easing,
  I18nManager,
  LayoutChangeEvent,
  Modal,
  Platform,
  StatusBar,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  useAnimatedValue,
  useWindowDimensions,
} from "react-native";
import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { colors } from "../res";

type MenuProps = {
  children: React.ReactNode;
  button: React.ReactNode;
  animationDuration?: number;
  style?: StyleProp<ViewStyle>;
  onHidden?: () => void;
};

type Menu = {
  show: () => void;
  hide: () => void;
};

const STATES = {
  HIDDEN: "HIDDEN",
  ANIMATING: "ANIMATING",
  SHOWN: "SHOWN",
};

const EASING = Easing.bezier(0.4, 0, 0.2, 1);
const SCREEN_INDENT = 8;

const Menu = forwardRef<Menu, MenuProps>(
  ({ button, animationDuration = 300, children, style, onHidden }, ref) => {
    const viewRef = useRef<View>(null);
    const { width: windowWidth, height: windowsHeight } = useWindowDimensions();
    const windowHeight = windowsHeight - (StatusBar.currentHeight || 0);
    const [transforms, setTransforms] = useState<any[]>([]);

    const { isRTL } = I18nManager;

    const [menuState, setMenuState] = useState(STATES.HIDDEN);
    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);
    const [menuWidth, setMenuWidth] = useState(0);
    const [menuHeight, setMenuHeight] = useState(0);
    const [buttonWidth, setButtonWidth] = useState(0);
    const [buttonHeight, setButtonHeight] = useState(0);
    const opacityAnimation = useAnimatedValue(0);
    const menuSizeAnimation = useRef(
      new Animated.ValueXY({ x: 0, y: 0 })
    ).current;

    const menuSize = {
      width: menuSizeAnimation.x,
      height: menuSizeAnimation.y,
    };

    const [menuMounted, setMenuMounted] = useState(false);

    useEffect(() => {
      if (menuState === STATES.ANIMATING) {
        Animated.parallel([
          Animated.timing(menuSizeAnimation, {
            toValue: { x: menuWidth, y: menuHeight },
            duration: animationDuration,
            easing: EASING,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: animationDuration,
            easing: EASING,
            useNativeDriver: false,
          }),
        ]).start();
      } else if (menuState === STATES.HIDDEN) {
        if (onHidden) {
          onHidden();
        }

        if (Platform.OS !== "ios" && onHidden) {
          onHidden();
        }
      }
    }, [menuState]);
    // Start menu animation
    const _onMenuLayout = useCallback((e: LayoutChangeEvent) => {
      if (!menuMounted) {
        if (menuState === STATES.ANIMATING) {
          return;
        }
        const { width, height } = e.nativeEvent.layout;
        setMenuState(STATES.ANIMATING);
        if (width !== menuWidth) {
          setMenuWidth(width);
        }
        if (height !== menuHeight) {
          setMenuHeight(height);
        }
        setMenuMounted(true);
      }
    }, []);

    const _onDismiss = () => {
      if (onHidden) {
        onHidden();
      }
    };

    const show = () => {
      viewRef.current?.measureInWindow(
        (left, top, buttonWidth, buttonHeight) => {
          setButtonHeight(buttonHeight);
          setButtonWidth(buttonWidth);
          setLeft(left);
          setMenuState(STATES.SHOWN);
          setTop(top);
        }
      );
    };

    const hide = (onHidden?: () => void) => {
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: animationDuration,
        easing: EASING,
        useNativeDriver: false,
      }).start(() => {
        // Reset state
        setMenuState(STATES.HIDDEN);
        menuSizeAnimation.setValue({ x: 0, y: 0 });
        opacityAnimation.setValue(0);
      });
    };

    useImperativeHandle(
      ref,
      () => ({
        show,
        hide,
      }),
      [show, hide]
    );

    useEffect(() => {
      if (menuMounted) {
        const transforms1 = [];

        if (
          (isRTL && left + buttonWidth - menuWidth > SCREEN_INDENT) ||
          (!isRTL && left + menuWidth > windowWidth - SCREEN_INDENT)
        ) {
          transforms1.push({
            translateX: Animated.multiply(menuSizeAnimation.x, -1),
          });

          setLeft(Math.min(windowWidth - SCREEN_INDENT, left + buttonWidth));
        } else if (left < SCREEN_INDENT) {
          setLeft(SCREEN_INDENT);
        }

        // Flip by Y axis if menu hits bottom screen border
        if (top > windowHeight - menuHeight - SCREEN_INDENT) {
          transforms1.push({
            translateY: Animated.multiply(menuSizeAnimation.y, -1),
          });

          setTop(windowHeight - SCREEN_INDENT);
          setTop(Math.min(windowHeight - SCREEN_INDENT, top + buttonHeight));
        } else if (top < SCREEN_INDENT) {
          setTop(SCREEN_INDENT);
        }
        setTransforms(transforms1);
      }
    }, [menuMounted]);

    const shadowMenuContainerStyle = {
      opacity: opacityAnimation,
      transform: transforms,
      top,

      // Switch left to right for rtl devices
      ...(isRTL ? { right: left } : { left }),
    };

    return (
      <View ref={viewRef} collapsable={false}>
        <View>{button}</View>

        <Modal
          visible={menuState === STATES.SHOWN || menuState === STATES.ANIMATING}
          onRequestClose={() => {
            hide();
          }}
          supportedOrientations={[
            "portrait",
            "portrait-upside-down",
            "landscape",
            "landscape-left",
            "landscape-right",
          ]}
          transparent
          onDismiss={_onDismiss}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              hide();
            }}
            accessible={false}
          >
            <View style={StyleSheet.absoluteFill}>
              <Animated.View
                onLayout={_onMenuLayout}
                style={[
                  styles.shadowMenuContainer,
                  shadowMenuContainerStyle,
                  style,
                ]}
              >
                <Animated.View
                  style={[
                    styles.menuContainer,
                    menuState === STATES.ANIMATING && menuSize,
                  ]}
                >
                  {children}
                </Animated.View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
);

export default Menu;

const styles = StyleSheet.create({
  shadowMenuContainer: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 4,
    opacity: 0,

    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 2,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  menuContainer: {
    overflow: "hidden",
  },
});
