/** Legacy cycle length also documents the increasingly brisk pace. */
export function freezeDuration(index: number, frozenCount: number): number {
  return Math.max(1.2, (4.8 + index % 3 * .45) / Math.pow(1.24, Math.max(0, frozenCount)));
}
export function freezeSpeed(frozenCount:number):number {
  // Seven freezes leave one target moving a little over three times as fast.
  return Math.min(3.8,Math.pow(1.21,Math.max(0,frozenCount)));
}
export interface MovingTarget {x:number;y:number;vx:number;vy:number}
/** Reflect at an edge, including overshoot, so targets never get clipped. */
function reflect(value:number,velocity:number,low:number,high:number):[number,number] {
  if(high<=low)return [(low+high)/2,velocity];
  if(value>=low&&value<=high)return [value,velocity];
  const span=high-low,phase=((value-low)%(span*2)+span*2)%(span*2);
  return phase<=span?[low+phase,velocity*(Math.floor((value-low)/span)%2===0?1:-1)]:[high-(phase-span),velocity*(Math.floor((value-low)/span)%2===0?1:-1)];
}
/** Positions/speed are normalized to stage dimensions; edges include button radius. */
export function advanceFreezeTarget(target:MovingTarget,dt:number,speed:number,padX:number,padY:number):MovingTarget {
  const elapsed=Math.max(0,Math.min(dt,.05));
  const [x,vx]=reflect(target.x+target.vx*speed*elapsed,target.vx,padX,1-padX);
  const [y,vy]=reflect(target.y+target.vy*speed*elapsed,target.vy,padY,1-padY);
  return {x,y,vx,vy};
}
export function initialFreezeTarget(index:number,x:number,y:number):MovingTarget {
  const angles=[.62,2.4,3.9,5.35,1.4,3.1,4.65,.1];
  const angle=angles[index%angles.length],pace=.19+(index%3)*.025;
  return {x:x/100,y:y/100,vx:Math.cos(angle)*pace,vy:Math.sin(angle)*pace};
}
