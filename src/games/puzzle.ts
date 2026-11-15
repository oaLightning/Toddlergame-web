export const PUZZLE_SIZES = [20, 30, 40, 60] as const;
export function puzzleGrid(count: number): { columns: number; rows: number } {
  const layouts: Record<number, [number, number]> = {20:[4,5],30:[5,6],40:[5,8],60:[6,10]};
  const [columns,rows] = layouts[count] ?? layouts[20];
  return {columns, rows};
}
/** Compare the dragged piece's origin with its one correct slot. Adjacent cells never qualify. */
export function pieceCanSnap(dropX:number,dropY:number,targetX:number,targetY:number,width:number,height:number):boolean {
  if(width<=0||height<=0)return false;
  return Math.abs(dropX-targetX)<=width*.62 && Math.abs(dropY-targetY)<=height*.62;
}
export function shuffledPieces(count:number, random:()=>number=Math.random):number[] {
  const result=Array.from({length:count},(_,i)=>i);
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
