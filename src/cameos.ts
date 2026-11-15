export const cameoSpots = ['bottom-left','bottom-right','top-left','top-right'] as const;
export type CameoSpot = typeof cameoSpots[number];
export function nextCameoSpot(previous: CameoSpot, random = Math.random()): CameoSpot {
  const options=cameoSpots.filter(spot=>spot!==previous);
  return options[Math.min(options.length-1,Math.max(0,Math.floor(random*options.length)))];
}
