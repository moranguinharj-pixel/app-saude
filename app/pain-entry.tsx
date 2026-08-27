import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Location from "expo-location";

import { BodyDiagram } from "@/components/body-diagram";
import { EmptyState } from "@/components/empty-state";
import { PrimaryButton } from "@/components/primary-button";
import { SectionTitle } from "@/components/section-title";
import { addPainEntry } from "@/lib/local-data";
import { getCurrentWeather } from "@/lib/weather";
import { BODY_SITE_DETAILS, BODY_SITES, BodySiteDetailId, BodySiteId, EMOTIONS, FOOD_TRIGGERS, makeId, PAIN_TYPES, PainEntry } from "@/shared/records";
import { ScreenContainer } from "@/components/screen-container";

type Step = 1 | 2 | 3 | 4 | 5 | 6;
const STEP_TITLES = ["Onde dói?", "Qual a intensidade?", "Como é a dor?", "Ela irradia?", "Como você está?", "O que você comeu?"];

export default function PainEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ site?: string }>();
  const initialSite = BODY_SITES.some((site) => site.id === params.site) ? (params.site as BodySiteId) : undefined;
  const [step, setStep] = useState<Step>(1);
  const [side, setSide] = useState<"front" | "back">("front");
  const [primarySite, setPrimarySite] = useState<BodySiteId | undefined>(initialSite);
  const [primaryDetail, setPrimaryDetail] = useState<BodySiteDetailId | undefined>();
  const [intensity, setIntensity] = useState<number | undefined>();
  const [painTypes, setPainTypes] = useState<string[]>([]);
  const [radiationSites, setRadiationSites] = useState<BodySiteId[]>([]);
  const [radiationDetails, setRadiationDetails] = useState<BodySiteDetailId[]>([]);
  const [noRadiation, setNoRadiation] = useState(false);
  const [emotion, setEmotion] = useState<string | undefined>();
  const [foods, setFoods] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const currentTitle = STEP_TITLES[step - 1];
  const progress = useMemo(() => `${step} de 6`, [step]);

  const selectPrimary = (site: BodySiteId) => { setPrimarySite(site); setPrimaryDetail(undefined); };
  const selectPrimaryDetail = (id: BodySiteDetailId) => setPrimaryDetail(id);
  const togglePainType = (id: string) => setPainTypes((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  const toggleRadiation = (site: BodySiteId) => { setNoRadiation(false); setRadiationSites((current) => current.includes(site) ? current.filter((value) => value !== site) : [...current, site]); };
  const toggleRadiationDetail = (id: BodySiteDetailId) => { setNoRadiation(false); setRadiationDetails((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]); };
  const toggleFood = (id: string) => { if (id === "none") { setFoods((current) => current.includes("none") ? [] : ["none"]); return; } setFoods((current) => [...current.filter((value) => value !== "none"), ...(current.includes(id) ? [] : [id])].filter((value, index, array) => array.indexOf(value) === index)); };

  const primaryDetails = BODY_SITE_DETAILS.filter((detail) => detail.coarse === primarySite);
  const radiationDetailOptions = BODY_SITE_DETAILS.filter((detail) => radiationSites.includes(detail.coarse as BodySiteId));

  const previous = () => { if (step === 1) { router.back(); return; } setStep((step - 1) as Step); };
  const next = () => {
    if (step === 1 && (!primarySite || !primaryDetail)) { Alert.alert("Detalhe o local", "Toque primeiro na região e depois no ponto exato da dor."); return; }
    if (step === 3 && !painTypes.length) { Alert.alert("Escolha a sensação", "Selecione pelo menos um tipo de dor."); return; }
    if (step === 4 && !noRadiation && (!radiationSites.length || !radiationDetails.length)) { Alert.alert("Detalhe a irradiação", "Escolha uma região irradiada e depois o ponto exato. Se não irradiar, escolha essa opção."); return; }
    if (step === 5 && !emotion) { Alert.alert("Escolha uma emoção", "Toque na opção que melhor representa como você está agora."); return; }
    if (step < 6) setStep((step + 1) as Step); else save();
  };

  const save = async () => {
    if (!primarySite || !primaryDetail || !intensity || !painTypes.length || !emotion) return;
    setSaving(true); setLoadingWeather(true);
    let weather: PainEntry["weather"];
    try {
      if (await Location.hasServicesEnabledAsync()) {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status === "granted") {
          const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const current = await getCurrentWeather(position.coords.latitude, position.coords.longitude);
          const addresses = await Location.reverseGeocodeAsync({ latitude: position.coords.latitude, longitude: position.coords.longitude });
          const address = addresses[0];
          weather = { ...current, locality: [address?.city, address?.region].filter(Boolean).join(", ") || undefined };
        }
      }
    } catch { /* A ocorrência continua podendo ser salva sem clima se permissão ou conexão falhar. */ }
    try {
      await addPainEntry({ id: makeId("pain"), occurredAt: new Date().toISOString(), primarySite, primaryDetail, radiationSites: noRadiation ? [] : radiationSites, radiationDetails: noRadiation ? [] : radiationDetails, intensity, painTypes, emotion, foods, weather });
      if (!weather) Alert.alert("Ocorrência salva", "A dor foi registrada. O clima não pôde ser associado nesta captura.", [{ text: "OK", onPress: () => router.back() }]); else router.back();
    } catch { Alert.alert("Não foi possível salvar", "Tente novamente em alguns instantes."); } finally { setSaving(false); setLoadingWeather(false); }
  };

  return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]} containerClassName="bg-background"><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.topline}><Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={previous} style={styles.back}><Text style={styles.backText}>‹</Text></Pressable><Text style={styles.progress}>{progress}</Text></View><SectionTitle eyebrow="Registro rápido" title={currentTitle} detail={step === 1 ? "Escolha a região e depois o ponto exato, sem digitar." : "Tudo pode ser escolhido com um toque."} />{step === 1 ? <><BodyDiagram selected={primarySite ? [primarySite] : []} selectedDetails={primaryDetail ? [primaryDetail] : []} onSelect={selectPrimary} onSelectDetail={selectPrimaryDetail} side={side} onSideChange={setSide} />{primarySite ? <View style={styles.detailPanel}><Text style={styles.detailTitle}>Qual ponto de {BODY_SITES.find((site) => site.id === primarySite)?.label.toLowerCase()}?</Text><DetailGrid items={primaryDetails} selected={primaryDetail ? [primaryDetail] : []} onToggle={selectPrimaryDetail} /></View> : <EmptyState icon={<Text style={styles.emptyEmoji}>⌖</Text>} title="Comece pelo corpo" description="Toque em uma região da silhueta para ver pontos mais detalhados." />}</> : null}{step === 2 ? <IntensityStep value={intensity} onSelect={setIntensity} /> : null}{step === 3 ? <ChoiceGrid items={PAIN_TYPES.map((item) => ({ id: item.id, label: item.label, icon: item.icon }))} selected={painTypes} onToggle={togglePainType} columns={3} /> : null}{step === 4 ? <><Pressable accessibilityRole="button" accessibilityState={{ selected: noRadiation }} onPress={() => { setNoRadiation(true); setRadiationSites([]); setRadiationDetails([]); }} style={[styles.noneButton, noRadiation && styles.noneButtonActive]}><Text style={[styles.noneText, noRadiation && styles.noneTextActive]}>Não irradia</Text></Pressable><BodyDiagram selected={radiationSites} selectedDetails={radiationDetails} onSelect={toggleRadiation} onSelectDetail={toggleRadiationDetail} multi side={side} onSideChange={setSide} />{radiationSites.length ? <View style={styles.detailPanel}><Text style={styles.detailTitle}>Toque nos pontos exatos, na ordem do trajeto</Text><DetailGrid items={radiationDetailOptions} selected={radiationDetails} onToggle={toggleRadiationDetail} /></View> : null}</> : null}{step === 5 ? <ChoiceGrid items={EMOTIONS.map((item) => ({ id: item.id, label: item.label, icon: item.icon }))} selected={emotion ? [emotion] : []} onToggle={(id) => setEmotion(id)} columns={3} /> : null}{step === 6 ? <ChoiceGrid items={FOOD_TRIGGERS.map((item) => ({ id: item.id, label: item.label, icon: item.icon }))} selected={foods} onToggle={toggleFood} columns={3} /> : null}<View style={styles.actions}><PrimaryButton label={step === 6 ? "Salvar ocorrência" : "Continuar"} variant="primary" onPress={next} loading={saving || loadingWeather} /><Text style={styles.privacy}>Horário e clima são capturados automaticamente. O dado fica somente neste aparelho.</Text></View></ScrollView></ScreenContainer>;
}

function DetailGrid({ items, selected, onToggle }: { items: readonly { id: BodySiteDetailId; label: string }[]; selected: BodySiteDetailId[]; onToggle: (id: BodySiteDetailId) => void }) { return <View style={styles.detailGrid}>{items.map((item, index) => { const active = selected.includes(item.id); const order = active ? selected.indexOf(item.id) + 1 : undefined; return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={item.label} accessibilityState={{ selected: active }} onPress={() => onToggle(item.id)} style={[styles.detailChoice, active && styles.detailChoiceActive]}><View style={[styles.detailDot, active && styles.detailDotActive]}><Text style={styles.detailDotText}>{order ?? "•"}</Text></View><Text style={[styles.detailLabel, active && styles.detailLabelActive]}>{item.label}</Text></Pressable>; })}</View>; }
function IntensityStep({ value, onSelect }: { value?: number; onSelect: (value: number) => void }) { return <View style={styles.intensityWrap}><Text style={styles.intensityHint}>Toque em um número</Text><View style={styles.numberGrid}>{Array.from({ length: 10 }, (_, index) => index + 1).map((number) => <Pressable key={number} accessibilityRole="button" accessibilityLabel={`Intensidade ${number} de 10`} accessibilityState={{ selected: value === number }} onPress={() => onSelect(number)} style={[styles.number, value === number && styles.numberActive]}><Text style={[styles.numberText, value === number && styles.numberTextActive]}>{number}</Text></Pressable>)}</View><View style={styles.scaleLegend}><Text style={styles.legendLeft}>Leve</Text><Text style={styles.legendRight}>Muito forte</Text></View></View>; }
function ChoiceGrid({ items, selected, onToggle, columns }: { items: { id: string; label: string; icon: string }[]; selected: string[]; onToggle: (id: string) => void; columns: number }) { return <View style={styles.choiceGrid}>{items.map((item) => { const active = selected.includes(item.id); return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={item.label} accessibilityState={{ selected: active }} onPress={() => onToggle(item.id)} style={[styles.choice, columns === 3 && styles.choiceThree, columns === 2 && styles.choiceTwo, active && styles.choiceActive]}><Text style={[styles.choiceIcon, active && styles.choiceIconActive]}>{item.icon}</Text><Text style={[styles.choiceLabel, active && styles.choiceLabelActive]}>{item.label}</Text></Pressable>; })}</View>; }

const styles = StyleSheet.create({ content: { paddingBottom: 30, paddingTop: 8 }, topline: { alignItems: "center", flexDirection: "row", marginBottom: 8 }, back: { alignItems: "center", height: 44, justifyContent: "center", width: 44 }, backText: { color: "#176B87", fontSize: 34, lineHeight: 38 }, progress: { color: "#789098", flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right" }, detailPanel: { backgroundColor: "#FFFFFF", borderColor: "#D9E3E7", borderRadius: 18, borderWidth: 1, marginTop: 16, padding: 14 }, detailTitle: { color: "#152A33", fontSize: 15, fontWeight: "800", marginBottom: 12 }, detailGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, detailChoice: { alignItems: "center", backgroundColor: "#F4F7F8", borderColor: "#D9E3E7", borderRadius: 14, borderWidth: 1, flexDirection: "row", minHeight: 50, paddingHorizontal: 9, width: "48%" }, detailChoiceActive: { backgroundColor: "#EAF4F7", borderColor: "#176B87", borderWidth: 2 }, detailDot: { alignItems: "center", backgroundColor: "#DCE9ED", borderRadius: 14, height: 28, justifyContent: "center", marginRight: 7, width: 28 }, detailDotActive: { backgroundColor: "#176B87" }, detailDotText: { color: "#176B87", fontSize: 13, fontWeight: "800" }, detailLabel: { color: "#526873", flex: 1, fontSize: 12, fontWeight: "700", lineHeight: 15 }, detailLabelActive: { color: "#152A33" }, emptyEmoji: { color: "#176B87", fontSize: 24 }, intensityWrap: { paddingTop: 10 }, intensityHint: { color: "#60747C", fontSize: 14, fontWeight: "600", marginBottom: 16, textAlign: "center" }, numberGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" }, number: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#BCD0D6", borderRadius: 18, borderWidth: 2, height: 58, justifyContent: "center", width: 58 }, numberActive: { backgroundColor: "#E98B5A", borderColor: "#B55735", transform: [{ scale: 1.06 }] }, numberText: { color: "#176B87", fontSize: 22, fontWeight: "800" }, numberTextActive: { color: "#FFFFFF" }, scaleLegend: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 }, legendLeft: { color: "#3F8D72", fontSize: 12, fontWeight: "700" }, legendRight: { color: "#B55735", fontSize: 12, fontWeight: "700" }, choiceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, paddingTop: 8 }, choice: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#D9E3E7", borderRadius: 16, borderWidth: 1, minHeight: 94, padding: 10, width: "31%" }, choiceThree: { width: "31%" }, choiceTwo: { width: "48%" }, choiceActive: { backgroundColor: "#EAF4F7", borderColor: "#176B87", borderWidth: 2 }, choiceIcon: { color: "#176B87", fontSize: 28, height: 36, lineHeight: 34, textAlign: "center" }, choiceIconActive: { color: "#E98B5A" }, choiceLabel: { color: "#526873", fontSize: 12, fontWeight: "700", lineHeight: 15, marginTop: 7, textAlign: "center" }, choiceLabelActive: { color: "#152A33" }, noneButton: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#D9E3E7", borderRadius: 15, borderWidth: 1, marginBottom: 13, minHeight: 50, justifyContent: "center" }, noneButtonActive: { backgroundColor: "#EAF4F7", borderColor: "#176B87", borderWidth: 2 }, noneText: { color: "#526873", fontSize: 15, fontWeight: "700" }, noneTextActive: { color: "#176B87" }, actions: { marginTop: 22 }, privacy: { color: "#789098", fontSize: 12, lineHeight: 17, marginTop: 12, textAlign: "center" } });
