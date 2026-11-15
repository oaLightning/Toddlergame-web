/** Offline, assisted digit recognition. Suggestions always need the child's confirmation. */
export type InkPoint={x:number;y:number};
export type DigitGuess={digit:string;distance:number};
const shapes:Record<string,number[][][]>={
 '0':[[[50,0],[20,5],[0,35],[0,70],[20,100],[50,100],[75,70],[75,30],[50,0]]],
 '1':[[[10,25],[45,0],[45,100]]],
 '2':[[[0,20],[15,0],[50,0],[75,20],[75,40],[0,100],[80,100]]],
 '3':[[[0,5],[45,0],[75,20],[55,45],[25,50],[60,55],[80,80],[55,100],[0,95]]],
 '4':[[[60,0],[0,65],[80,65]],[[60,0],[60,100]]],
 '5':[[[75,0],[5,0],[5,45],[50,40],[75,60],[75,85],[50,100],[0,90]]],
 '6':[[[70,0],[30,0],[0,45],[0,80],[25,100],[60,95],[75,70],[60,45],[25,45],[0,70]]],
 '7':[[[0,0],[80,0],[20,100]]],
 '8':[[[40,50],[0,25],[15,0],[60,0],[80,25],[40,50],[0,75],[15,100],[60,100],[80,75],[40,50]]],
 '9':[[[75,45],[45,55],[10,45],[0,20],[20,0],[55,0],[75,25],[75,65],[50,100],[10,100]]],
};
// Keep template data legible as coordinate pairs above, and convert only once.
export const numeralTemplates:Record<string,InkPoint[][]>=Object.fromEntries(Object.entries(shapes).map(([digit,strokes])=>[digit,strokes.map(stroke=>stroke.map(p=>({x:p[0],y:p[1]})))]));
export function normalizedInk(strokes:InkPoint[][]):InkPoint[][] {
 const points=strokes.flat();if(!points.length)return [];
 const minX=Math.min(...points.map(p=>p.x)),minY=Math.min(...points.map(p=>p.y));
 const width=Math.max(...points.map(p=>p.x))-minX,height=Math.max(...points.map(p=>p.y))-minY;
 // Uniform scaling retains the narrowness of a 1; independent scaling would lose it.
 const scale=100/Math.max(width,height,1);
 return strokes.map(stroke=>stroke.map(p=>({x:(p.x-minX)*scale,y:(p.y-minY)*scale})));
}
function samples(strokes:InkPoint[][]):InkPoint[]{
 return strokes.flatMap(stroke=>stroke.flatMap((p,i)=>{if(!i)return [p];const prev=stroke[i-1],length=Math.hypot(p.x-prev.x,p.y-prev.y),n=Math.max(1,Math.ceil(length/3));return Array.from({length:n},(_,j)=>({x:prev.x+(p.x-prev.x)*(j+1)/n,y:prev.y+(p.y-prev.y)*(j+1)/n}));}));
}
function meanDistance(a:InkPoint[],b:InkPoint[]):number{return a.reduce((sum,p)=>sum+Math.min(...b.map(q=>Math.hypot(p.x-q.x,p.y-q.y))),0)/a.length;}
export function recognizeDigit(strokes:InkPoint[][]):DigitGuess[]{
 const raw=strokes.flat();if(raw.length<3||raw.length>6000||raw.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)))return [];
 const span=Math.max(Math.max(...raw.map(p=>p.x))-Math.min(...raw.map(p=>p.x)),Math.max(...raw.map(p=>p.y))-Math.min(...raw.map(p=>p.y)));
 if(span<12)return [];
 const normalized=normalizedInk(strokes);
 const length=normalized.reduce((sum,stroke)=>sum+stroke.reduce((subtotal,p,i)=>subtotal+(i?Math.hypot(p.x-stroke[i-1].x,p.y-stroke[i-1].y):0),0),0);
 if(length>800)return [];
 const ink=samples(normalized);
 const guesses=Object.entries(numeralTemplates).map(([digit,template])=>{const guide=samples(normalizedInk(template));return {digit,distance:(meanDistance(ink,guide)+meanDistance(guide,ink))/2};}).sort((a,b)=>a.distance-b.distance);
 // Unrelated scribbles are not labelled. Close alternatives remain explicit suggestions.
 return guesses[0].distance>10||guesses[1].distance-guesses[0].distance<.25?[]:guesses.slice(0,3);
}
/** Small letter tiles following the digit's path make a number mosaic, not gematria. */
export function numeralSlots(digit:string):InkPoint[]{
 const lines=numeralTemplates[digit]??numeralTemplates['1'];const pts=samples(lines),result:InkPoint[]=[];
 for(const p of pts){if(result.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>23))result.push(p);}
 return result.map(p=>({x:55+p.x*1.7,y:35+p.y*1.7}));
}
