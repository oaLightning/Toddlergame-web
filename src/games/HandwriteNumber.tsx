import {useRef,useState} from 'react';
import type {PointerEvent} from 'react';
import {recognizeDigit} from './numeral-input';
import type {InkPoint} from './numeral-input';
import './numeral-games.css';
/** This is assisted recognition, not a claim that a toddler's handwriting was wrong. */
export default function HandwriteNumber({answer,onSuccess,onWrong}:{answer:number;onSuccess:()=>void;onWrong:()=>void}){
 const [strokes,setStrokes]=useState<InkPoint[][]>([]),[current,setCurrent]=useState<InkPoint[]>([]),[suggestions,setSuggestions]=useState<string[]>([]),[entry,setEntry]=useState(''),[keypad,setKeypad]=useState(false),[message,setMessage]=useState('');
 const active=useRef<{id:number;points:InkPoint[]}|null>(null);
 function point(e:PointerEvent<SVGSVGElement>){const r=e.currentTarget.getBoundingClientRect();return {x:Math.max(0,Math.min(240,(e.clientX-r.left)/r.width*240)),y:Math.max(0,Math.min(240,(e.clientY-r.top)/r.height*240))};}
 function start(e:PointerEvent<SVGSVGElement>){if(active.current||!e.isPrimary||e.button!==0||strokes.length>=5||entry.length>=2)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);const p=[point(e)];active.current={id:e.pointerId,points:p};setCurrent(p);setSuggestions([]);setMessage('');}
 function move(e:PointerEvent<SVGSVGElement>){if(active.current?.id!==e.pointerId)return;const p=point(e),last=active.current.points.at(-1)!;if(Math.hypot(p.x-last.x,p.y-last.y)<1.5||active.current.points.length>=1000)return;active.current.points=[...active.current.points,p];setCurrent(active.current.points);}
 function finish(e:PointerEvent<SVGSVGElement>){const stroke=active.current;if(!stroke||stroke.id!==e.pointerId)return;active.current=null;setStrokes(s=>[...s,stroke.points]);setCurrent([]);if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}
 function reset(){active.current=null;setCurrent([]);setStrokes([]);setSuggestions([]);setMessage('');}
 function confirm(digit:string){setEntry(v=>(v+digit).slice(0,2));reset();}
 function check(){if(!entry)return;if(Number(entry)===answer){setMessage('כל הכבוד!');onSuccess();}else{setMessage('ננסה שוב יחד. אפשר למחוק או לבחור ספרות.');onWrong();}}
 return <section className="handwrite-number" aria-label="תשובה בציור ספרות">
  <p>מציירים ספרה אחת בכל פעם. המחשב מציע ספרות, ואת בוחרת למה התכוונת.</p>
  <output className="number-entry" dir="ltr" aria-label="התשובה שלי" aria-live="polite">{entry||'?'}</output>
  {!keypad&&<><svg viewBox="0 0 240 240" className="handwrite-paper" role="img" aria-label="ציירי כאן ספרה אחת" onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={e=>{if(active.current?.id===e.pointerId)finish(e);}}><path d="M20 205 H220" stroke="#e9dfee" strokeDasharray="4 6"/>{[...strokes,...(current.length?[current]:[])].map((stroke,i)=><path key={i} d={stroke.map((p,j)=>`${j?'L':'M'}${p.x} ${p.y}`).join(' ')} fill="none" stroke="#9766b0" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>)}</svg>
  <div className="numeral-actions"><button onClick={()=>{const guesses=recognizeDigit(strokes);setSuggestions(guesses.map(g=>g.digit));setMessage(guesses.length?'איזו ספרה ציירת?':'אפשר לצייר קו גדול יותר, או לבחור ספרה למטה.');}} disabled={!strokes.length||entry.length>=2}>איזו ספרה ציירתי?</button><button onClick={reset}>דף נקי</button></div>
  {!!suggestions.length&&<div className="digit-suggestions" aria-label="הצעות זיהוי">{suggestions.map(d=><button key={d} disabled={entry.length>=2} onClick={()=>confirm(d)}>{d}</button>)}</div>}</>}
  <button className="quiet" onClick={()=>setKeypad(v=>!v)}>{keypad?'נחזור לציור ✎':'אבחר ספרה במקום לצייר'}</button>
  {keypad&&<div className="keypad" dir="ltr">{'1234567890'.split('').map(d=><button key={d} disabled={entry.length>=2} onClick={()=>confirm(d)}>{d}</button>)}</div>}
  <div className="numeral-actions"><button onClick={()=>setEntry(v=>v.slice(0,-1))} disabled={!entry}>⌫ מחיקת ספרה</button><button className="primary" onClick={check} disabled={!entry}>בדיקת תשובה ✓</button></div>
  <p role="status">{message|| (entry.length>=2?'התשובה מוכנה לבדיקה. אפשר למחוק ספרה אם צריך.':strokes.length>=5?'אפשר לנקות את הדף ולנסות שוב, או לבחור ספרה.':'')}</p>
 </section>;
}
