import { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { EmptyState } from "@/components/empty-state";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PrimaryButton } from "@/components/primary-button";
import { SectionTitle } from "@/components/section-title";
import { formatDateTime } from "@/lib/format";
import { deleteEntry, loadAppData } from "@/lib/local-data";
import { weatherDescription } from "@/lib/weather";
import { AppData, EMPTY_APP_DATA, HealthEntry, WeatherEntry } from "@/shared/records";
import { ScreenContainer } from "@/components/screen-container";

type RecordTab = "health" | "weather";

export default function RecordsScreen() {
  const router = useRouter();
  const [data, setData] = useState<AppData>(EMPTY_APP_DATA);
  const [activeTab, setActiveTab] = useState<RecordTab>("health");
  const refresh = useCallback(() => { loadAppData().then(setData); }, []);
  useFocusEffect(refresh);
  const go = (path: string) => router.push(path as never);
  const confirmDelete = (id: string) => Alert.alert("Excluir registro?", "Essa ação remove o dado somente deste aparelho.", [{ text: "Cancelar", style: "cancel" }, { text: "Excluir", style: "destructive", onPress: () => deleteEntry(activeTab, id).then(setData) }]);
  const empty = <EmptyState icon={<IconSymbol name={activeTab === "health" ? "heart.fill" : "cloud.sun.fill"} size={25} color={activeTab === "health" ? "#3F8D72" : "#D79127"} />} title={activeTab === "health" ? "Nenhum registro de saúde" : "Nenhuma observação de clima"} description={activeTab === "health" ? "Inclua métricas pessoais no momento que for mais conveniente." : "Capture o clima pela localização quando houver conexão."} />;

  return <ScreenContainer className="px-5" containerClassName="bg-background"><View style={styles.root}><SectionTitle eyebrow="Histórico local" title="Registros" detail="Acompanhe dados inseridos por você e capturas de clima." /><View style={styles.segment}><Segment label="Saúde" active={activeTab === "health"} color="#3F8D72" onPress={() => setActiveTab("health")} /><Segment label="Clima" active={activeTab === "weather"} color="#D79127" onPress={() => setActiveTab("weather")} /></View><PrimaryButton label={activeTab === "health" ? "Adicionar registro de saúde" : "Capturar clima agora"} variant={activeTab === "health" ? "health" : "weather"} icon={<IconSymbol name="plus" size={20} color="#FFFFFF" />} onPress={() => go(activeTab === "health" ? "/health-entry" : "/weather-capture")} />{activeTab === "health" ? <FlatList<HealthEntry> data={data.healthEntries} keyExtractor={(entry) => entry.id} contentContainerStyle={data.healthEntries.length ? styles.list : styles.emptyList} showsVerticalScrollIndicator={false} ListEmptyComponent={empty} renderItem={({ item }) => <HealthItem item={item} onDelete={() => confirmDelete(item.id)} />} /> : <FlatList<WeatherEntry> data={data.weatherEntries} keyExtractor={(entry) => entry.id} contentContainerStyle={data.weatherEntries.length ? styles.list : styles.emptyList} showsVerticalScrollIndicator={false} ListEmptyComponent={empty} renderItem={({ item }) => <WeatherItem item={item} onDelete={() => confirmDelete(item.id)} />} />}</View></ScreenContainer>;
}

function Segment({ label, active, color, onPress }: { label: string; active: boolean; color: string; onPress: () => void }) { return <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.segmentButton, active && { backgroundColor: color }]}><Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>{label}</Text></TouchableOpacity>; }
function HealthItem({ item, onDelete }: { item: HealthEntry; onDelete: () => void }) { return <View style={styles.item}><View style={[styles.itemIcon, { backgroundColor: "#E9F6F0" }]}><IconSymbol name="heart.fill" size={20} color="#3F8D72" /></View><View style={styles.itemBody}><Text style={styles.itemTitle}>{item.metricName}</Text><Text style={styles.itemDetail}>{item.value} {item.unit} · {formatDateTime(item.recordedAt)}</Text>{item.notes ? <Text numberOfLines={1} style={styles.notes}>{item.notes}</Text> : null}</View><TouchableOpacity style={styles.delete} onPress={onDelete}><IconSymbol name="trash" size={18} color="#9A4A4A" /></TouchableOpacity></View>; }
function WeatherItem({ item, onDelete }: { item: WeatherEntry; onDelete: () => void }) { return <View style={styles.item}><View style={[styles.itemIcon, { backgroundColor: "#FFF4E2" }]}><IconSymbol name="cloud.sun.fill" size={20} color="#D79127" /></View><View style={styles.itemBody}><Text style={styles.itemTitle}>{Math.round(item.temperature)}°C · {weatherDescription(item.weatherCode)}</Text><Text style={styles.itemDetail}>Umidade {item.humidity}% · {formatDateTime(item.capturedAt)}</Text><Text numberOfLines={1} style={styles.notes}>{item.locality ?? `${item.latitude.toFixed(3)}, ${item.longitude.toFixed(3)}`}</Text></View><TouchableOpacity style={styles.delete} onPress={onDelete}><IconSymbol name="trash" size={18} color="#9A4A4A" /></TouchableOpacity></View>; }

const styles = StyleSheet.create({ root: { flex: 1, paddingTop: 10 }, segment: { backgroundColor: "#EAF0F2", borderRadius: 14, flexDirection: "row", marginBottom: 14, padding: 4 }, segmentButton: { alignItems: "center", borderRadius: 10, flex: 1, justifyContent: "center", minHeight: 38 }, segmentLabel: { color: "#60747C", fontSize: 14, fontWeight: "700" }, segmentLabelActive: { color: "#FFFFFF" }, list: { gap: 10, paddingBottom: 25, paddingTop: 16 }, emptyList: { flexGrow: 1, justifyContent: "center", paddingBottom: 64 }, item: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#E2E9EC", borderRadius: 18, borderWidth: 1, flexDirection: "row", minHeight: 82, padding: 12 }, itemIcon: { alignItems: "center", borderRadius: 12, height: 42, justifyContent: "center", marginRight: 12, width: 42 }, itemBody: { flex: 1 }, itemTitle: { color: "#152A33", fontSize: 15, fontWeight: "800" }, itemDetail: { color: "#60747C", fontSize: 12, marginTop: 3 }, notes: { color: "#789098", fontSize: 12, marginTop: 4 }, delete: { alignItems: "center", height: 38, justifyContent: "center", marginLeft: 8, width: 38 } });
