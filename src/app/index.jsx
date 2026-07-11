import React, { useRef, useState, useEffect } from "react";
import { View, BackHandler } from "react-native";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";
import ReactNativeBlobUtil from "react-native-blob-util";


export default function Home() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true; // Prevent app from closing
      }
      return false; // Exit app if no WebView history
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => subscription.remove();
  }, [canGoBack]);


  const downloadFile = async (url) => {
    try {
      await ReactNativeBlobUtil.config({
        fileCache: false,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: "Loan_Form.pdf",
          description: "Downloading PDF",
          mime: "application/pdf",
        },
      }).fetch("GET", url);
    } catch (err) {
      console.log("Download Error:", err);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: "https://emi-goldy.vercel.app" }}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowUniversalAccessFromFileURLs
        mixedContentMode="always"
        originWhitelist={["*"]}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={(request) => {
          const url = request.url;

          if (
            url.startsWith("tel:") ||
            url.startsWith("mailto:") ||
            url.startsWith("sms:") ||
            url.startsWith("whatsapp:")
          ) {
            Linking.openURL(url);
            return false;
          }

          // Download PDF from Vercel Blob (or any direct PDF URL)
          if (
            url.endsWith(".pdf") ||
            url.includes("blob.vercel-storage.com")
          ) {
            downloadFile(url);
            return false;
          }

          return true;
        }}
      />
    </View>
  );
}