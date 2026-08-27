import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { AppCard } from "@/components/app-card";
import { BodyDiagram } from "@/components/body-diagram";
import { EmptyState } from "@/components/empty-state";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PrimaryButton } from "@/components/primary-button";
import { SectionTitle } from "@/components/section-title";
import { formatDateTime } from "@/lib/format";
import { loadAppData } from "@/lib/local-data";
import { weatherDescription } from "@/lib/weather";
import { AppData, bodySiteLabel, EMPTY_APP_DATA } from "@/shared/records";
import { ScreenContainer } from "@/components/screen-container";

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState<AppData>(EMPTY_APP_DATA);
  const [side, setSide] = useState<"front" | "back">("front");
  useFocusEffect(useCallback(() => { loadAppData().then(setData); }, []));
  const latestPain = data.painEntries[0];
  const latestWeather = data.weatherEntries[0];
  const upcomingEvent = data.calendarEntries.find((entry) => new Date(entry.startsAt) >= new Date());
  const openPain = (site?: string) => router.push((site ? `/pain-entry?site=${site}` : "/pain-entry") as never);
  return <ScreenContainer className="px-5" containerClassName="bg-background"><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><SectionTitle eyebrow="Diário visual local" title="Como você está hoje?" detail="Toque no local da dor para registrar uma ocorrência." /><AppCard tone="health"><Text style={styles.cardTitle}>Registrar uma ocorrência</Text><Text style={styles.cardDetail}>Selecione uma região na silhueta. O restante será feito por escolhas visuais.</Text><BodyDiagram selected={[]} onSelect={(site) => openPain(site)} side={side} onSideChange={setSide} /><PrimaryButton label="Registrar sem escolher o local" variant="health" onPress={() => openPain()} style={styles.primary} /></AppCard><View style={styles.statsRow}><Stat value={String(data.painEntries.length)} label="ocorrências" color="#E98B5A" /><Stat value={latestPain ? `${latestPain.intensity}/10` : "—"} label="última intensidade" color="#B55735" /><Stat value={String(data.painEntries.filter((entry) => entry.weather).length)} label="com clima" color="#D79127" /></View><View style={styles.sectionTitle}><Text style={styles.sectionLabel}>ÚLTIMAS INFORMAÇÕES</Text><TouchableOpacity onPress={() => router.push("/records" as never)}><Text style={styles.link}>Ver histórico</Text></TouchableOpacity></View>{latestPain ? <AppCard title="Última ocorrência" tone="health"><Text style={styles.painTitle}>{bodySiteLabel(latestPain.primarySite)} · intensidade {latestPain.intensity}/10</Text><Text style={styles.detail}>{formatDateTime(latestPain.occurredAt)}{latestPain.weather ? ` · ${Math.round(latestPain.weather.temperature)}°C` : ""}</Text></AppCard> : <EmptyState icon={<IconSymbol name="heart.fill" size={24} color="#3F8D72" />} title="Nenhuma dor registrada" description="Seu primeiro toque na silhueta inicia um registro simples e visual." />}<View style={styles.gap} />{latestWeather ? <AppCard title="Clima mais recente" tone="weather" accessory={<IconSymbol name="cloud.sun.fill" size={20} color="#D79127" />}><Text style={styles.metric}>{Math.round(latestWeather.temperature)}°C <Text style={styles.weatherText}>{weatherDescription(latestWeather.weatherCode)}</Text></Text><Text style={styles.detail}>Capturado em {formatDateTime(latestWeather.capturedAt)}</Text></AppCard> : null}{upcomingEvent ? <View style={styles.gap}><AppCard title="Próximo evento" tone="calendar" accessory={<IconSymbol name="calendar" size={20} color="#6966B3" />}><Text style={styles.painTitle}>{upcomingEvent.title}</Text><Text style={styles.detail}>{formatDateTime(upcomingEvent.startsAt)}</Text></AppCard></View> : null}</ScrollView></ScreenContainer>;
}
function Stat({ value, label, color }: { value: string; label: string; color: string }) { return <View style={[styles.stat, { borderTopColor: color }]}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }
const styles = StyleSheet.create({ content: { paddingBottom: 30, paddingTop: 10 }, cardTitle: { color: "#152A33", fontSize: 18, fontWeight: "800" }, cardDetail: { color: "#60747C", fontSize: 13, lineHeight: 19, marginTop: 4 }, primary: { marginTop: 6 }, statsRow: { flexDirection: "row", gap: 8, marginVertical: 14 }, stat: { backgroundColor: "#FFFFFF", borderColor: "#E2E9EC", borderRadius: 15, borderTopWidth: 4, borderWidth: 1, flex: 1, minHeight: 80, padding: 10 }, statValue: { color: "#152A33", fontSize: 21, fontWeight: "800", marginTop: 3 }, statLabel: { color: "#789098", fontSize: 11, lineHeight: 15, marginTop: 3 }, sectionTitle: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }, sectionLabel: { color: "#789098", fontSize: 11, fontWeight: "800", letterSpacing: 1.1 }, link: { color: "#176B87", fontSize: 13, fontWeight: "800" }, painTitle: { color: "#152A33", fontSize: 16, fontWeight: "800" }, metric: { color: "#152A33", fontSize: 25, fontWeight: "800" }, weatherText: { color: "#60747C", fontSize: 14, fontWeight: "600" }, detail: { color: "#60747C", fontSize: 13, lineHeight: 20, marginTop: 5 }, gap: { height: 12 } });
