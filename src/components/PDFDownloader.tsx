import { TPdfData } from "@/types/common";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1px solid #ccc",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#555",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    backgroundColor: "#f5f5f5",
    padding: 5,
  },
  questionRow: {
    flexDirection: "row",
    marginBottom: 8,
    borderBottom: "1px solid #eee",
    paddingBottom: 8,
    rowGap: 8,
  },
  question: {
    fontSize: 12,
    fontWeight: "bold",
    width: "70%",
  },
  answer: {
    fontSize: 12,
    width: "30%",
  },
  timestamp: {
    fontSize: 10,
    color: "#777",
    marginTop: 20,
    textAlign: "right",
  },
  patientInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  infoItem: {
    width: "30%",
  },
  infoLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

interface PdfDocumentProps {
  data: TPdfData;
}
export default function PdfDocument({ data }: PdfDocumentProps) {
  const { patient, procedure, date, qa } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Aspire Consent Form</Text>
          <Text style={styles.subtitle}>Confidential Patient Document</Text>
        </View>

        <View style={styles.patientInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Patient Name</Text>
            <Text style={styles.infoValue}>{patient}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Procedure</Text>
            <Text style={styles.infoValue}>{procedure}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>
              {new Date(date).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questions & Answers</Text>
          {qa.map((item, index) => (
            <View key={index} style={styles.questionRow}>
              <Text style={styles.question}>{item.question}</Text>
              <Text style={styles.answer}>{item.answer}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timestamps</Text>
          <Text style={styles.timestamp}>
            Document generated on: {new Date().toLocaleString()}
          </Text>
          {data.timestamps &&
            data.timestamps.map((ts, i) => (
              <Text key={i} style={styles.timestamp}>
                {ts.event}: {new Date(ts.time).toLocaleString()}
              </Text>
            ))}
        </View>
      </Page>
    </Document>
  );
}
