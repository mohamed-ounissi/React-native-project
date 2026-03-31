import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E4E7EC",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 16,
    gap: 10,
  },
  navItem: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F4F7",
  },
  navItemActive: {
    backgroundColor: "#2563EB",
  },
  navLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#344054",
  },
  navLabelActive: {
    color: "#FFFFFF",
  },
});
