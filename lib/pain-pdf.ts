import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

import { buildPainReport } from "@/lib/pain-reports";
import { AppData } from "@/shared/records";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function sharePainReportPdf(data: AppData, days: number) {
  if (Platform.OS === "web") throw new Error("A exportação em PDF está disponível no aplicativo Android.");
  if (!(await Sharing.isAvailableAsync())) throw new Error("O compartilhamento não está disponível neste aparelho.");
  const report = buildPainReport(data.painEntries, days);
  const list = (rows: { label: string; count: number }[]) => rows.slice(0, 8).map((row) => `<li>${escapeHtml(row.label)} <strong>(${row.count})</strong></li>`).join("");
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>@page{margin:28px}body{font-family:Arial,sans-serif;color:#152A33}h1{color:#176B87}h2{border-bottom:1px solid #dce5e8;padding-bottom:6px;margin-top:22px}p,li{font-size:13px;line-height:1.5}.summary{display:flex;gap:14px}.card{background:#eef7f8;border-radius:10px;padding:12px;flex:1}.number{font-size:22px;font-weight:bold}.note{background:#fff6e6;padding:12px;border-radius:8px}</style></head><body><h1>Relatório pessoal de dor</h1><p>Período analisado: últimos ${days} dias. Gerado em ${new Date().toLocaleString("pt-BR")}.</p><div class="summary"><div class="card"><div class="number">${report.entries.length}</div>ocorrências</div><div class="card"><div class="number">${report.intensityAverage.toFixed(1)}/10</div>intensidade média</div><div class="card"><div class="number">${report.weatherCount}</div>com clima</div></div><h2>Locais mais registrados</h2><ul>${list(report.sites)}</ul><h2>Sensações e sintomas</h2><ul>${list(report.types)}${list(report.symptoms)}</ul><h2>Emoções e alimentação</h2><ul>${list(report.emotions)}${list(report.foods)}</ul><h2>Irradiação e relações</h2><ul>${list(report.radiation)}</ul><p>Ocorrências relacionadas a dores anteriores: <strong>${report.associatedPainCount}</strong>.</p><h2>Medicamentos registrados</h2><ul>${list(report.medications)}</ul><div class="note"><strong>Importante:</strong> este documento descreve registros pessoais e associações observadas. Não confirma causas, eficácia clínica ou diagnóstico. Leve o relatório a um profissional de saúde.</div></body></html>`;
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, { mimeType: "application/pdf", dialogTitle: "Compartilhar relatório médico", UTI: "com.adobe.pdf" });
}
