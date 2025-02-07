import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    color: "#0057B7",
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
    color: "#333",
  },
  detailsCard: {
    backgroundColor: "#D9EAFD",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 50,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#aac4f0",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailsColumn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsKey: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginRight: 5,
    flexShrink: 0,
  },
  detailsValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    flexShrink: 1,
  },
  feedbackContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  feedbackTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0057B7",
  },
  roundfeedbackText: {
    fontSize: 12,
    color: "#333",
    marginTop: 30,
  },
  feedbackText: {
    fontSize: 12,
    color: "#333",
    marginTop: 5,
  },
  greyBackground: {
    backgroundColor: "#D9EAFD",
  },
  whiteBackground: {
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 80,
    height: 24,
    marginBottom: 10,
    alignSelf: "flex-end",
  },
  chart: {
    marginTop: 20,
    width: "100%",
    height: 350,
  },
  linechart: {
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
    height: 200,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555", 
    textAlign: "center",
  },
});

export default styles;