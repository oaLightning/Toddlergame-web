import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { sound } from '../audio';
import './play-games.css';

interface GameProps { onComplete: () => void; onRestart?: () => void; narration: boolean; effects: boolean }
interface Bubble { id:number; x:number; y:number; icon:string; color:string; turn:number }
const icons=['🌸','🦋','🌷','✨','🐚','🌈','💜','🫧','🍓','☁️','🎀','⭐'];
const colors=['#f4d6e4','#e4d5f2','#cfe7df','#f4e6c8','#d8e9f5'];
export default function KeyBashGame({ onComplete, onRestart, effects }: GameProps) {
  const arena = useRef<HTMLDivElement>(null);
  const sequence = useRef(0);
  const lastSound = useRef(0);
  const lastKey = useRef(0);
  const [bubbles,setBubbles] = useState<Bubble[]>([]);
  const [started,setStarted] = useState(false);
  useEffect(()=>{if(!document.querySelector('[role="dialog"]'))arena.current?.focus({preventScroll:true});},[]);
  // Only listen on the focused play area, never on window/document. Browser shortcuts,
  // parent controls, text fields and navigation retain their normal keyboard behavior.
  function addBubble(x?:number,y?:number){
    const id=sequence.current++;
    setStarted(true);
    setBubbles(previous=>[...previous.slice(-23),{id,x:x??12+Math.random()*76,y:y??18+Math.random()*58,icon:icons[id%icons.length],color:colors[id%colors.length],turn:(id%5-2)*8}]);
    const now=performance.now();
    if(effects&&now-lastSound.current>140){sound(true);lastSound.current=now;}
  }
  function keyDown(event:KeyboardEvent<HTMLDivElement>){
    if(event.target!==event.currentTarget||event.altKey||event.ctrlKey||event.metaKey||document.querySelector('[role="dialog"]'))return;
    if(Array.from(event.key).length!==1)return;
    event.preventDefault();
    const now=performance.now();if(now-lastKey.current<65)return;lastKey.current=now;
    addBubble();
  }
  function pointerDown(event:PointerEvent<HTMLDivElement>){
    if(event.button!==0)return;
    arena.current?.focus({preventScroll:true});
    const rect=event.currentTarget.getBoundingClientRect();
    addBubble(Math.max(8,Math.min(92,(event.clientX-rect.left)/rect.width*100)),Math.max(12,Math.min(87,(event.clientY-rect.top)/rect.height*100)));
  }
  return <div className="keybash-game">
    <div className="play-instructions"><span>🫧</span><p>לחצי על מקשים וצרי גן של הפתעות.<br/><small>באייפד? פשוט נוגעים במקום שרוצים.</small></p></div>
    <div ref={arena} tabIndex={0} role="group" aria-label="גן ההפתעות. לחצי על אות, מספר או רווח במקלדת, או געי במסך" className="keybash-stage" onKeyDown={keyDown} onPointerDown={pointerDown}>
      <div className={`keybash-welcome ${started?'has-started':''}`} aria-hidden="true"><span>✿</span><p>{started?'עוד הפתעה קטנה?':'כל לחיצה היא הפתעה'}</p></div>
      {bubbles.map(bubble=><span key={bubble.id} aria-hidden="true" className="keybash-bubble" style={{left:`${bubble.x}%`,top:`${bubble.y}%`,background:bubble.color,'--bubble-turn':`${bubble.turn}deg`} as React.CSSProperties}>{bubble.icon}</span>)}
      <span className="keybash-ground" aria-hidden="true">🌷 ✧ 🌸 ✧ 🌷</span>
    </div>
    <div className="play-footer"><button className="quiet" onClick={()=>{onRestart?.();setBubbles([]);setStarted(false);arena.current?.focus({preventScroll:true});}}>גן חדש ✿</button><button className="primary" onClick={onComplete}>סיימתי לשחק 💜</button></div>
  </div>;
}
