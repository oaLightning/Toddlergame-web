import {useRef,useState} from 'react';
import type {PointerEvent} from 'react';
import {numeralSlots,numeralTemplates} from './numeral-input';
import './numeral-games.css';
export default function NumberShapeGame({target='1',letters=['א','ב','ג','ד'],onSuccess,onWrong}:{target?:string;letters?:string[];onSuccess:()=>void;onWrong:()=>void}){
 const slots=numeralSlots(target),bank=letters.length?letters:['א'];
 const [placed,setPlaced]=useState<Record<number,string>>({}),[selected,setSelected]=useState(bank[0]),[drag,setDrag]=useState<{x:number;y:number;letter:string}|null>(null);
 const active=useRef<{pointer:number;letter:string;startX:number;startY:number}|null>(null),board=useRef<SVGSVGElement>(null),done=useRef(false);
 function place(index:number,letter:string){if(placed[index])return;const next={...placed,[index]:letter};setPlaced(next);if(Object.keys(next).length===slots.length&&!done.current){done.current=true;onSuccess();}}
 function start(e:PointerEvent<HTMLButtonElement>,letter:string){if(!e.isPrimary||e.button!==0)return;setSelected(letter);active.current={pointer:e.pointerId,letter,startX:e.clientX,startY:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);}
 function move(e:PointerEvent<HTMLButtonElement>){const a=active.current;if(a?.pointer!==e.pointerId)return;if(Math.hypot(e.clientX-a.startX,e.clientY-a.startY)>8)setDrag({x:e.clientX,y:e.clientY,letter:a.letter});}
 function finish(e:PointerEvent<HTMLButtonElement>){const a=active.current;if(!a||a.pointer!==e.pointerId)return;active.current=null;setDrag(null);if(Math.hypot(e.clientX-a.startX,e.clientY-a.startY)<=8)return;const rect=board.current?.getBoundingClientRect();if(!rect)return;const p={x:(e.clientX-rect.left)/rect.width*250,y:(e.clientY-rect.top)/rect.height*240};let nearest=-1,distance=Infinity;slots.forEach((s,i)=>{if(placed[i])return;const d=Math.hypot(p.x-s.x,p.y-s.y);if(d<distance){nearest=i;distance=d;}});if(nearest>=0&&distance<35)place(nearest,a.letter);else onWrong();}
 return <section className="number-shape-game" aria-label={`יוצרים את צורת הספרה ${target} מאותיות`}>
  <p>האותיות הן חלקי יצירה. מניחים אותיות על המסלול ויוצרים את צורת הספרה {target}.</p><p className="muted">זה משחק בצורות: לאותיות כאן אין ערך של מספר.</p>
  <div className="shape-letter-bank" aria-label="בחירת חלקי אותיות">{bank.map(letter=><button key={letter} aria-pressed={selected===letter} onClick={()=>setSelected(letter)} onPointerDown={e=>start(e,letter)} onPointerMove={move} onPointerUp={finish} onPointerCancel={()=>{active.current=null;setDrag(null);}} onLostPointerCapture={()=>{active.current=null;setDrag(null);}}>{letter}</button>)}</div>
  <p className="muted">אפשר לגרור אות, או לבחור אות ואז לגעת בעיגול ריק.</p>
  <div className="number-shape-board"><svg ref={board} viewBox="0 0 250 240" role="img" aria-label={`מסלול הספרה ${target}`}>{(numeralTemplates[target]??numeralTemplates['1']).map((stroke,i)=><path key={`guide-${i}`} d={stroke.map((p,j)=>`${j?'L':'M'}${55+p.x*1.7} ${35+p.y*1.7}`).join(' ')} fill="none" stroke="#eee4f0" strokeWidth="29" strokeLinecap="round" strokeLinejoin="round"/>)}{slots.map((s,i)=><g key={i}><circle cx={s.x} cy={s.y} r="16" fill={placed[i]?'#f6d7e5':'#fff'} stroke="#b28dc6" strokeDasharray={placed[i]?undefined:'3 3'}/>{placed[i]&&<text x={s.x} y={s.y+10} textAnchor="middle" fontSize="28" fill="#74508e">{placed[i]}</text>}</g>)}</svg><div className="shape-slot-layer">{slots.map((s,i)=><button key={i} style={{left:`${s.x/250*100}%`,top:`${s.y/240*100}%`}} aria-label={`מקום ${i+1} ${placed[i]?'מלא':'ריק'}`} aria-disabled={!!placed[i]} onClick={()=>place(i,selected)}/>)}</div></div>
  <p role="status">{Object.keys(placed).length} מתוך {slots.length} חלקים</p>{drag&&<div className="letter-drag-preview" aria-hidden="true" style={{left:drag.x,top:drag.y}}>{drag.letter}</div>}
 </section>;
}
