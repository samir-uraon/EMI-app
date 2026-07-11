import { View } from "react-native";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";

export default function Home() {
  return (
    <View style={{ flex: 1,backgroundColor:"purple"}}>
      <WebView
        source={{ uri: "https://emi-goldy.vercel.app" }}
        style={{ flex: 1, marginTop: 32  }}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        onShouldStartLoadWithRequest={(request) => {
          const url = request.url;

          // Allow your own website inside WebView
          if (url.startsWith("https://emi-goldy.vercel.app")) {
            return true;
          }

          // Open external apps
          if (
            url.startsWith("tel:") ||
            url.startsWith("mailto:") ||
            url.startsWith("upi:") ||
            url.startsWith("intent:") ||
            url.startsWith("https://wa.me") ||
            url.startsWith("https://api.whatsapp.com") ||
            url.startsWith("https://maps.google.com") ||
            url.startsWith("https://www.google.com/maps")
          ) {
            Linking.openURL(url);
            return false;
          }

          // Open all other external links in browser
          Linking.openURL(url);
          return false;
        }}
      />
    </View>
  );
}