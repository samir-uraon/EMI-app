import React, { useRef, useState, useEffect } from "react";
import { View, BackHandler, Alert } from "react-native"; // Switched to Alert
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";
import ReactNativeBlobUtil from "react-native-blob-util";

export default function Home() {
  const webViewRef = useRef(null); // 1. Created here...
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (webViewRef.current && canGoBack) {
          webViewRef.current.goBack();
          return true;
        }
        return false; // Exit app if no page history
      }
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  const downloadFile = async (url) => {
    try {
      const { fs } = ReactNativeBlobUtil;
      const date = new Date();
      const month = date.toLocaleString("en-US", { month: "long" });
      const day = date.getDate();
      const year = date.getFullYear();

      // Clean up filename from URL
      let fileName = url.split("/").pop().split("?")[0];

      if (!fileName.endsWith(".pdf")) {
        // Avoided spaces in filename just to keep Android DownloadManager happy
        fileName = `Loan_Form_${day}_${month}_${year}.pdf`;
      }

      const path = `${fs.dirs.DownloadDir}/${fileName}`;

      const res = await ReactNativeBlobUtil.config({
        fileCache: false,
        path,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: fileName,
          description: "Downloading PDF...",
          mime: "application/pdf",
          path,
        },
      }).fetch("GET", url);

      console.log("Downloaded:", res.path());
      Alert.alert("Success", `Downloaded successfully!\nSaved to Downloads folder.`);
    } catch (err) {
      console.log("Download Error:", err);
      Alert.alert("Error", "Download failed!");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "purple" }}>
      <WebView
        ref={webViewRef} // 2. ...FIXED: Attached here!
        source={{ uri: "https://emi-goldy.vercel.app" }}
        style={{ flex: 1, marginTop: 34 }}
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

          // Intercept PDF or Vercel Blob downloads
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