import { View } from "react-native";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";

export default function Home() {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: "https://emi-goldy.vercel.app" }}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowUniversalAccessFromFileURLs
        mixedContentMode="always"
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

          return true;
        }}
      />
    </View>
  );
}