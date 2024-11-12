import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Modal, ImageSourcePropType } from "react-native";
import { WebView, WebViewNavigation, WebViewProps } from "react-native-webview";
import { Header } from "./components/Header";
import Progress from "./components/Progress";
import { colors } from "./res";
import { GestureResponderEvent, Image } from "react-native/types";
import { useRef } from "react";
import BackgroundProgress from "./components/BackgroundProgress";

export type ExtraMenuItem = {
  onPress?: (event: GestureResponderEvent) => void;
  title: string;
};

export type Props = WebViewProps & {
  visible: boolean;
  onPressClose: () => void;
  url: string;
  backgroundColor?: string;
  headerContent?: "dark" | "light";
  headerBackground?: string;
  progressColor?: string;
  progressHeight?: number;
  loadingText?: string;
  copyLinkTitle?: string;
  openBrowserTitle?: string;
  extraMenuItems?: ExtraMenuItem[];
  animationType?: "slide" | "none" | "fade";
  progressBarType?: "normal" | "background";
  navigationVisible?: boolean;
  closeIcon?: ImageSourcePropType;
  onGoBack?: () => void;
  onGoForward?: () => void;
  incognito?: boolean;
};

const BeautyWebView = ({
  visible,
  onPressClose,
  backgroundColor = colors.defaultBackground,
  headerContent = "dark",
  headerBackground = colors.defaultBackground,
  url,
  progressColor = colors.progress,
  progressHeight = 4,
  loadingText = "Loading...",
  copyLinkTitle = "Copy Link",
  openBrowserTitle = "Open on Browser",
  extraMenuItems,
  animationType = "slide",
  progressBarType = "normal",
  navigationVisible = true,
  closeIcon,
  onGoBack,
  onGoForward,
}: Props) => {
  const progressRef = useRef<Progress>(null);
  const backgroundProgressRef = useRef<BackgroundProgress>(null);
  const [title, setTitle] = useState(loadingText);
  const [backQueue, setBackQueue] = useState<string[]>([]);
  const [forwardQueue, setForwardQueue] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState(url);

  const onProgress = (progress: number) => {
    progressRef?.current?.startAnimation(progress);
    progressBarType === "background" &&
      backgroundProgressRef?.current?.startAnimation(progress);
  };

  const onNavigationStateChange: ((event: WebViewNavigation) => void) &
    ((event: WebViewNavigation) => void) &
    ((event: any) => void) = (event) => {
    if (currentUrl === event.url) return;
    backQueue.push(currentUrl);
    setBackQueue(backQueue);
    onGoForward && onGoForward();
    setCurrentUrl(event.url);
  };

  const onPressBack = () => {
    if (backQueue.length == 0) return;
    const newUrl = backQueue[backQueue.length - 1];
    forwardQueue.push(currentUrl);
    setForwardQueue(forwardQueue);
    onGoBack && onGoBack();
    backQueue.pop();
    setBackQueue(backQueue);
    setCurrentUrl(newUrl);
  };

  const onPressForward = () => {
    if (forwardQueue.length == 0) return;
    const newUrl = forwardQueue[forwardQueue.length - 1];
    backQueue.push(currentUrl);
    setBackQueue(backQueue);
    forwardQueue.pop();
    setForwardQueue(forwardQueue);
    setCurrentUrl(newUrl);
    onGoForward && onGoForward();
  };

  const onClose = () => {
    onPressClose && onPressClose();
    setTimeout(() => {
      setBackQueue([]);
      setForwardQueue([]);
      setCurrentUrl(url);
    }, 200);
  };

  return (
    <Modal visible={visible} transparent={false} animationType={animationType}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: backgroundColor }]}
      >
        <Header
          backgroundColor={headerBackground}
          contentType={headerContent}
          title={title}
          url={currentUrl}
          onPressClose={onClose}
          copyLinkTitle={copyLinkTitle}
          openBrowserTitle={openBrowserTitle}
          extraMenuItems={extraMenuItems}
          backgroundProgressRefOnChange={backgroundProgressRef}
          navigationVisible={navigationVisible}
          canGoForward={forwardQueue.length > 0}
          canGoBack={backQueue.length > 0}
          onPressBack={onPressBack}
          onPressForward={onPressForward}
          closeIcon={closeIcon}
        />
        {progressBarType === "normal" && (
          <Progress
            height={progressHeight}
            color={progressColor}
            ref={progressRef}
          />
        )}
        <WebView
          source={{ uri: currentUrl }}
          onLoadProgress={({ nativeEvent }) => {
            let loadingProgress = nativeEvent.progress;
            onProgress(loadingProgress);
          }}
          injectedJavaScript="window.ReactNativeWebView.postMessage(document.title)"
          onMessage={(event) => setTitle(event.nativeEvent.data)}
          onNavigationStateChange={onNavigationStateChange}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
  },
});

export default BeautyWebView;
