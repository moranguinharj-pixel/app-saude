import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppCard } from "@/components/app-card";
import { PrimaryButton } from "@/components/primary-button";
import { SectionTitle } from "@/components/section-title";
import { ScreenContainer } from "@/components/screen-container";
import { formatDateTime } from "@/lib/format";
import { loadAppData, updatePainEntry } from "@/lib/local-data";
import { bodySiteDetailLabel, emotionLabel, foodLabel, localSymptomLabel, PainEntry, painTypeLabel } from "@/shared/records";

export default function PainDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [entry, setEntry] = useState<PainEntry>();
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { loadAppData().then((data) => { const found = data.painEntries.find((item) => item.id === id); setEntry(found); setNote(found?.followUpNote ?? ""); }); }, [id]);
  if (!entry) return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}><View style={styles.center}><Text style={styles.title}>Ocorrência não encontrada</Text><PrimaryButton label="Voltar" onPress={() => router.back()} /></View></ScreenContainer>;
  const save = async () => { setSaving(true); try { await updatePainEntry({ ...entry, followUpNote: note.trim() || undefined }); Alert.alert("Registro atualizado", "A informação adicional foi salva no aparelho.", [{ text: "OK", onPress: () => router.back() }]); } catch { Alert.alert("Não foi possível atualizar", "Tente novamente."); } finally { setSaving(false); } };
  return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><SectionTitle eyebrow="Histórico" title="Detalhes da ocorrência" detail={formatDateTime(entry.occurredAt)} /><AppCard title="Dor registrada" tone="health"><Text style={styles.primary}>{bodySiteDetailLabel(entry.primaryDetail ?? entry.primarySite)}</Text><Text style={styles.detail}>Intensidade {entry.intensity}/10 · {entry.painTypes.map(painTypeLabel).join(", ")}</Text>{entry.localSymptoms?.length ? <Text style={styles.detail}>Sintomas: {entry.localSymptoms.map(localSymptomLabel).join(", ")}</Text> : null}{entry.radiationDetails?.length ? <Text style={styles.detail}>Irradiação: {entry.radiationDetails.map(bodySiteDetailLabel).join(" → ")}</Text> : null}</AppCard><View style={styles.gap} /><AppCard title="Contexto registrado"><Text style={styles.detail}>Humor: {emotionLabel(entry.emotion)}</Text>{entry.foods.length ? <Text style={styles.detail}>Alimentos: {entry.foods.filter((food) => food !== "none").map(foodLabel).join(", ") || "Nenhum item selecionado"}</Text> : null}{entry.medications?.length ? <Text style={styles.detail}>Medicamentos: {entry.medications.map((medication) => `${medication.name}${medication.dose ? ` (${medication.dose})` : ""}`).join(", ")}</Text> : null}{entry.weather ? <Text style={styles.detail}>Clima: {Math.round(entry.weather.temperature)}°C · umidade {entry.weather.humidity}%</Text> : null}</AppCard><View style={styles.gap} /><Text style={styles.label}>Adicionar informação depois da crise (opcional)</Text><TextInput value={note} onChangeText={setNote} placeholder="Ex.: observação posterior" placeholderTextColor="#8DA0A7" multiline textAlignVertical="top" style={styles.input} /><PrimaryButton label="Salvar alterações" onPress={save} loading={saving} style={styles.submit} /></ScrollView></ScreenContainer>;
}
const styles = StyleSheet.create({ content: { paddingBottom: 28, paddingTop: 10 }, center: { flex: 1, gap: 16, justifyContent: "center" }, title: { color: "#152A33", fontSize: 22, fontWeight: "800" }, primary: { color: "#152A33", fontSize: 20, fontWeight: "800" }, detail: { color: "#60747C", fontSize: 13, lineHeight: 20, marginTop: 6 }, gap: { height: 12 }, label: { color: "#344C56", fontSize: 13, fontWeight: "800", marginBottom: 7, marginTop: 4 }, input: { backgroundColor: "#FFFFFF", borderColor: "#D9E3E7", borderRadius: 14, borderWidth: 1, color: "#152A33", fontSize: 16, minHeight: 110, padding: 14 }, submit: { marginTop: 15 } });
