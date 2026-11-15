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

export interface PuzzleLandmark { x:number; y:number; kind:number; size:number; hue:number }
/** One distinctive, non-flat visual landmark in every tile of the densest grid. */
export function puzzleLandmarks(seed=0):PuzzleLandmark[] {
  return Array.from({length:60},(_,i)=>({
    x:(i%6)*100+24+(i*17+seed*11)%49,
    y:Math.floor(i/6)*80+18+(i*13+seed*7)%43,
    kind:(i+seed)%5,size:10+(i*7+seed)%14,hue:(i*47+seed*29)%360,
  }));
}

export function drawPuzzleScene(ctx:CanvasRenderingContext2D,theme:string):void {
  const icy=theme==='elsa'||theme==='anna',island=theme==='moana',lantern=theme==='rapunzel';
  const sky=ctx.createLinearGradient(0,0,0,800);
  sky.addColorStop(0,icy?'#b9d8f2':island?'#a9dfe9':lantern?'#a9a2d4':'#b9e0f0');
  sky.addColorStop(.5,icy?'#e4e3f5':'#f8d7d8');sky.addColorStop(1,icy?'#c2dce9':island?'#65bdbb':'#b9dcae');
  ctx.fillStyle=sky;ctx.fillRect(0,0,600,800);
  // Sun/moon, clouds and a rainbow give the sky large, recognizable landmarks.
  ctx.fillStyle=lantern?'#fff0b6':'#ffe29b';ctx.beginPath();ctx.arc(505,72,42,0,Math.PI*2);ctx.fill();
  const clouds=[[47,60,1],[210,115,.8],[400,165,.65],[92,218,.7]];
  for(const [x,y,scale] of clouds){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.fillStyle='#ffffffc9';for(const [cx,cy,r] of [[0,0,23],[27,-14,31],[62,0,25]]){ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();}ctx.restore();}
  for(let i=0;i<4;i++){ctx.strokeStyle=['#e8a9b9','#efcd9c','#b4d1bc','#a9c3df'][i];ctx.lineWidth=9;ctx.beginPath();ctx.arc(280,242,150-i*12,Math.PI,Math.PI*2);ctx.stroke();}
  // Distant hills have different silhouettes, so adjacent pieces aren't interchangeable.
  ctx.fillStyle=icy?'#a6bfdc':'#9ec6b0';ctx.beginPath();ctx.moveTo(0,355);ctx.lineTo(79,227);ctx.lineTo(163,341);ctx.lineTo(299,246);ctx.lineTo(443,342);ctx.lineTo(540,225);ctx.lineTo(600,321);ctx.lineTo(600,800);ctx.lineTo(0,800);ctx.fill();
  ctx.fillStyle=icy?'#d8edf2':island?'#86cebd':'#bbdaa5';ctx.beginPath();ctx.moveTo(0,466);ctx.bezierCurveTo(160,330,363,484,600,363);ctx.lineTo(600,800);ctx.lineTo(0,800);ctx.fill();
  ctx.fillStyle=icy?'#f2f7f9':island?'#e7d3a4':'#decea9';ctx.beginPath();ctx.moveTo(400,800);ctx.bezierCurveTo(110,625,550,559,403,394);ctx.lineTo(451,394);ctx.bezierCurveTo(590,565,202,634,507,800);ctx.fill();
  // A castle / colorful playhouse sits off-center; details cross several puzzle seams.
  ctx.fillStyle=icy?'#d6d1ed':lantern?'#e8c5dc':'#eed7b3';ctx.fillRect(24,278,118,177);
  for(const x of [20,63,106]){ctx.fillRect(x,244,40,52);ctx.fillStyle=icy?'#9ea8ce':'#ce9bb5';ctx.beginPath();ctx.moveTo(x-6,245);ctx.lineTo(x+20,204);ctx.lineTo(x+46,245);ctx.fill();ctx.fillStyle=icy?'#d6d1ed':'#eed7b3';}
  ctx.fillStyle='#9f92b6';ctx.beginPath();ctx.roundRect(65,382,34,73,[17,17,0,0]);ctx.fill();
  for(const [x,y] of [[40,308],[99,308],[40,351],[99,351]]){ctx.fillStyle='#7ca4bc';ctx.fillRect(x,y,18,24);ctx.strokeStyle='#fff6';ctx.lineWidth=2;ctx.strokeRect(x,y,18,24);}
  // Different trees line both edges all the way down, instead of a plain border.
  for(const [x,y,size] of [[535,292,46],[56,501,34],[554,531,37],[30,669,30],[528,727,39]]){
    ctx.fillStyle='#9d826f';ctx.fillRect(x-5,y,10,size*1.6);ctx.fillStyle=icy?'#b5d8dd':'#91bd9b';
    if(icy){for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(x,y-size+k*size*.5);ctx.lineTo(x-size*.8,y+size*.4+k*size*.5);ctx.lineTo(x+size*.8,y+size*.4+k*size*.5);ctx.fill();}}
    else{for(const [dx,dy,r] of [[-size*.4,0,size*.6],[size*.4,0,size*.6],[0,-size*.4,size*.7]]){ctx.beginPath();ctx.arc(x+dx,y+dy,r,0,Math.PI*2);ctx.fill();}}
  }
  // A winding stream and stepping stones make the bottom rows identifiable.
  ctx.strokeStyle=icy?'#9dc5dd':'#74bccc';ctx.lineWidth=57;ctx.beginPath();ctx.moveTo(-20,714);ctx.bezierCurveTo(130,635,173,846,335,756);ctx.bezierCurveTo(411,705,460,815,620,778);ctx.stroke();
  for(const [x,y,r] of [[58,733,17],[163,742,13],[285,783,18],[397,762,15],[494,784,19]]){ctx.fillStyle='#e0d8cc';ctx.beginPath();ctx.ellipse(x,y,r,r*.55,.2,0,Math.PI*2);ctx.fill();}
  // Deliberately varied landmark motifs fill every 100x80 cell, including sky corners.
  for(const mark of puzzleLandmarks(theme.length)){
    const {x,y,size,hue}=mark;ctx.save();ctx.translate(x,y);ctx.rotate((hue%65-32)*Math.PI/180);ctx.lineWidth=2.5;
    const accent=`hsl(${hue} 43% 72%)`;ctx.fillStyle=accent;ctx.strokeStyle=icy?'#7198b9':'#77986e';
    if(mark.kind===0){ // flowers / snowflakes
      if(icy){for(let i=0;i<3;i++){ctx.rotate(Math.PI/3);ctx.beginPath();ctx.moveTo(-size,0);ctx.lineTo(size,0);ctx.stroke();}ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fill();}
      else{ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,size*1.8);ctx.stroke();for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ctx.beginPath();ctx.ellipse(Math.cos(a)*size*.5,Math.sin(a)*size*.5,size*.5,size*.35,a,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#f6dc99';ctx.beginPath();ctx.arc(0,0,size*.25,0,Math.PI*2);ctx.fill();}
    }else if(mark.kind===1){ // butterflies
      ctx.beginPath();ctx.ellipse(-size*.45,0,size*.5,size*.8,-.4,0,Math.PI*2);ctx.ellipse(size*.45,0,size*.5,size*.8,.4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(0,-size*.6);ctx.lineTo(0,size*.7);ctx.stroke();
    }else if(mark.kind===2){ // outlined stars / lanterns
      if(lantern){ctx.fillRect(-size*.45,-size*.65,size*.9,size*1.3);ctx.strokeRect(-size*.45,-size*.65,size*.9,size*1.3);ctx.fillStyle='#fff4b5';ctx.fillRect(-3,-size*.4,6,size*.8);}
      else{ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?size*.45:size;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.stroke();}
    }else if(mark.kind===3){ // little birds
      ctx.beginPath();ctx.moveTo(-size,0);ctx.quadraticCurveTo(-size*.5,-size,0,0);ctx.quadraticCurveTo(size*.5,-size,size,0);ctx.stroke();
    }else{ // patterned gifts / shells
      ctx.beginPath();ctx.roundRect(-size*.7,-size*.55,size*1.4,size*1.1,5);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(0,-size*.55);ctx.lineTo(0,size*.55);ctx.moveTo(-size*.7,0);ctx.lineTo(size*.7,0);ctx.stroke();
    }ctx.restore();
  }
}
