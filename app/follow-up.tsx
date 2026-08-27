import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PrimaryButton } from "@/components/primary-button";
import { SectionTitle } from "@/components/section-title";
import { ScreenContainer } from "@/components/screen-container";
import { addFollowUp, addPainEntry, loadAppData, updateFollowUp } from "@/lib/local-data";
import { schedulePainFollowUp } from "@/lib/notifications";
import { makeId, MedicationProfile, PainFollowUp } from "@/shared/records";

type Stage = "initial" | "worse" | "another";

export default function FollowUpScreen() {
  const router = useRouter();
  const { followUpId } = useLocalSearchParams<{ followUpId?: string }>();
  const [followUp, setFollowUp] = useState<PainFollowUp>();
  const [medications, setMedications] = useState<MedicationProfile[]>([]);
  const [stage, setStage] = useState<Stage>("initial");
  const [busy, setBusy] = useState(false);

  useEffect(() => { loadAppData().then((data) => { setFollowUp(data.followUps.find((item) => item.id === followUpId)); setMedications(data.medicationHistory); }); }, [followUpId]);

  const closeWith = async (status: PainFollowUp["status"]) => { if (!followUp) return; setBusy(true); await updateFollowUp(followUp.id, { status, answeredAt: new Date().toISOString() }); setBusy(false); Alert.alert("Acompanhamento salvo", status === "improved" ? "Você marcou o medicamento como eficaz para esta ocorrência." : "Sua resposta foi registrada.", [{ text: "OK", onPress: () => router.back() }]); };
  const chooseAnother = async (profile: MedicationProfile) => { if (!followUp) return; setBusy(true); const nextId = makeId("followup"); await updateFollowUp(followUp.id, { status: "closed", answeredAt: new Date().toISOString(), nextMedicationName: profile.name }); await addFollowUp({ id: nextId, painEntryId: followUp.painEntryId, scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), medicationName: profile.name, status: "pending" }); await schedulePainFollowUp(nextId, profile.name); setBusy(false); Alert.alert("Novo acompanhamento agendado", `Vamos perguntar novamente em 2 horas sobre ${profile.name}.`, [{ text: "OK", onPress: () => router.back() }]); };

  if (!followUp) return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}><View style={styles.center}><Text style={styles.title}>Acompanhamento não encontrado</Text><Text style={styles.detail}>Talvez este lembrete já tenha sido respondido.</Text><PrimaryButton label="Voltar" onPress={() => router.back()} /></View></ScreenContainer>;
  return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}><View style={styles.root}><SectionTitle eyebrow="Acompanhamento" title={stage === "initial" ? "Sua dor melhorou?" : stage === "worse" ? "A dor intensificou?" : "Deseja tomar outro medicamento?"} detail={followUp.medicationName ? `Registro relacionado a ${followUp.medicationName}.` : "Responda com um toque; sua resposta ficará no aparelho."} />{stage === "initial" ? <><Action label="Sim, melhorou" color="#3F8D72" onPress={() => closeWith("improved")} /><Action label="Não melhorou" color="#D79127" onPress={() => setStage("worse")} /></> : null}{stage === "worse" ? <><Action label="Sim, intensificou" color="#C55454" onPress={async () => { await updateFollowUp(followUp.id, { status: "worse", answeredAt: new Date().toISOString() }); router.replace("/pain-entry"); }} /><Action label="Não" color="#176B87" onPress={() => setStage("another")} /></> : null}{stage === "another" ? <>{medications.length ? medications.map((medication) => <Action key={medication.id} label={medication.name} color="#6966B3" onPress={() => chooseAnother(medication)} />) : <Text style={styles.detail}>Nenhum medicamento salvo para selecionar.</Text>}<Action label="Não, encerrar acompanhamento" color="#789098" onPress={() => closeWith("closed")} /></> : null}<Text style={styles.note}>Este acompanhamento registra sua resposta ao longo do tempo; não determina eficácia ou orientação médica.</Text></View></ScreenContainer>;
}
function Action({ label, color, onPress }: { label: string; color: string; onPress: () => void }) { return <TouchableOpacity disabled={false} onPress={onPress} activeOpacity={0.8} style={[styles.action, { borderLeftColor: color }]}><Text style={styles.actionText}>{label}</Text><Text style={[styles.arrow, { color }]}>›</Text></TouchableOpacity>; }
const styles = StyleSheet.create({ root: { flex: 1, paddingTop: 10 }, center: { flex: 1, gap: 12, justifyContent: "center" }, title: { color: "#152A33", fontSize: 22, fontWeight: "800" }, detail: { color: "#60747C", fontSize: 14, lineHeight: 21 }, action: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#E2E9EC", borderLeftWidth: 5, borderRadius: 16, flexDirection: "row", justifyContent: "space-between", marginBottom: 12, minHeight: 64, paddingHorizontal: 18 }, actionText: { color: "#152A33", fontSize: 16, fontWeight: "800" }, arrow: { fontSize: 30, fontWeight: "300" }, note: { color: "#789098", fontSize: 12, lineHeight: 18, marginTop: 18 } });
