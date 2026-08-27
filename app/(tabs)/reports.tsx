import { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";

import { AppCard } from "@/components/app-card";
import { EmptyState } from "@/components/empty-state";
import { PrimaryButton } from "@/components/primary-button";
import { SectionTitle } from "@/components/section-title";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { loadAppData } from "@/lib/local-data";
import { sharePainReportPdf } from "@/lib/pain-pdf";
import { buildPainReport } from "@/lib/pain-reports";
import { AppData, EMPTY_APP_DATA, emotionLabel } from "@/shared/records";
import { ScreenContainer } from "@/components/screen-container";

type Period = 7 | 30 | 90;

type ChartData = { labels: string[]; values: number[] };

export default function ReportsScreen() {
  const [data, setData] = useState<AppData>(EMPTY_APP_DATA);
  const [period, setPeriod] = useState<Period>(30);
  const [exporting, setExporting] = useState(false);

  useFocusEffect(useCallback(() => {
    loadAppData().then(setData);
  }, []));

  const report = useMemo(() => buildPainReport(data.painEntries, period), [data.painEntries, period]);
  const medicationsChart = useMemo(() => medicationEffectivenessBuckets(report.entries, data.followUps), [report.entries, data.followUps]);
  const foodsChart = useMemo(() => foodBuckets(report.entries), [report.entries]);
  const emotionsChart = useMemo(() => emotionBuckets(report.entries), [report.entries]);
  const weatherChart = useMemo(() => weatherBuckets(report.entries), [report.entries]);

  const exportData = async () => {
    setExporting(true);
    try {
      await sharePainReportPdf(data, period);
    } catch (error) {
      Alert.alert("Não foi possível exportar", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScreenContainer className="px-5" containerClassName="bg-background">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionTitle eyebrow="Para conversar com seu médico" title="Relatório de dor" detail="Associações observadas nos seus registros. Elas não indicam causa ou diagnóstico." />
        <View style={styles.periodRow}>
          <PeriodButton label="7 dias" selected={period === 7} onPress={() => setPeriod(7)} />
          <PeriodButton label="30 dias" selected={period === 30} onPress={() => setPeriod(30)} />
          <PeriodButton label="90 dias" selected={period === 90} onPress={() => setPeriod(90)} />
        </View>

        {!report.entries.length ? (
          <EmptyState icon={<IconSymbol name="chart.bar.fill" size={25} color="#176B87" />} title="Sem registros neste período" description="Os gráficos ficam disponíveis e serão preenchidos assim que você registrar uma ocorrência." />
        ) : null}

        <View style={styles.summaryGrid}>
          <SummaryCard label="Ocorrências" value={String(report.entries.length)} color="#E98B5A" />
          <SummaryCard label="Intensidade média" value={`${report.intensityAverage.toFixed(1)}/10`} color="#B55735" />
          <SummaryCard label="Com clima" value={String(report.weatherCount)} color="#D79127" />
        </View>

        <ChartCard title="Dor por hora do dia" values={hourBuckets(report.entries)} labels={["0h", "6h", "12h", "18h"]} />
        <View style={styles.gap} />
        <ChartCard title="Dor por dia da semana" values={weekdayBuckets(report.entries)} labels={["D", "S", "T", "Q", "Q", "S", "S"]} />
        <View style={styles.gap} />
        <ChartCard title="Medicamentos e melhora" values={medicationsChart.values} labels={medicationsChart.labels} hint="Percentual de acompanhamentos com melhora registrada" />
        <View style={styles.gap} />
        <ChartCard title="Alimentos associados" values={foodsChart.values} labels={foodsChart.labels} />
        <View style={styles.gap} />
        <ChartCard title="Emoções e intensidade" values={emotionsChart.values} labels={emotionsChart.labels} />
        <View style={styles.gap} />
        <ChartCard title="Clima e intensidade" values={weatherChart.values} labels={weatherChart.labels} />

        <View style={styles.gap} />
        <AppCard title="Locais mais registrados" tone="health">
          {report.sites.length ? <RankList rows={report.sites.slice(0, 5)} /> : <Text style={styles.emptyInline}>Ainda não há locais registrados.</Text>}
        </AppCard>
        {report.conditions.length ? <View style={styles.gap}><AppCard title="Condições informadas" tone="calendar"><Text style={styles.contextNote}>Contexto escolhido por você; não representa uma causa confirmada.</Text><RankList rows={report.conditions.slice(0, 5)} /></AppCard></View> : null}
        <View style={styles.gap} />
        <AppCard title="Padrões observados"><Text style={styles.contextNote}>Compare contagens e intensidade média para conversar com seu médico.</Text>{report.averageIntensityByEmotion.length ? <IntensityList rows={report.averageIntensityByEmotion.slice(0, 5)} /> : <Text style={styles.emptyInline}>Ainda não há emoções suficientes para comparar.</Text>}</AppCard>
        <View style={styles.gap} />
        <AppCard title="Sensações relatadas">{report.types.length ? <RankList rows={report.types.slice(0, 5)} /> : <Text style={styles.emptyInline}>Ainda não há tipos de dor registrados.</Text>}</AppCard>
        {report.symptoms.length ? <View style={styles.gap}><AppCard title="Sintomas locais" tone="health"><RankList rows={report.symptoms.slice(0, 6)} /></AppCard></View> : null}
        <View style={styles.gap} />
        <AppCard title="Regiões de irradiação">{report.radiation.length ? <RankList rows={report.radiation.slice(0, 5)} /> : <Text style={styles.emptyInline}>Nenhuma irradiação informada.</Text>}</AppCard>
        {report.associatedPainCount ? <View style={styles.gap}><AppCard title="Dores relacionadas" tone="calendar"><Text style={styles.bigNumber}>{report.associatedPainCount}</Text><Text style={styles.detail}>Ocorrência{report.associatedPainCount === 1 ? "" : "s"} em que você indicou relação com dor anterior.</Text></AppCard></View> : null}
        <View style={styles.gap} />
        <AppCard title="Emoções no momento" tone="calendar"><IntensityList rows={report.averageIntensityByEmotion.slice(0, 5)} /></AppCard>
        <View style={styles.gap} />
        <AppCard title="Alimentos selecionados" tone="weather">{report.foods.length ? <IntensityList rows={report.foods.slice(0, 6)} /> : <Text style={styles.emptyInline}>Nenhum alimento selecionado nos registros.</Text>}</AppCard>
        {report.medications.length ? <View style={styles.gap}><AppCard title="Medicamentos registrados" tone="calendar"><RankList rows={report.medications.slice(0, 6)} /></AppCard></View> : null}
        {report.weatherAverage !== null ? <View style={styles.gap}><AppCard title="Clima associado" tone="weather"><Text style={styles.bigNumber}>{report.weatherAverage.toFixed(1)}°C</Text><Text style={styles.detail}>Temperatura média nas ocorrências que tiveram captura de clima.</Text></AppCard></View> : null}
        <View style={styles.notice}><IconSymbol name="checkmark.circle.fill" size={20} color="#3F8D72" /><Text style={styles.noticeText}>O relatório descreve o que foi registrado. Leve-o ao profissional de saúde para interpretação clínica.</Text></View>
        <PrimaryButton label="Compartilhar relatório em PDF" variant="subtle" onPress={exportData} loading={exporting} />
      </ScrollView>
    </ScreenContainer>
  );
}

function hourBuckets(entries: AppData["painEntries"]) {
  return Array.from({ length: 24 }, (_, hour) => {
    const items = entries.filter((entry) => new Date(entry.occurredAt).getHours() === hour);
    return items.length ? items.reduce((sum, item) => sum + item.intensity, 0) / items.length : 0;
  });
}

function weekdayBuckets(entries: AppData["painEntries"]) {
  return Array.from({ length: 7 }, (_, day) => {
    const items = entries.filter((entry) => new Date(entry.occurredAt).getDay() === day);
    return items.length ? items.reduce((sum, item) => sum + item.intensity, 0) / items.length : 0;
  });
}

function groupedBuckets(entries: AppData["painEntries"], values: string[], limit = 4) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function medicationEffectivenessBuckets(entries: AppData["painEntries"], followUps: AppData["followUps"]): ChartData {
  const ids = new Set(entries.map((entry) => entry.id));
  const grouped = new Map<string, { improved: number; answered: number }>();
  followUps.filter((followUp) => ids.has(followUp.painEntryId) && followUp.medicationName && followUp.status !== "pending").forEach((followUp) => {
    const name = followUp.medicationName as string;
    const current = grouped.get(name) ?? { improved: 0, answered: 0 };
    current.answered += 1;
    if (followUp.status === "improved") current.improved += 1;
    grouped.set(name, current);
  });
  const rows = Array.from(grouped.entries()).sort((a, b) => b[1].answered - a[1].answered).slice(0, 4);
  return { labels: rows.length ? rows.map(([label]) => label.slice(0, 8)) : ["Sem dados"], values: rows.length ? rows.map(([, value]) => Math.round((value.improved / value.answered) * 100)) : [0] };
}

function foodBuckets(entries: AppData["painEntries"]): ChartData {
  const rows = groupedBuckets(entries, entries.flatMap((entry) => entry.foods).filter((food) => food !== "none"));
  return { labels: rows.length ? rows.map(([label]) => label.slice(0, 8)) : ["Sem dados"], values: rows.length ? rows.map(([, count]) => count) : [0] };
}

function emotionBuckets(entries: AppData["painEntries"]): ChartData {
  const rows = groupedBuckets(entries, entries.flatMap((entry) => entry.emotions?.length ? entry.emotions : [entry.emotion]));
  return {
    labels: rows.length ? rows.map(([id]) => emotionLabel(id).slice(0, 10)) : ["Sem dados"],
    values: rows.length ? rows.map(([id]) => {
      const matching = entries.filter((entry) => (entry.emotions?.length ? entry.emotions : [entry.emotion]).includes(id));
      return matching.length ? matching.reduce((sum, entry) => sum + entry.intensity, 0) / matching.length : 0;
    }) : [0],
  };
}

function weatherBuckets(entries: AppData["painEntries"]): ChartData {
  const groups = [["≤15°", entries.filter((entry) => entry.weather && entry.weather.temperature <= 15)], ["16–25°", entries.filter((entry) => entry.weather && entry.weather.temperature > 15 && entry.weather.temperature <= 25)], [">25°", entries.filter((entry) => entry.weather && entry.weather.temperature > 25)]] as const;
  return { labels: groups.map(([label]) => label), values: groups.map(([, rows]) => rows.length ? rows.reduce((sum, entry) => sum + entry.intensity, 0) / rows.length : 0) };
}

function ChartCard({ title, values, labels, hint = "Média ou contagem dos registros locais" }: { title: string; values: number[]; labels: string[]; hint?: string }) {
  const max = Math.max(1, ...values);
  const shown = labels.length === 4 ? [values[0] ?? 0, values[6] ?? 0, values[12] ?? 0, values[18] ?? 0] : values;
  const hasData = values.some((value) => value > 0);
  return <AppCard title={title}><View style={styles.chart}><View style={styles.chartBars}>{shown.map((value, index) => <View key={`${title}-${index}`} style={styles.barColumn}><View style={[styles.bar, { height: Math.max(4, (value / max) * 86), opacity: hasData ? 1 : 0.3 }]} /><Text style={styles.chartLabel}>{labels[index] ?? ""}</Text></View>)}</View><Text style={styles.chartHint}>{hasData ? hint : "Ainda não há dados para este gráfico"}</Text></View></AppCard>;
}

function PeriodButton({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) { return <TouchableOpacity onPress={onPress} style={[styles.periodButton, selected && styles.periodButtonSelected]}><Text style={[styles.periodText, selected && styles.periodTextSelected]}>{label}</Text></TouchableOpacity>; }
function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) { return <View style={[styles.summaryCard, { borderTopColor: color }]}><Text style={styles.summaryLabel}>{label}</Text><Text style={styles.summaryValue}>{value}</Text></View>; }
function RankList({ rows }: { rows: { id: string; label: string; count: number }[] }) { return <View>{rows.map((row) => <View key={row.id} style={styles.rankRow}><Text style={styles.rowLabel}>{row.label}</Text><View style={styles.rankRight}><View style={styles.track}><View style={[styles.fill, { width: `${Math.min(100, row.count * 18 + 12)}%` }]} /></View><Text style={styles.count}>{row.count}</Text></View></View>)}</View>; }
function IntensityList({ rows }: { rows: { id: string; label: string; count: number; averageIntensity: number }[] }) { return <View>{rows.map((row) => <View key={row.id} style={styles.rankRow}><View><Text style={styles.rowLabel}>{row.label}</Text><Text style={styles.subLabel}>{row.count} registro{row.count === 1 ? "" : "s"}</Text></View><Text style={styles.average}>{row.averageIntensity.toFixed(1)}/10</Text></View>)}</View>; }

const styles = StyleSheet.create({
  content: { paddingBottom: 30, paddingTop: 10 }, periodRow: { backgroundColor: "#EAF0F2", borderRadius: 14, flexDirection: "row", marginBottom: 18, padding: 4 }, periodButton: { alignItems: "center", borderRadius: 10, flex: 1, justifyContent: "center", minHeight: 38 }, periodButtonSelected: { backgroundColor: "#176B87" }, periodText: { color: "#60747C", fontSize: 13, fontWeight: "700" }, periodTextSelected: { color: "#FFFFFF" }, summaryGrid: { flexDirection: "row", gap: 8, marginBottom: 14 }, summaryCard: { backgroundColor: "#FFFFFF", borderColor: "#E2E9EC", borderRadius: 16, borderTopWidth: 4, borderWidth: 1, flex: 1, minHeight: 90, padding: 11 }, summaryLabel: { color: "#60747C", fontSize: 11, fontWeight: "700" }, summaryValue: { color: "#152A33", fontSize: 20, fontWeight: "800", marginTop: 9 }, gap: { height: 12 }, rankRow: { alignItems: "center", borderTopColor: "#ECF0F2", borderTopWidth: 1, flexDirection: "row", justifyContent: "space-between", minHeight: 50, paddingVertical: 8 }, rowLabel: { color: "#152A33", fontSize: 14, fontWeight: "700" }, subLabel: { color: "#789098", fontSize: 11, marginTop: 3 }, rankRight: { alignItems: "center", flexDirection: "row", gap: 8, marginLeft: 10 }, track: { backgroundColor: "#ECF0F2", borderRadius: 5, height: 7, overflow: "hidden", width: 70 }, fill: { backgroundColor: "#E98B5A", borderRadius: 5, height: 7 }, count: { color: "#B55735", fontSize: 14, fontWeight: "800", minWidth: 18, textAlign: "right" }, average: { color: "#176B87", fontSize: 15, fontWeight: "800" }, bigNumber: { color: "#152A33", fontSize: 32, fontWeight: "800" }, detail: { color: "#60747C", fontSize: 13, lineHeight: 20, marginTop: 4 }, notice: { alignItems: "center", backgroundColor: "#EAF6F0", borderRadius: 15, flexDirection: "row", gap: 10, marginVertical: 14, padding: 13 }, noticeText: { color: "#3F6656", flex: 1, fontSize: 12, lineHeight: 17 }, contextNote: { color: "#60747C", fontSize: 12, lineHeight: 17, marginBottom: 8 }, chart: { paddingTop: 4 }, chartBars: { alignItems: "flex-end", flexDirection: "row", height: 112, justifyContent: "space-around" }, barColumn: { alignItems: "center", flex: 1, justifyContent: "flex-end" }, bar: { backgroundColor: "#E98B5A", borderRadius: 5, minHeight: 4, width: 18 }, chartLabel: { color: "#789098", fontSize: 10, marginTop: 7 }, chartHint: { color: "#789098", fontSize: 11, marginTop: 10 }, emptyInline: { color: "#789098", fontSize: 13, fontStyle: "italic", paddingVertical: 8 },
});
