import { Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>WELCOME TO THE APP</Text>
    </View>
  );
}


import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d9c9ce",
  },
  text: {
    fontSize: 36,
    color: "#333",
  },
});