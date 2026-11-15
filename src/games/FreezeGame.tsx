import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { assetUrl, sound, speak } from '../audio';
import './play-games.css';
import { advanceFreezeTarget, freezeSpeed, initialFreezeTarget } from './freeze-logic';

interface GameProps { onComplete: () => void; onRestart?: () => void; narration: boolean; effects: boolean }
const objects = [
  { id:'flower', icon:'🌸', name:'פרח', x:27, y:22 },
  { id:'butterfly', icon:'🦋', name:'פרפר', x:49, y:17 },
  { id:'star', icon:'⭐', name:'כוכב', x:74, y:22 },
  { id:'balloon', icon:'🎈', name:'בלון', x:88, y:48 },
  { id:'apple', icon:'🍎', name:'תפוח', x:64, y:48 },
  { id:'teddy', icon:'🧸', name:'דובי', x:39, y:48 },
  { id:'rainbow', icon:'🌈', name:'קשת', x:43, y:77 },
  { id:'shell', icon:'🐚', name:'צדף', x:75, y:79 },
];

export default function FreezeGame({ onComplete, onRestart, narration, effects }: GameProps) {
  const stage = useRef<HTMLDivElement>(null);
  const frozenIds = useRef(new Set<string>());
  const buttons=useRef<Record<string,HTMLButtonElement|null>>({});
  const motion=useRef(objects.map((item,i)=>initialFreezeTarget(i,item.x,item.y)));
  useEffect(()=>{
    const arena=stage.current;if(!arena)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0,last=0,width=arena.clientWidth,height=arena.clientHeight;
    const observer=new ResizeObserver(()=>{width=arena.clientWidth;height=arena.clientHeight;});observer.observe(arena);
    function tick(now:number){
      const dt=last?(now-last)/1000:0;last=now;
      if(!reduced.matches&&width>0&&height>0){
        const speed=freezeSpeed(frozenIds.current.size);
        const sample=buttons.current[objects[0].id];
        const padX=((sample?.offsetWidth??62)/2+8)/width,padY=((sample?.offsetHeight??62)/2+8)/height;
        objects.forEach((item,i)=>{
          const button=buttons.current[item.id];if(!button||frozenIds.current.has(item.id))return;
          const point=advanceFreezeTarget(motion.current[i],dt,speed,padX,padY);
          motion.current[i]=point;button.style.left=`${point.x*100}%`;button.style.top=`${point.y*100}%`;
        });
      }
      frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
    return ()=>{cancelAnimationFrame(frame);observer.disconnect();};
  },[]);
  const [frozen, setFrozen] = useState<Record<string,{x:number;y:number}>>({});
  const [miss, setMiss] = useState(0);
  const [beam, setBeam] = useState<{x:number;y:number;id:number}|null>(null);
  const count = Object.keys(frozen).length;
  const won = count === objects.length;

  function freeze(event: MouseEvent<HTMLButtonElement>, id: string) {
    event.stopPropagation();
    if (frozenIds.current.has(id) || !stage.current) { if(effects)sound(false); setMiss(v=>v+1); return; }
    const arena = stage.current.getBoundingClientRect();
    const item = event.currentTarget.getBoundingClientRect();
    const point = { x:(item.left + item.width/2 - arena.left)/arena.width*100, y:(item.top + item.height/2 - arena.top)/arena.height*100 };
    frozenIds.current.add(id);
    setFrozen(previous=>({...previous,[id]:point}));
    setBeam({...point,id:Date.now()});
    if (effects) sound(true);
    if (frozenIds.current.size === objects.length) {
      speak('איזה קסם! הכול קפוא. הצלחת!', 'he', 'game.freeze.win', narration);
      onComplete();
    }
  }
  function replay() { onRestart?.(); frozenIds.current.clear(); setFrozen({}); motion.current=objects.map((item,i)=>initialFreezeTarget(i,item.x,item.y)); setBeam(null); setMiss(0); if(effects)sound(true); }

  return <div className="freeze-game">
    <div className="play-instructions"><span>❄️</span><p>לחצי על כל דבר שזז, והקסם יקפיא אותו.<br/><small>אפשר לקחת את כל הזמן שבעולם.</small></p></div>
    <div className="freeze-progress" aria-live="polite">{won?'כל הדברים קפואים! ✨':`${count} מתוך ${objects.length} דברים קפואים`}<div><span style={{width:`${count/objects.length*100}%`}}/></div></div>
    <div ref={stage} className="freeze-stage" aria-label="גן הקסם של אלזה" data-speed={freezeSpeed(count).toFixed(2)} onClick={()=>{if(effects)sound(false);setMiss(v=>v+1);}}>
      <span className="ice-hill ice-hill-one" aria-hidden="true"/><span className="ice-hill ice-hill-two" aria-hidden="true"/>
      <span className="ice-sparkle ice-sparkle-one" aria-hidden="true">✦</span><span className="ice-sparkle ice-sparkle-two" aria-hidden="true">✧</span>
      <figure className="elsa-helper"><img src={assetUrl('characters/elsa.webp')} alt="אלזה"/><figcaption>קסם הקרח שלך</figcaption></figure>
      {beam&&<svg className="freeze-beam" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" key={beam.id}><line x1="13" y1="77" x2={beam.x} y2={beam.y} className="beam-glow"/><line x1="13" y1="77" x2={beam.x} y2={beam.y} className="beam-core"/><circle cx={beam.x} cy={beam.y} r="6" className="beam-ring"/></svg>}
      {objects.map(item=>{
        const ice=frozen[item.id];
        return <button key={item.id} ref={button=>{buttons.current[item.id]=button;}} aria-disabled={!!ice} onPointerDown={event=>{if(event.button!==0)return;event.preventDefault();freeze(event,item.id);}} onClick={event=>{event.stopPropagation();if(event.detail===0)freeze(event,item.id);}} className={`freeze-object ${ice?'is-frozen':''}`} aria-label={ice?`${item.name} קפוא`:`הקפיאי ${item.name}`} style={{left:`${ice?.x??item.x}%`,top:`${ice?.y??item.y}%`}}><span className="freeze-item-icon" aria-hidden="true">{item.icon}</span>{ice&&<><span className="ice-crystal" aria-hidden="true"/><span className="ice-mark" aria-hidden="true">❄</span></>}</button>;
      })}
    </div>
    <p className="freeze-miss" aria-live="polite">{miss>0&&!won?'עוד ניסיון קטן, הקסם יצליח!':'הדברים שנשארו זזים מהר יותר אחרי כל הקפאה.'}</p><div className="play-footer">{won?<><span role="status">🌟 אלזה ואת הקפאתן את כל הגן!</span><button className="primary" onClick={replay}>נשחק שוב ❄️</button></>:<span>אין שעון. רק קצת קסם.</span>}</div>
  </div>;
}
