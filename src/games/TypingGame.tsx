import { useEffect, useRef, useState } from 'react';
import { sound, speak } from '../audio';
import { recognitionClass } from '../recognition';
import { defaultSequences, defaultTargets, keyboardRows, keyboardValue, spokenKey } from './typing-logic';
import type { KeyboardLocale } from './typing-logic';
import './typing.css';

export interface TypingGameProps {
  mode: 'find' | 'repeat';
  locale: KeyboardLocale;
  onComplete: () => void; onRestart?: () => void;
  narration: boolean;
  effects: boolean;
  targets?: string[];
  sequences?: string[];
}
/** Both on-screen taps and physical keyboard input go through the same validation path. */
export default function TypingGame({mode,locale,onComplete,onRestart,narration,effects,targets,sequences}:TypingGameProps) {
  const values = targets?.length ? targets : defaultTargets[locale];
  const rounds = mode === 'repeat' ? (sequences?.length ? sequences : defaultSequences(values)) : values;
  const [round,setRound] = useState(0);
  const [prefix,setPrefix] = useState(0);
  const [demoIndex,setDemoIndex] = useState<number|null>(null);
  const [playingDemo,setPlayingDemo] = useState(false);
  const [pressed,setPressed] = useState<string|null>(null);
  const [notice,setNotice] = useState('');
  const [wrong,setWrong] = useState(false);
  const [complete,setComplete] = useState(false);
  const [roundDone,setRoundDone] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const once = useRef(false);
  const expected = [...(rounds[round] ?? '')];
  const nextKey = expected[prefix];
  const audioLocale = locale==='en'?'en':'he';
  const isRtl = locale==='he';
  const rows = keyboardRows(locale);

  function clearTimers(){timers.current.forEach(clearTimeout);timers.current=[];}
  useEffect(()=>()=>clearTimers(),[]);
  useEffect(()=>{stage.current?.focus({preventScroll:true});},[]);
  function hear(value:string){speak(spokenKey(value),audioLocale,undefined,narration);}
  function receive(value:string){
    if(complete||roundDone||playingDemo)return;
    setPressed(value);timers.current.push(setTimeout(()=>setPressed(null),180));
    if(value!==nextKey){setWrong(true);setNotice('ננסה שוב בנחת. המקשים שכבר מצאת נשארים.');if(effects)sound(false);timers.current.push(setTimeout(()=>setWrong(false),450));return;}
    setWrong(false);const next=prefix+1;setPrefix(next);setNotice('כל הכבוד!');if(effects)sound(true);
    if(next===expected.length){
      setRoundDone(true);
      if(round===rounds.length-1){setComplete(true);if(!once.current){once.current=true;onComplete();}}
    }
  }
  function demonstrate(){
    if(complete)return;clearTimers();setPlayingDemo(true);setDemoIndex(0);setNotice('מסתכלות ומקשיבות. אין צורך למהר.');
    expected.forEach((value,i)=>timers.current.push(setTimeout(()=>{setDemoIndex(i);hear(value);},i*1250)));
    timers.current.push(setTimeout(()=>{setDemoIndex(null);setPlayingDemo(false);setNotice('עכשיו תורך. אפשר להסתכל על הרצף.');stage.current?.focus({preventScroll:true});},expected.length*1250));
  }
  function nextRound(){clearTimers();setPlayingDemo(false);setDemoIndex(null);setRound(r=>r+1);setPrefix(0);setRoundDone(false);setNotice('');setPressed(null);stage.current?.focus({preventScroll:true});}
  function replay(){onRestart?.();clearTimers();setRound(0);setPrefix(0);setRoundDone(false);setComplete(false);setPlayingDemo(false);setDemoIndex(null);setNotice('');once.current=false;stage.current?.focus({preventScroll:true});}
  return <div className={`typing-game ${wrong?'typing-soft-bump':''}`} onKeyDown={e=>{
    if(e.ctrlKey||e.metaKey||e.altKey||e.repeat||e.nativeEvent.isComposing||document.querySelector('.parent-modal'))return;
    if(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement)return;
    const value=keyboardValue(e.key,e.code,locale);if(!value)return;e.preventDefault();receive(value);
  }}>
    <div className="typing-caption"><span>{mode==='find'?'מוצאות מקש':'מקלידות ביחד'}</span><span>{round+1} / {rounds.length}</span></div>
    <p className="typing-prompt">{mode==='find'?'מצאי את המקש הזה במקלדת:':'הקלידי את הרצף לפי הסדר:'}</p>
    <div className="typing-sequence" dir={isRtl?'rtl':'ltr'} aria-label={mode==='find'?`המקש ${expected.join('')}`:`הרצף ${expected.join(', ')}`}>
      {expected.map((value,i)=><button key={`${round}-${i}`} className={`typing-target ${i<prefix?'typed':''} ${demoIndex===i?'demonstrating':''} ${i===prefix&&!roundDone?'next':''}`} aria-label={`לשמוע ${spokenKey(value)}`} onClick={()=>hear(value)}><span className={recognitionClass(`${locale}:${mode}:${round}`,i)}>{value}</span>{i<prefix&&<small>✓</small>}</button>)}
    </div>
    <div className="typing-tools">
      {mode==='repeat'?<button onClick={demonstrate} disabled={playingDemo||complete}>🔊 הדגימי לי שוב</button>:<button onClick={()=>hear(expected[0])}>🔊 לשמוע את שם המקש</button>}
      <span>{mode==='repeat'?(locale==='he'?'מתחילות בצד ימין ←':'מתחילות בצד שמאל →'):'אפשר לגעת או להשתמש במקלדת של המחשב'}</span>
    </div>
    <div ref={stage} className="typing-keyboard" tabIndex={0} role="group" aria-label="מקלדת משחק — אפשר לגעת במקשים או להקליד" dir="ltr"
      onPointerDown={e=>{if(!(e.target instanceof HTMLButtonElement))stage.current?.focus({preventScroll:true});}}>
      {rows.map((row,index)=><div className={`typing-key-row typing-key-row-${index}`} key={index}>{row.map(key=>key.value?<button type="button" key={key.code} className={`typing-key ${pressed===key.value?'pressed':''} ${values.includes(key.value)?'familiar':''} ${playingDemo&&key.value===expected[demoIndex??-1]?'demonstrating':''}`} aria-label={`מקש ${key.value}`} disabled={playingDemo} onClick={()=>receive(key.value)}><span>{key.value}</span>{locale==='he'&&key.code.startsWith('Key')&&<small>{key.code.slice(3)}</small>}</button>:<span key={key.code} className="typing-key-gap"/> )}</div>)}
    </div>
    <p className="typing-hint">{locale==='he'?'במחשב אפשר להקליד גם כשהמקלדת באנגלית: האותיות העבריות נמצאות באותם מקומות.':locale==='numbers'?'השורה העליונה היא שורת הספרות, כמו במקלדת מחשב.':'אותיות מוכרות מסומנות בעדינות. אפשר לנסות שוב כמה שרוצים.'}</p>
    <p className="typing-notice" role="status" aria-live="polite">{playingDemo?'מקשיבות לרצף…':complete?'הצלחת את כל המקשים! ✨':roundDone?'נהדר! סיימת את הרצף הזה.':notice||'אין שעון ואין למהר.'}</p>
    <div className="typing-actions">{roundDone&&!complete&&<button className="primary" onClick={nextRound}>{mode==='repeat'?'לרצף הבא ←':'למקש הבא ←'}</button>}{complete&&<button onClick={replay}>↶ נשחק שוב</button>}</div>
  </div>;
}
