import {useEffect,useRef,useState} from 'react';
import type {CSSProperties,PointerEvent} from 'react';
import {assetUrl,sound,speak} from '../audio';
import {drawPuzzleScene,pieceCanSnap,puzzleGrid,PUZZLE_SIZES,shuffledPieces} from './puzzle';
import './puzzle.css';

export interface PuzzleGameProps {onComplete:()=>void;onRestart?:()=>void;narration:boolean;effects:boolean;image?:string}
const pictures=[
 {id:'elsa',name:'אלזה',src:'characters/elsa.webp'},
 {id:'anna',name:'אנה',src:'characters/anna.webp'},
 {id:'bluey',name:'בלואי',src:'characters/bluey.webp'},
 {id:'bingo',name:'בינגו',src:'characters/bingo.webp'},
 {id:'moana',name:'מואנה',src:'characters/moana.webp'},
 {id:'rapunzel',name:'רפונזל',src:'characters/rapunzel.webp'},
];
type Rect={left:number;top:number;width:number;height:number};
type Drag={id:number;x:number;y:number;rx:number;ry:number;width:number;height:number;startX:number;startY:number;home:Rect};
type ReturnPiece={id:number;from:Rect;to:Rect};
export default function PuzzleGame({onComplete,onRestart,narration,effects,image}:PuzzleGameProps){
 const [picture,setPicture]=useState(pictures[0]);
 const [count,setCount]=useState<number>(20);
 const [order,setOrder]=useState(()=>shuffledPieces(20));
 const [placed,setPlaced]=useState<number[]>([]);
 const [selected,setSelected]=useState<number|null>(null);
 const [drag,setDrag]=useState<Drag|null>(null);
 const [returning,setReturning]=useState<ReturnPiece|null>(null);
 const dragRef=useRef<Drag|null>(null);
 const returnRef=useRef<HTMLDivElement>(null);
 const pieces=useRef<Record<number,HTMLButtonElement|null>>({});
 const board=useRef<HTMLDivElement>(null);
 const [art,setArt]=useState('');
 const [error,setError]=useState('');
 const [note,setNote]=useState('');
 const complete=useRef(false);
 const {columns,rows}=puzzleGrid(count);
 const src=image??picture.src;

 useEffect(()=>{
  let cancelled=false;setArt('');setError('');
  const img=new Image();
  img.onload=()=>{
   const canvas=document.createElement('canvas');canvas.width=600;canvas.height=800;
   const ctx=canvas.getContext('2d');
   if(!ctx){setError('לא הצלחנו להכין את התמונה. נסי תמונה אחרת.');return;}
   drawPuzzleScene(ctx,picture.id);
   // A smaller portrait preserves the surrounding story scene across all puzzle rows.
   const frame={x:173,y:240,w:254,h:340};
   ctx.save();ctx.shadowColor='#77638a44';ctx.shadowBlur=14;ctx.fillStyle='#fff9ed';
   ctx.beginPath();ctx.roundRect(frame.x-9,frame.y-9,frame.w+18,frame.h+18,90);ctx.fill();ctx.restore();
   ctx.save();ctx.beginPath();ctx.roundRect(frame.x,frame.y,frame.w,frame.h,82);ctx.clip();
   const scale=Math.max(frame.w/img.naturalWidth,frame.h/img.naturalHeight);
   const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
   ctx.fillStyle='#e7d8eb';ctx.fillRect(frame.x,frame.y,frame.w,frame.h);
   ctx.drawImage(img,frame.x+(frame.w-w)/2,frame.y+(frame.h-h)/2,w,h);ctx.restore();
   ctx.strokeStyle='#fff8ec';ctx.lineWidth=6;ctx.beginPath();ctx.roundRect(frame.x,frame.y,frame.w,frame.h,82);ctx.stroke();
   if(!cancelled)setArt(canvas.toDataURL('image/webp',.92));
  };
  img.onerror=()=>{if(!cancelled)setError('התמונה לא נטענה. בחרי תמונה אחרת.');};
  img.src=assetUrl(src);return()=>{cancelled=true;};
 },[src,picture.id]);

 useEffect(()=>{
  if(!returning||!returnRef.current)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setReturning(null);return;}
  let active=true;
  const from=returning.from,to=returning.to;
  const animation=returnRef.current.animate([
   {left:`${from.left}px`,top:`${from.top}px`,width:`${from.width}px`,height:`${from.height}px`,opacity:.98},
   {left:`${to.left}px`,top:`${to.top}px`,width:`${to.width}px`,height:`${to.height}px`,opacity:1},
  ],{duration:470,easing:'cubic-bezier(.25,.7,.25,1)',fill:'forwards'});
  void animation.finished.then(()=>{if(active)setReturning(null);}).catch(()=>{});
  return()=>{active=false;animation.cancel();};
 },[returning]);

 function reset(nextCount=count){
  onRestart?.();setOrder(shuffledPieces(nextCount));setPlaced([]);setSelected(null);setDrag(null);setReturning(null);
  dragRef.current=null;complete.current=false;setNote('');
 }
 function place(id:number){
  if(placed.includes(id))return;
  const next=[...placed,id];setPlaced(next);setSelected(null);setNote('החלק מצא את מקומו!');
  if(effects)sound(true);
  if(next.length===count&&!complete.current){complete.current=true;onComplete();}
 }
 function trySlot(id:number,slot:number){
  if(id===slot)place(id);
  else{setSelected(null);setNote('ננסה מקום אחר. החלק נשאר במגש.');if(effects)sound(false);}
 }
 function down(event:PointerEvent<HTMLButtonElement>,id:number){
  if(placed.includes(id)||returning||!board.current||!art)return;
  event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId);
  const rect=event.currentTarget.getBoundingClientRect(),r=board.current.getBoundingClientRect();
  const d={id,x:event.clientX,y:event.clientY,rx:(event.clientX-rect.left)/rect.width,ry:(event.clientY-rect.top)/rect.height,
   width:r.width/columns,height:r.height/rows,startX:event.clientX,startY:event.clientY,
   home:{left:rect.left,top:rect.top,width:rect.width,height:rect.height}};
  dragRef.current=d;setDrag(d);setSelected(null);
 }
 function move(event:PointerEvent<HTMLButtonElement>){
  if(!dragRef.current)return;
  const next={...dragRef.current,x:event.clientX,y:event.clientY};dragRef.current=next;setDrag(next);
 }
 function returnHome(d:Drag,x:number,y:number){
  const currentHome=pieces.current[d.id]?.getBoundingClientRect();
  const to=currentHome?{left:currentHome.left,top:currentHome.top,width:currentHome.width,height:currentHome.height}:d.home;
  setReturning({id:d.id,from:{left:x-d.rx*d.width,top:y-d.ry*d.height,width:d.width,height:d.height},to});
  setNote('ננסה מקום אחר. החלק מחליק בחזרה למגש.');if(effects)sound(false);
 }
 function up(event:PointerEvent<HTMLButtonElement>){
  const d=dragRef.current;if(!d||!board.current)return;
  dragRef.current=null;setDrag(null);
  if(Math.hypot(event.clientX-d.startX,event.clientY-d.startY)<8){setSelected(d.id);setNote('עכשיו לחצי על המקום של החלק בתמונה.');return;}
  const r=board.current.getBoundingClientRect(),width=r.width/columns,height=r.height/rows;
  const targetX=r.left+(d.id%columns)*width,targetY=r.top+Math.floor(d.id/columns)*height;
  if(pieceCanSnap(event.clientX-d.rx*width,event.clientY-d.ry*height,targetX,targetY,width,height))place(d.id);
  else returnHome(d,event.clientX,event.clientY);
 }
 const styleFor=(id:number):CSSProperties=>({backgroundImage:`url("${art}")`,backgroundSize:`${columns*100}% ${rows*100}%`,backgroundPosition:`${columns===1?0:(id%columns)/(columns-1)*100}% ${rows===1?0:Math.floor(id/columns)/(rows-1)*100}%`});
 function tray(ids:number[],side:string){
  return <div className={`puzzle-tray ${side}`} aria-label="מגש חלקים">{ids.map(id=><button type="button" key={id} ref={el=>{pieces.current[id]=el;}}
   disabled={placed.includes(id)||!art||!!returning}
   className={`puzzle-piece ${placed.includes(id)?'puzzle-used':''} ${selected===id?'puzzle-selected':''} ${drag?.id===id||returning?.id===id?'puzzle-dragging':''}`}
   style={styleFor(id)} aria-label={`חלק ${id+1}${placed.includes(id)?', הונח':''}`} aria-pressed={selected===id}
   onPointerDown={e=>down(e,id)} onPointerMove={move} onPointerUp={up}
   onPointerCancel={()=>{const d=dragRef.current;dragRef.current=null;setDrag(null);if(d)returnHome(d,d.x,d.y);}}
   onClick={e=>{if(e.detail===0){setSelected(id);setNote('בחרי את המקום בתמונה עם לחיצה או מקש אנטר.');}}}>
   <span className="puzzle-piece-number">{id+1}</span></button>)}</div>;
 }
 return <section className="puzzle-game" dir="rtl" aria-label="פאזל תמונות">
  <div className="puzzle-pickers"><label>התמונה שלנו <select value={picture.id} disabled={!!image} onChange={e=>{const next=pictures.find(p=>p.id===e.target.value)!;setPicture(next);reset();}}>{pictures.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
   <label>כמה חלקים? <select value={count} onChange={e=>{const n=Number(e.target.value);setCount(n);reset(n);}}>{PUZZLE_SIZES.map(n=><option key={n} value={n}>{n} חלקים</option>)}</select></label><button className="quiet" onClick={()=>reset()}>↶ פאזל חדש</button></div>
  <p className="puzzle-hint">גררי חלק צבעוני למקום שלו בתמונה. אפשר גם ללחוץ על חלק ואז על המקום שלו.</p>
  <p className="puzzle-progress" aria-live="polite">{placed.length} מתוך {count} חלקים מצאו מקום {placed.length===count?'✨':''}</p>
  {error?<p role="alert">{error}</p>:<div className="puzzle-layout" style={{'--puzzle-cols':columns,'--puzzle-rows':rows,'--puzzle-tray-cols':count>=30?3:2} as CSSProperties}>
   {tray(order.slice(0,Math.ceil(count/2)),'puzzle-tray-first')}
   <div className="puzzle-board" ref={board} role="group" aria-label="תמונת הפאזל בשחור ולבן"><div className="puzzle-guide" style={{backgroundImage:`url("${art}")`}}/>
    {Array.from({length:count},(_,id)=><button type="button" key={id} className={`puzzle-slot ${placed.includes(id)?'puzzle-filled':''}`} style={placed.includes(id)?styleFor(id):undefined} aria-label={`מקום ${id+1}${placed.includes(id)?', הושלם':''}`} disabled={placed.includes(id)||selected===null||!!returning} onClick={()=>{if(selected!==null)trySlot(selected,id);}}/>)}</div>
   {tray(order.slice(Math.ceil(count/2)),'puzzle-tray-last')}</div>}
  <p className="puzzle-note" role="status">{note||'כל חלק יכול לחזור למגש. אין צורך למהר.'}</p>
  {placed.length===count&&<div className="puzzle-finished"><strong>התמונה שלמה! איזה יופי 💜</strong><button className="primary" onClick={()=>{reset();speak('בואי נרכיב שוב את הפאזל.','he',undefined,narration);}}>נרכיב שוב</button></div>}
  {drag&&<div className="puzzle-floating" aria-hidden="true" style={{...styleFor(drag.id),left:drag.x-drag.rx*drag.width,top:drag.y-drag.ry*drag.height,width:drag.width,height:drag.height}}/>}
  {returning&&<div ref={returnRef} className="puzzle-floating puzzle-returning" aria-hidden="true" style={{...styleFor(returning.id),...returning.from}}/>}
 </section>;
}
