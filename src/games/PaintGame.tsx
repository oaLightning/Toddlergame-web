import {useRef,useState} from 'react';
import type {PointerEvent} from 'react';
import {sound} from '../audio';
import {outlineFor,paintPoint} from './paint-art';
import './paint.css';

export interface PaintGameProps {target?:string;outline?:string;onComplete:()=>void;onRestart?:()=>void;narration:boolean;effects:boolean}
type Point={x:number;y:number};
type Stroke={color:string;width:number;points:Point[]};
const palette=[{color:'#ed7f9d',name:'ורוד'},{color:'#b58bd2',name:'סגול'},{color:'#7eb8d1',name:'כחול'},{color:'#8fc9a5',name:'ירוק'},{color:'#f2d16e',name:'צהוב'},{color:'#eea86e',name:'כתום'},{color:'#bd8a70',name:'חום'},{color:'#686073',name:'אפור'}];
const pathOf=(points:Point[])=>points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')+(points.length===1?` l .1 .1`:'');

export default function PaintGame({target,outline,onComplete,onRestart,effects}:PaintGameProps){
 const [color,setColor]=useState(palette[0].color),[width,setWidth]=useState(20),[eraser,setEraser]=useState(false);
 const [strokes,setStrokes]=useState<Stroke[]>([]),[current,setCurrent]=useState<Stroke|null>(null),[done,setDone]=useState(false);
 const active=useRef<{pointer:number;stroke:Stroke}|null>(null);const canvas=useRef<SVGSVGElement>(null);
 const art=outlineFor(target,outline);
 function restartIfDone(){if(done){setDone(false);onRestart?.();}}
 function point(event:PointerEvent<SVGSVGElement>){return paintPoint(event.clientX,event.clientY,event.currentTarget.getBoundingClientRect());}
 function start(event:PointerEvent<SVGSVGElement>){
  if(active.current||!event.isPrimary||event.button!==0)return;event.preventDefault();restartIfDone();event.currentTarget.setPointerCapture(event.pointerId);
  const stroke:Stroke={color:eraser?'#ffffff':color,width:eraser?width*1.6:width,points:[point(event)]};active.current={pointer:event.pointerId,stroke};setCurrent(stroke);
 }
 function move(event:PointerEvent<SVGSVGElement>){
  const draw=active.current;if(!draw||draw.pointer!==event.pointerId)return;event.preventDefault();const p=point(event),last=draw.stroke.points[draw.stroke.points.length-1];
  if(Math.hypot(p.x-last.x,p.y-last.y)<1)return;draw.stroke={...draw.stroke,points:[...draw.stroke.points,p]};setCurrent(draw.stroke);
 }
 function finish(event?:PointerEvent<SVGSVGElement>){
  const draw=active.current;if(!draw||(event&&draw.pointer!==event.pointerId))return;active.current=null;setStrokes(previous=>[...previous,draw.stroke]);setCurrent(null);
  if(event?.currentTarget.hasPointerCapture(draw.pointer))event.currentTarget.releasePointerCapture(draw.pointer);
 }
 function undo(){restartIfDone();setStrokes(previous=>previous.slice(0,-1));}
 function clear(){restartIfDone();active.current=null;setCurrent(null);setStrokes([]);}
 const ink=[...strokes,...(current?[current]:[])];
 return <section className="paint-game" aria-label={`ציור וצביעה של ${art.name}`}>
  <p className="paint-intro">בחרי צבע וצבעי באצבע או בעכבר. אפשר לצבוע גם מחוץ לקווים.</p>
  <div className="paint-tools" role="group" aria-label="כלי ציור">
   <div className="paint-palette" role="group" aria-label="צבעי המברשת">{palette.map(p=><button key={p.color} type="button" aria-label={p.name} aria-pressed={color===p.color&&!eraser} style={{background:p.color}} className={color===p.color&&!eraser?'selected':''} onClick={()=>{setColor(p.color);setEraser(false);}}/>)}</div>
   <div className="paint-brushes" role="group" aria-label="גודל מברשת">{[{size:10,label:'דקה'},{size:20,label:'בינונית'},{size:34,label:'עבה'}].map(brush=><button key={brush.size} type="button" aria-label={`מברשת ${brush.label}`} aria-pressed={width===brush.size} className={width===brush.size?'selected':''} onClick={()=>setWidth(brush.size)}><span style={{width:brush.size/1.5,height:brush.size/1.5}}/></button>)}</div>
   <button type="button" className={eraser?'selected':''} aria-pressed={eraser} onClick={()=>setEraser(v=>!v)}>⌫ מחק</button>
  </div>
  <div className="paint-paper"><svg ref={canvas} viewBox="0 0 600 420" preserveAspectRatio="none" aria-label={`דף צביעה: ${art.name}`} onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={()=>finish()}>
   <rect width="600" height="420" fill="white"/>
   <g className="paint-ink" pointerEvents="none">{ink.map((stroke,i)=><path key={i} d={pathOf(stroke.points)} fill="none" stroke={stroke.color} strokeWidth={stroke.width} strokeLinecap="round" strokeLinejoin="round"/>)}</g>
   <g className="paint-outline" pointerEvents="none" fill="none" stroke="#4e4856" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">{art.paths.map((d,i)=><path d={d} key={i}/>)}{art.circles?.map((c,i)=><circle key={`c${i}`} {...c}/>)}{art.ellipses?.map((e,i)=><ellipse key={`e${i}`} {...e}/>)}{art.glyph&&<text x="300" y="320" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="300" textAnchor="middle">{art.glyph}</text>}</g>
  </svg></div>
  <div className="paint-bottom"><span className="paint-word">{art.name}</span><div><button type="button" disabled={!strokes.length} onClick={undo}>↶ ביטול קו</button><button type="button" disabled={!strokes.length} onClick={clear}>דף נקי</button></div></div>
  <div className="paint-finish"><button type="button" className="primary" onClick={()=>{if(done)return;setDone(true);if(effects)sound(true);onComplete();}}>סיימתי לצבוע 🎨</button>{done&&<p role="status">איזה ציור יפה! אפשר להמשיך לצייר או לעבור לעמוד הבא.</p>}</div>
 </section>;
}
