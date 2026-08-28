import { describe, expect, it } from "vitest";

import { assetYFromCanonical, bodyPointToMap, canonicalBodyY, containedAssetRect, mapPointToBody } from "@/shared/body-map-geometry";
import { buildPainReport } from "@/lib/pain-reports";
import { BODY_SITE_DETAILS, PainEntry, bodySiteDetailLabel } from "@/shared/records";

describe("detalhamento anatômico da dor", () => {
  it("agrupa o ponto exato e os pontos de irradiação", () => {
    const entry: PainEntry = {
      id: "pain-1",
      occurredAt: "2026-08-27T12:00:00.000Z",
      primarySite: "face",
      primaryDetail: "above-eye-left",
      radiationSites: ["head"],
      radiationDetails: ["neck-back", "behind-head-left"],
      intensity: 7,
      painTypes: ["stabbing", "burning"],
      emotion: "worried",
      foods: ["none"],
    };

    const report = buildPainReport([entry], 30, new Date("2026-08-27T18:00:00.000Z"));

    expect(report.sites[0]).toMatchObject({ label: "Acima do olho esquerdo", count: 1 });
    expect(report.radiation).toEqual([
      { id: "neck-back", label: "Nuca", count: 1 },
      { id: "behind-head-left", label: "Atrás da cabeça, lado esquerdo", count: 1 },
    ]);
  });

  it("calibra a faixa visual do corpo inteiro para o atlas anatômico", () => {
    const faceY = canonicalBodyY("front", 0.06);
    const lowerBodyY = canonicalBodyY("front", 0.78);
    expect(faceY).toBeLessThan(0.02);
    expect(lowerBodyY).toBeGreaterThan(0.8);
    expect(assetYFromCanonical("front", faceY)).toBeCloseTo(0.06, 5);
  });

  it("mantém a imagem inteira e converte o ponto visual do ombro no mesmo local anatômico", () => {
    const mapAspectRatio = 250 / 420;
    const imageRect = containedAssetRect("front", mapAspectRatio);
    const shoulderOnMap = bodyPointToMap("front", 0.22, 0.2, mapAspectRatio);
    const resolvedShoulder = mapPointToBody("front", shoulderOnMap.x, shoulderOnMap.y, mapAspectRatio);

    expect(imageRect.height).toBe(1);
    expect(imageRect.width).toBeLessThan(1);
    expect(imageRect.left).toBeGreaterThan(0);
    expect(resolvedShoulder.x).toBeCloseTo(0.22, 5);
    expect(resolvedShoulder.y).toBeCloseTo(0.2, 5);
  });

  it("mantém estruturas finas de mãos, pés, mamas, músculos e órgãos", () => {
    const expectedIds = [
      "right-thumb-cmc",
      "right-little-toe",
      "breast-right-axillary-tail",
      "right-elbow-joint",
      "right-quad",
      "uterus",
      "kidney-left",
    ];

    const ids = BODY_SITE_DETAILS.map((site) => site.id);
    expectedIds.forEach((id) => expect(ids).toContain(id));
    expect(bodySiteDetailLabel("right-thumb-cmc")).toContain("carpometacarpal");
    expect(bodySiteDetailLabel("breast-right-axillary-tail")).toContain("axila");
    expect(bodySiteDetailLabel("right-little-toe")).toContain("mínimo");
  });
});
