import { StyleSheet } from "@react-pdf/renderer";

/** U8.5 — Professional educational report styling */
export const reportPdfStyles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
    color: "#1a1a2e",
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 12,
  },
  brand: {
    fontSize: 9,
    color: "#2563eb",
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: "#64748b",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: "38%",
    color: "#64748b",
    fontSize: 9,
  },
  value: {
    width: "62%",
    fontWeight: "bold",
    fontSize: 10,
  },
  bulletList: {
    marginTop: 4,
    marginLeft: 8,
  },
  bullet: {
    fontSize: 9,
    marginBottom: 3,
    color: "#334155",
  },
  emptyNote: {
    fontSize: 9,
    color: "#64748b",
    fontStyle: "italic",
    marginTop: 4,
  },
  highlightBox: {
    backgroundColor: "#f0f7ff",
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  highlightTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  statCell: {
    width: "30%",
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 4,
  },
  statLabel: {
    fontSize: 8,
    color: "#64748b",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
  },
  nextStep: {
    marginBottom: 6,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#2563eb",
  },
  nextStepTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  nextStepReason: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
});

export const REPORT_PDF_COLORS = {
  primary: "#2563eb",
  text: "#1a1a2e",
  muted: "#64748b",
  border: "#e2e8f0",
  surface: "#f8fafc",
} as const;
