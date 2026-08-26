import { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";

import { AppCard } from "@/components/app-card";
import { EmptyState } from "@/components/empty-state";
import { PrimaryButton } from "@/components/primary-button";
import { SectionTitle } from "@/components/section-title";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { shareLocalBackup } from "@/lib/export-data";
import { loadAppData } from "@/lib/local-data";
import { calculateAverageTemperature, calculateMetricAverages, getDataForPeriod } from "@/lib/reports";
import { AppData, EMPTY_APP_DATA } from "@/shared/records";
import { ScreenContainer } from "@/components/screen-container";

type Period = 7 | 30 | 90;

export default function ReportsScreen() {
  const [data, setData] = useState<AppData>(EMPTY_APP_DATA);
  const [period, setPeriod] = useState<Period>(30);
  const [exporting, setExporting] = useState(false);

  useFocusEffect(useCallback(() => { loadAppData().then(setData); }, []));

  const filtered = useMemo(() => getDataForPeriod(data, period), [data, period]);
  const averages = useMemo(() => calculateMetricAverages(filtered.healthEntries), [filtered.healthEntries]);
  const averageTemperature = useMemo(() => calculateAverageTemperature(filtered.weatherEntries), [filtered.weatherEntries]);
  const hasData = filtered.healthEntries.length + filtered.weatherEntries.length + filtered.calendarEntries.length > 0;

  const exportData = async () => {
    if (!hasData) return;
    setExporting(true);
    try {
      await shareLocalBackup(data);
    } catch (error) {
      Alert.alert("Não foi possível exportar", error instanceof Error ? error.message : "Tente novamente em alguns instantes.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScreenContainer className="px-5" containerClassName="bg-background">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionTitle eyebrow="Síntese no aparelho" title="Relatórios" detail="Resultados calculados localmente, sem envio de seus registros." />
        <View style={styles.periodRow}>
          <PeriodButton label="7 dias" selected={period === 7} onPress={() => setPeriod(7)} />
          <PeriodButton label="30 dias" selected={period === 30} onPress={() => setPeriod(30)} />
          <PeriodButton label="90 dias" selected={period === 90} onPress={() => setPeriod(90)} />
        </View>
        {hasData ? (
          <>
            <View style={styles.summaryGrid}>
              <SummaryCard label="Saúde" value={String(filtered.healthEntries.length)} detail="registros" color="#3F8D72" />
              <SummaryCard label="Clima" value={String(filtered.weatherEntries.length)} detail="capturas" color="#D79127" />
              <SummaryCard label="Agenda" value={String(filtered.calendarEntries.length)} detail="eventos" color="#6966B3" />
            </View>
            {averages.length ? <HealthReport averages={averages} /> : null}
            {filtered.weatherEntries.length ? <View style={styles.gap}><AppCard title="Clima registrado" tone="weather"><Text style={styles.weatherMetric}>{averageTemperature?.toFixed(1)}°C</Text><Text style={styles.weatherDetail}>Temperatura média das observações no período selecionado.</Text></AppCard></View> : null}
            {filtered.calendarEntries.length ? <View style={styles.gap}><AppCard title="Agenda no período" tone="calendar"><Text style={styles.weatherMetric}>{filtered.calendarEntries.length}</Text><Text style={styles.weatherDetail}>Evento{filtered.calendarEntries.length === 1 ? "" : "s"} com início dentro do período selecionado.</Text></AppCard></View> : null}
            <View style={styles.exportSection}>
              <Text style={styles.exportTitle}>Cópia dos seus dados</Text>
              <Text style={styles.exportDetail}>Gere um arquivo JSON para guardar ou compartilhar por um canal que você escolher.</Text>
              <PrimaryButton label="Exportar dados locais" variant="subtle" onPress={exportData} loading={exporting} />
            </View>
          </>
        ) : (
          <EmptyState icon={<IconSymbol name="chart.bar.fill" size={25} color="#176B87" />} title="Ainda não há dados neste período" description="Adicione registros de saúde, clima ou eventos para ver um resumo por intervalo." />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function HealthReport({ averages }: { averages: ReturnType<typeof calculateMetricAverages> }) {
  return <AppCard title="Métricas de saúde" tone="health"><View style={styles.tableHead}><Text style={styles.tableHeadText}>MÉTRICA</Text><Text style={styles.tableHeadText}>MÉDIA</Text></View>{averages.map((metric) => <View key={`${metric.metricName}-${metric.unit}`} style={styles.metricRow}><View><Text style={styles.metricName}>{metric.metricName}</Text><Text style={styles.metricCount}>{metric.count} registro{metric.count === 1 ? "" : "s"}</Text></View><Text style={styles.average}>{metric.average.toFixed(1)} {metric.unit}</Text></View>)}</AppCard>;
}

function PeriodButton({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) { return <TouchableOpacity onPress={onPress} style={[styles.periodButton, selected && styles.periodButtonSelected]}><Text style={[styles.periodText, selected && styles.periodTextSelected]}>{label}</Text></TouchableOpacity>; }
function SummaryCard({ label, value, detail, color }: { label: string; value: string; detail: string; color: string }) { return <View style={[styles.summaryCard, { borderTopColor: color }]}><Text style={styles.summaryLabel}>{label}</Text><Text style={styles.summaryValue}>{value}</Text><Text style={styles.summaryDetail}>{detail}</Text></View>; }

const styles = StyleSheet.create({
  content: { paddingBottom: 28, paddingTop: 10 }, periodRow: { backgroundColor: "#EAF0F2", borderRadius: 14, flexDirection: "row", marginBottom: 18, padding: 4 }, periodButton: { alignItems: "center", borderRadius: 10, flex: 1, justifyContent: "center", minHeight: 38 }, periodButtonSelected: { backgroundColor: "#176B87" }, periodText: { color: "#60747C", fontSize: 13, fontWeight: "700" }, periodTextSelected: { color: "#FFFFFF" }, summaryGrid: { flexDirection: "row", gap: 8, marginBottom: 14 }, summaryCard: { backgroundColor: "#FFFFFF", borderColor: "#E2E9EC", borderRadius: 16, borderTopWidth: 4, borderWidth: 1, flex: 1, minHeight: 102, padding: 11 }, summaryLabel: { color: "#60747C", fontSize: 12, fontWeight: "700" }, summaryValue: { color: "#152A33", fontSize: 26, fontWeight: "800", marginTop: 7 }, summaryDetail: { color: "#789098", fontSize: 11, marginTop: 1 }, tableHead: { flexDirection: "row", justifyContent: "space-between", paddingBottom: 7 }, tableHeadText: { color: "#789098", fontSize: 10, fontWeight: "800", letterSpacing: 0.8 }, metricRow: { alignItems: "center", borderTopColor: "#ECF0F2", borderTopWidth: 1, flexDirection: "row", justifyContent: "space-between", paddingVertical: 12 }, metricName: { color: "#152A33", fontSize: 15, fontWeight: "700" }, metricCount: { color: "#789098", fontSize: 12, marginTop: 3 }, average: { color: "#3F8D72", fontSize: 15, fontWeight: "800" }, gap: { height: 12 }, weatherMetric: { color: "#152A33", fontSize: 30, fontWeight: "800" }, weatherDetail: { color: "#60747C", fontSize: 13, lineHeight: 20, marginTop: 5 }, exportSection: { backgroundColor: "#EAF4F7", borderRadius: 20, marginTop: 14, padding: 16 }, exportTitle: { color: "#152A33", fontSize: 16, fontWeight: "800" }, exportDetail: { color: "#526873", fontSize: 13, lineHeight: 19, marginBottom: 14, marginTop: 5 },
});
