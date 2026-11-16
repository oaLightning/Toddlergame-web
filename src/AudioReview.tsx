import {useEffect,useState} from 'react';
import {assetUrl,speak} from './audio';
import {lessons} from './content';
type ReviewClip={id:string;text:string;lang:string;status:string;engine?:string;voiceName?:string};
export default function AudioReview(){
 const [clips,setClips]=useState<ReviewClip[]>([]);const [visibleCount,setVisibleCount]=useState(20);
 useEffect(()=>{fetch(assetUrl('audio/manifest.json'),{cache:'no-store'}).then(r=>r.ok?r.json():{}).then(data=>setClips(Object.entries(data).filter(([,v])=>!!v&&typeof v==='object').map(([id,v])=>({id,...v as Omit<ReviewClip,'id'>})))).catch(()=>{});},[]);
 const ready=clips.filter(c=>c.status==='ready');
 const sampleIds=['he-alef','he-he','en-a','numbers-0-5','numbers-add','play-freeze','play-puzzle'];
 const samples=sampleIds.flatMap(id=>{const lesson=lessons.find(l=>l.id===id),page=lesson?.pages[0];if(!lesson||!page)return [];const audioId=page.audioId??`${lesson.id}.${page.id}`;const clip=clips.find(c=>c.id===audioId);const text=page.speech??page.instruction;return [{id:audioId,text,lang:/[\u0590-\u05ff]/.test(text)?'he':lesson.locale,status:clip?.status??'pending',title:lesson.title}];});
 const play=(clip:ReviewClip)=>speak(clip.text,clip.lang,clip.id,true);
 return <details className="audio-review"><summary>האזנה להקלטות ולהוראות 🎧</summary>
  <p>הקלטות מושמעות בקצב מהיר מעט יותר (×1.15), בלי לשנות את גובה הקול. ברכות קצרות בעברית ובאנגלית מתחלפות באקראי. ההוראות נשארות בשפת התרגיל.</p>
  <h3>הקלטות מוכנות ({ready.length})</h3><div className="audio-review-list">{ready.slice(0,visibleCount).map(clip=><button key={clip.id} onClick={()=>play(clip)}><span dir="auto">🔊 {clip.text}</span><small>הקלטה מוכנה · {clip.lang==='he'?'עברית':'English'}{clip.engine==='elevenlabs'?` · ElevenLabs ${clip.voiceName??''}`:''}</small></button>)}</div>
  {visibleCount<ready.length&&<button className="quiet" onClick={()=>setVisibleCount(n=>n+20)}>עוד הקלטות ({ready.length-visibleCount})</button>}<p>חלק מהקריינות נוצרה באמצעות <a href="https://elevenlabs.io" target="_blank" rel="noreferrer">ElevenLabs</a>, בקולות Sarah ו־Jessica. הקלטות נוספות נוצרו באמצעות Gemini.</p><h3>דוגמאות להוראות</h3><p>כאשר ההקלטה ממתינה, הדוגמה משתמשת בקול המכשיר. זו אינה הקלטה שנוצרה מראש.</p><div className="audio-review-list">{samples.map(clip=><button key={clip.id} onClick={()=>play(clip)}><strong>{clip.title}</strong><span dir="auto">{clip.text}</span><small>{clip.status==='ready'?'הקלטה מוכנה':'קול המכשיר · הקלטה ממתינה'}</small></button>)}</div>
 </details>;
}
