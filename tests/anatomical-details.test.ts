import { describe, expect, it } from "vitest";

import { buildPainReport } from "@/lib/pain-reports";
import { PainEntry } from "@/shared/records";

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
});
