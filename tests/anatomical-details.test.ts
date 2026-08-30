import { describe, expect, it } from "vitest";

import {
  assetYFromCanonical,
  bodyPointToMap,
  canonicalBodyY,
  containedAssetRect,
  mapPointToBody,
} from "@/shared/body-map-geometry";
import { buildPainReport } from "@/lib/pain-reports";
import {
  BODY_SITE_DETAILS,
  PainEntry,
  bodySiteDetailLabel,
} from "@/shared/records";
import { nearestBodyPoint } from "@/shared/body-map-selection";

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

    const report = buildPainReport(
      [entry],
      30,
      new Date("2026-08-27T18:00:00.000Z"),
    );

    expect(report.sites[0]).toMatchObject({
      label: "Acima do olho esquerdo",
      count: 1,
    });
    expect(report.radiation).toEqual([
      { id: "neck-back", label: "Nuca", count: 1 },
      {
        id: "behind-head-left",
        label: "Atrás da cabeça, lado esquerdo",
        count: 1,
      },
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
    const resolvedShoulder = mapPointToBody(
      "front",
      shoulderOnMap.x,
      shoulderOnMap.y,
      mapAspectRatio,
    );

    expect(imageRect.height).toBe(1);
    expect(imageRect.width).toBeLessThan(1);
    expect(imageRect.left).toBeGreaterThan(0);
    expect(resolvedShoulder.x).toBeCloseTo(0.22, 5);
    expect(resolvedShoulder.y).toBeCloseTo(0.2, 5);
  });

  it("seleciona mãos, joelhos e ombros nas quatro vistas sem exigir tocar em um ponto", () => {
    const aspectRatio = 304 / 516;
    const points = {
      front: [
        { id: "hand-right-overview", coarse: "right-hand", x: 0.1, y: 0.45 },
        { id: "knee-right", coarse: "right-knee", x: 0.43, y: 0.75 },
        { id: "chest-center", coarse: "chest", x: 0.5, y: 0.31 },
      ],
      back: [
        { id: "left-shoulder-ac", coarse: "left-shoulder", x: 0.31, y: 0.19 },
        { id: "upper-back-right", coarse: "upper-back", x: 0.6, y: 0.27 },
      ],
      left: [
        { id: "foot-left", coarse: "left-foot", x: 0.35, y: 0.975 },
        { id: "knee-left", coarse: "left-knee", x: 0.49, y: 0.74 },
      ],
    } as const;
    const frontRightHand = bodyPointToMap("front", 0.1, 0.45, aspectRatio);
    const frontRightKnee = bodyPointToMap("front", 0.43, 0.75, aspectRatio);
    const backLeftShoulder = bodyPointToMap("back", 0.31, 0.19, aspectRatio);
    const leftFoot = bodyPointToMap("left", 0.35, 0.975, aspectRatio);

    expect(
      nearestBodyPoint(
        "front",
        points.front,
        frontRightHand.x,
        frontRightHand.y,
        aspectRatio,
      )?.coarse,
    ).toBe("right-hand");
    expect(
      nearestBodyPoint(
        "front",
        points.front,
        frontRightKnee.x,
        frontRightKnee.y,
        aspectRatio,
      )?.coarse,
    ).toBe("right-knee");
    expect(
      nearestBodyPoint(
        "back",
        points.back,
        backLeftShoulder.x,
        backLeftShoulder.y,
        aspectRatio,
      )?.coarse,
    ).toBe("left-shoulder");
    expect(
      nearestBodyPoint("left", points.left, leftFoot.x, leftFoot.y, aspectRatio)
        ?.coarse,
    ).toBe("left-foot");
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
    expect(bodySiteDetailLabel("breast-right-axillary-tail")).toContain(
      "axila",
    );
    expect(bodySiteDetailLabel("right-little-toe")).toContain("mínimo");
  });
});
