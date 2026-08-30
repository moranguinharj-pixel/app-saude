import type { AtlasZone } from "./body-atlas";
import type { BodySiteDetailId } from "./records";

function zone(id: BodySiteDetailId, coarse: "left-hand" | "right-hand" | "left-foot" | "right-foot", side: "front", x: number, y: number, w: number, h: number): AtlasZone {
  return { id, coarse, layer: "musculoskeletal", side, bounds: { xMin: x - w / 2, xMax: x + w / 2, yMin: y - h / 2, yMax: y + h / 2 } };
}

const handFingerNames = ["index", "middle", "ring", "little"] as const;
const handJointNames = ["mcp", "pip", "dip"] as const;
const handX = { right: [0.17, 0.14, 0.11, 0.08], left: [0.83, 0.86, 0.89, 0.92] };

export const FRONT_DIGIT_ATLAS: AtlasZone[] = [
  ...(["right", "left"] as const).flatMap((side) => {
    const coarse = `${side}-hand` as "left-hand" | "right-hand";
    const xs = handX[side];
    return [
      zone(`${side}-thumb-mcp`, coarse, "front", side === "right" ? 0.20 : 0.80, 0.535, 0.035, 0.028),
      zone(`${side}-thumb-ip`, coarse, "front", side === "right" ? 0.21 : 0.79, 0.515, 0.03, 0.025),
      zone(`${side}-thumb-metacarpal`, coarse, "front", side === "right" ? 0.20 : 0.80, 0.565, 0.035, 0.035),
      ...handFingerNames.flatMap((finger, index) => handJointNames.map((joint, jointIndex) => zone(
        `${side}-${finger}-${joint}` as BodySiteDetailId,
        coarse,
        "front",
        xs[index],
        0.535 - jointIndex * 0.025,
        0.026,
        0.022,
      ))),
      ...handFingerNames.map((finger, index) => zone(`${side}-${finger}-metacarpal` as BodySiteDetailId, coarse, "front", xs[index], 0.565, 0.03, 0.035)),
    ];
  }),
  ...(["right", "left"] as const).flatMap((side) => {
    const coarse = `${side}-foot` as "left-foot" | "right-foot";
    const baseX = side === "right" ? 0.39 : 0.61;
    const toeXs = side === "right" ? [0.37, 0.385, 0.40, 0.415] : [0.63, 0.615, 0.60, 0.585];
    const toes = ["second", "third", "fourth", "little"] as const;
    return [
      zone(`${side}-big-toe-mtp`, coarse, "front", side === "right" ? 0.365 : 0.635, 0.975, 0.025, 0.018),
      zone(`${side}-big-toe-ip`, coarse, "front", side === "right" ? 0.355 : 0.645, 0.988, 0.022, 0.016),
      ...toes.flatMap((toe, index) => [
        zone(`${side}-${toe}-toe` as BodySiteDetailId, coarse, "front", toeXs[index], 0.988, 0.022, 0.016),
        zone(`${side}-${toe}-toe-mtp` as BodySiteDetailId, coarse, "front", toeXs[index], 0.968, 0.022, 0.016),
        zone(`${side}-${toe}-toe-pip` as BodySiteDetailId, coarse, "front", toeXs[index], 0.980, 0.020, 0.014),
        zone(`${side}-${toe}-toe-dip` as BodySiteDetailId, coarse, "front", toeXs[index], 0.990, 0.018, 0.014),
      ]),
    ];
  }),
];
