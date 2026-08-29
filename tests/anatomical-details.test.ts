import { describe, expect, it } from "vitest";

import { assetYFromCanonical, canonicalBodyY, lateralPointX } from "@/shared/body-map-geometry";
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
    const faceY = canonicalBodyY("front", 0.15);
    const lowerBodyY = canonicalBodyY("front", 0.78);
    expect(faceY).toBeLessThan(0.05);
    expect(lowerBodyY).toBeGreaterThan(0.8);
    expect(assetYFromCanonical("front", faceY)).toBeCloseTo(0.15, 5);
  });

  it("alinha as vistas laterais ao corpo desenhado", () => {
    expect(lateralPointX("left", 0.44)).toBeCloseTo(0.75, 5);
    expect(lateralPointX("left", 0.29)).toBeCloseTo(0.6, 5);
    expect(lateralPointX("right", 0.56)).toBeCloseTo(0.25, 5);
    expect(canonicalBodyY("front", 0.15)).toBeLessThan(0.05);
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
      "ear-left-upper", "ear-right-lower", "neck-front", "neck-back",
      "lung-left", "heart", "liver", "stomach", "uterus", "bladder",
      "cervical-spine", "thoracic-spine", "lumbar-spine", "sacrum", "coccyx",
      "shoulder-left-joint", "right-deltoid", "left-biceps", "right-triceps",
      "left-elbow-inner", "right-elbow-outer", "left-forearm-flexor", "right-forearm-extensor",
      "left-wrist-joint", "right-wrist-joint", "left-index-mcp", "right-middle-dip",
      "left-thenar", "right-hypothenar", "left-ankle-inner", "right-ankle-outer",
      "left-heel", "right-arch", "left-big-toe-ip", "right-little-toe-dip",
      "left-knee-inner", "right-knee-outer", "left-quad", "right-hamstring", "left-calf-muscle", "right-gluteus",
    ];

    const ids = BODY_SITE_DETAILS.map((site) => site.id);
    expectedIds.forEach((id) => expect(ids).toContain(id));
    expect(bodySiteDetailLabel("right-thumb-cmc")).toContain("carpometacarpal");
    expect(bodySiteDetailLabel("breast-right-axillary-tail")).toContain("axila");
    expect(bodySiteDetailLabel("right-little-toe")).toContain("mínimo");
  });
});
