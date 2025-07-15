import Color from "colorjs.io";

export function mixN(
  colors: Color[] | readonly Color[],
  t: number,
  space: string,
  outputSpace: string
): Color {
  const n = colors.length;
  if (n === 0) {
    throw new Error("mixColors requires at least one colour");
  }

  // Single-colour edge case
  if (n === 1) {
    return colors[0].to(outputSpace);
  }

  // Clamp and locate segment
  const clampedT = Math.min(1, Math.max(0, t));
  const segmentLen = 1 / (n - 1);
  const segmentIndex = Math.min(n - 2, Math.floor(clampedT / segmentLen));
  const localT = (clampedT - segmentIndex * segmentLen) / segmentLen;

  // Blend within the located segment
  return colors[segmentIndex].mix(colors[segmentIndex + 1], localT, {
    space,
    outputSpace,
  });
}
