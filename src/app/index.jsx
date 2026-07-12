import React, { useRef, useState, useEffect } from "react";
import { View, BackHandler } from "react-native";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";
import ReactNativeBlobUtil from "react-native-blob-util";


export default function Home() {
  const webViewRef = useRef(null);
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

const month = date.toLocaleString("en-US", { month: "long" }); // July
const day = date.getDate(); // 12
const year = date.getFullYear(); // 2026


    // Get filename from URL
    let fileName = url.split("/").pop().split("?")[0];

    // If URL doesn't contain a filename
    if (!fileName.endsWith(".pdf")) {
      fileName =`Loan_Form_${day}_${month}_${year}.pdf`;
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
    alert(`Downloaded successfully!\n${res.path()}`);
  } catch (err) {
    console.log("Download Error:", err);
    alert("Download failed!");
  }
};

  return (
    <View style={{ flex: 1,backgroundColor:"purple" }}>
      <WebView
        source={{ uri: "https://emi-goldy.vercel.app" }}
        style={{flex:1,marginTop:34}}
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