import { StyleSheet } from "react-native";
import { theme } from "./theme";

const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.Colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  title: {
    color: theme.Colors.text.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.Colors.surface,
  },
  optionText: {
    color: theme.Colors.text.primary,
    fontSize: 16,
  },
});

export default settingsStyles;
