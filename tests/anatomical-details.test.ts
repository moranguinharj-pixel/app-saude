import { describe, expect, it } from "vitest";

import { assetXFromCanonical, assetYFromCanonical, canonicalBodyX, canonicalBodyY, lateralPointX } from "@/shared/body-map-geometry";
import { buildPainReport } from "@/lib/pain-reports";
import { BODY_SITE_DETAILS, PainEntry, bodySiteDetailLabel } from "@/shared/records";
import { FRONT_ATLAS, BACK_ATLAS, LATERAL_ATLAS, atlasForSide, resolveAtlasPoint } from "@/shared/body-atlas";

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
    expect(faceY).toBeCloseTo(0.115, 2);
    expect(lowerBodyY).toBeCloseTo(0.808, 2);
    expect(assetYFromCanonical("front", faceY)).toBeCloseTo(0.15, 5);
  });

  it("alinha as vistas laterais ao corpo desenhado", () => {
    expect(lateralPointX("left", 0.44)).toBeCloseTo(0.44, 5);
    expect(lateralPointX("left", 0.29)).toBeCloseTo(0.29, 5);
    expect(lateralPointX("right", 0.56)).toBeCloseTo(0.56, 5);
    expect(canonicalBodyY("front", 0.15)).toBeCloseTo(0.115, 2);
  });

  it("mantém toque e marcador no mesmo espaço corporal", () => {
    for (const side of ["front", "back", "left", "right"] as const) {
      const canonicalX = 0.5;
      const canonicalY = 0.5;
      const assetX = assetXFromCanonical(side, canonicalX);
      const assetY = assetYFromCanonical(side, canonicalY);
      expect(canonicalBodyX(side, assetX)).toBeCloseTo(canonicalX, 5);
      expect(canonicalBodyY(side, assetY)).toBeCloseTo(canonicalY, 5);
      expect(assetX).toBeGreaterThan(0.3);
      expect(assetX).toBeLessThan(0.7);
      expect(assetY).toBeGreaterThan(0.09);
      expect(assetY).toBeLessThan(0.91);
    }
  });

  it("prioriza zonas contínuas específicas no atlas frontal", () => {
    expect(resolveAtlasPoint(FRONT_ATLAS, 0.57, 0.115)?.id).toBe("eye-left");
    expect(resolveAtlasPoint(FRONT_ATLAS, 0.66, 0.13)?.id).toBe("ear-left-upper");
    expect(resolveAtlasPoint(FRONT_ATLAS, 0.40, 0.55)?.id).toBe("ovary-right");
    expect(resolveAtlasPoint(atlasForSide("front"), 0.38, 0.46)?.id).toBe("liver");
    expect(resolveAtlasPoint(atlasForSide("front"), 0.60, 0.47)?.id).toBe("stomach");
    expect(resolveAtlasPoint(atlasForSide("front"), 0.51, 0.62)?.id).toBe("bladder");
    expect(resolveAtlasPoint(FRONT_ATLAS, 0.25, 0.45)?.id).toBe("right-elbow-inner");
    expect(resolveAtlasPoint(FRONT_ATLAS, 0.80, 0.62)?.id).toBe("left-thumb-cmc");
    expect(resolveAtlasPoint(atlasForSide("front"), 0.20, 0.565)?.id).toBe("right-thumb-metacarpal");
    expect(resolveAtlasPoint(atlasForSide("front"), 0.42, 0.95)?.id).toBe("right-heel");
    expect(resolveAtlasPoint(atlasForSide("front"), 0.585, 0.988)?.id).toBe("left-little-toe");
  });

  it("resolve zonas contínuas nas vistas posterior e laterais", () => {
    expect(resolveAtlasPoint(BACK_ATLAS, 0.5, 0.32)?.id).toBe("thoracic-spine");
    expect(resolveAtlasPoint(BACK_ATLAS, 0.58, 0.64)?.id).toBe("left-gluteus");
    expect(resolveAtlasPoint(LATERAL_ATLAS.left, 0.30, 0.46)?.id).toBe("left-elbow-inner");
    expect(resolveAtlasPoint(LATERAL_ATLAS.right, 0.70, 0.46)?.id).toBe("right-elbow-inner");
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
