import feedback from './content/feedback.json' with {type:'json'};
export interface FeedbackClip {id:string;text:string;lang:'he'|'en'}
export const successClips=feedback.success as FeedbackClip[];
export const retryClips=feedback.retry as FeedbackClip[];
/** Avoid an immediate repeat, including when switching lesson languages. */
export function chooseFeedback(clips:readonly FeedbackClip[],previousId?:string,random:()=>number=Math.random):FeedbackClip {
 if(!clips.length)throw new Error('Feedback pool must contain at least one clip');
 const alternatives=clips.filter(clip=>clip.id!==previousId);
 const pool=alternatives.length?alternatives:clips;
 const sample=random();
 const fraction=Number.isFinite(sample)?Math.max(0,Math.min(1-Number.EPSILON,sample)):0;
 return pool[Math.floor(fraction*pool.length)];
}
