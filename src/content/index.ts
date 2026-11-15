import { hebrewAlphabet, englishOrder, extraHebrewExamples, extraEnglishExamples, extraHebrewStrokes, extraEnglishStrokes, finalForms } from './alphabet';
import { playLessons, typingLessons } from './games';
import { privatePortrait } from '../privacy';
import type { Choice, Exercise, Lesson, WordExample } from '../types';

const heStrokes: Record<string, string[]> = {
  'א': ['M 58 38 L 143 161', 'M 140 38 V 67 L 105 92', 'M 95 108 L 60 130 V 163'],
  'ב': ['M 55 45 H 140 V 155', 'M 48 155 H 155'],
  'ג': ['M 109 42 L 126 145 L 151 163', 'M 124 128 L 65 165'],
  'ד': ['M 47 43 H 155', 'M 133 43 V 165'],
};
Object.assign(heStrokes,extraHebrewStrokes);
const digitStrokes: Record<string, string[]> = {
  '0': ['M 100 35 C 45 35 45 165 100 165 C 155 165 155 35 100 35'],
  '1': ['M 71 69 L 105 37 V 164', 'M 71 164 H 139'],
  '2': ['M 58 67 C 57 23 147 23 146 72 C 145 103 80 132 58 165 H 149'],
  '3': ['M 58 48 C 110 14 172 55 115 97 C 177 111 144 188 58 155'],
  '4': ['M 125 35 L 55 120 H 151', 'M 125 35 V 165'],
  '5': ['M 145 38 H 65 V 91 C 167 67 173 188 61 157'],
  '6': ['M 139 39 C 58 18 34 170 101 166 C 162 162 153 84 98 92 C 78 94 65 112 63 133'],
  '7': ['M 53 38 H 150 L 83 165'],
  '8': ['M 100 98 C 27 71 68 11 118 36 C 172 64 122 89 100 98 C 17 119 61 193 122 164 C 172 137 125 107 100 98'],
  '9': ['M 137 80 C 137 19 51 24 55 79 C 59 132 141 111 137 67 V 111 C 136 150 110 174 72 163'],
};
/** Fit digit guides side by side without mirroring or changing their vertical rhythm. */
function numeralStrokes(n: number): string[] {
  const digits = String(n).split('');
  if (digits.length === 1) return digitStrokes[digits[0]];
  return digits.flatMap((digit, digitIndex) => digitStrokes[digit].map(stroke =>
    stroke.replace(/([MLCHV])([^MLCHV]*)/g, (_match, command: string, coordinates: string) => {
      const values = coordinates.trim().split(/[ ,]+/).map(Number);
      return command + ' ' + values.map((v, i) => command === 'V' ? v : command === 'H' || i % 2 === 0 ? +(v * 0.44 + digitIndex * 95 + 7).toFixed(2) : v).join(' ') + ' ';
    }).trim(),
  ));
}
const englishStrokes: Record<string, string[]> = {
  s: ['M 141 69 C 100 32 43 73 78 99 C 95 111 149 104 143 139 C 137 169 80 172 57 145'],
  a: ['M 133 84 C 75 41 41 107 63 145 C 93 181 133 142 133 102', 'M 134 72 V 158 H 151'],
  t: ['M 99 35 V 143 C 99 163 119 169 139 154', 'M 60 78 H 143'],
  m: ['M 46 158 V 75', 'M 47 98 C 55 57 97 60 98 99 V 158', 'M 99 98 C 109 57 153 59 153 102 V 158'],
};
Object.assign(englishStrokes,extraEnglishStrokes);
const examples: Record<string, WordExample[]> = {
  'א': [{ word: 'אסיה', highlight: 'א', image: privatePortrait('portraits/asia.webp') }, { word: 'אבא', highlight: 'א', emoji: '👨' }, { word: 'אבטיח', highlight: 'א', emoji: '🍉' }, { word: 'ארנב', highlight: 'א', emoji: '🐰' }, { word: 'אגס', highlight: 'א', emoji: '🍐' }, { word: 'אריה', highlight: 'א', emoji: '🦁' }, { word: 'אוזן', highlight: 'א', emoji: '👂' }, { word: 'אננס', highlight: 'א', emoji: '🍍' }],
  'ב': [{ word: 'בננה', highlight: 'ב', emoji: '🍌' }, { word: 'בית', highlight: 'ב', emoji: '🏠' }, { word: 'בלון', highlight: 'ב', emoji: '🎈' }, { word: 'ברווז', highlight: 'ב', emoji: '🦆' }, { word: 'ביצה', highlight: 'ב', emoji: '🥚' }, { word: 'בובה', highlight: 'ב', emoji: '🪆' }, { word: 'בייגלה', highlight: 'ב', emoji: '🥨' }, { word: 'ברק', highlight: 'ב', emoji: '⚡' }],
  'ג': [{ word: 'גזר', highlight: 'ג', emoji: '🥕' }, { word: 'גלידה', highlight: 'ג', emoji: '🍦' }, { word: 'גמל', highlight: 'ג', emoji: '🐪' }, { word: 'גבינה', highlight: 'ג', emoji: '🧀' }, { word: 'גיטרה', highlight: 'ג', emoji: '🎸' }, { word: 'גרב', highlight: 'ג', emoji: '🧦' }, { word: 'גשר', highlight: 'ג', emoji: '🌉' }, { word: 'גינה', highlight: 'ג', emoji: '🌳' }],
  'ד': [{ word: 'דג', highlight: 'ד', emoji: '🐟' }, { word: 'דוב', highlight: 'ד', emoji: '🧸' }, { word: 'דלת', highlight: 'ד', emoji: '🚪' }, { word: 'דבש', highlight: 'ד', emoji: '🍯' }, { word: 'דולפין', highlight: 'ד', emoji: '🐬' }, { word: 'דובדבן', highlight: 'ד', emoji: '🍒' }, { word: 'דגל', highlight: 'ד', emoji: '🚩' }, { word: 'דינוזאור', highlight: 'ד', emoji: '🦕' }],
};
Object.assign(examples,extraHebrewExamples);
function choicesForNumbers(answer: number, max = 20): Choice[] {
  const values = [...new Set([Math.max(0, answer - 1), answer, Math.min(max, answer + 1), answer > 1 ? answer - 2 : answer + 2])];
  // Fixed interleaving keeps the answer from always occupying the same place.
  if (answer % 2) values.reverse();
  return values.map(n => ({ id: String(n), label: String(n), correct: n === answer }));
}
function finishPages(bookId: string, pages: Exercise[]): Exercise[] {
  return pages.map(p => ({ ...p, id: `${bookId}-${p.id}`, audioId: `${bookId}-${p.id}` }));
}
function heBook(letter: string, name: string, id: string, index: number): Lesson {
  const sample = examples[letter];
  const distractor = index === 0 ? examples['ב'][0] : examples['א'][2];
  const previous = hebrewAlphabet.slice(0,index).map(v=>v[0]);
  const wrongWord=letter==='ת'?examples['ב'][0]:{word:'תפוח',emoji:'🍎'};
  const wrongMore=letter==='ש'?examples['ג'][0]:{word:'שמש',emoji:'☀️'};
  const pages: Exercise[] = [
    { id: 'hello', kind: 'introduce', target: letter, instruction: `הכירי את האות ${letter}`, speech: `זאת האות ${name}. בואי נכיר אותה יחד.`, examples: [sample[0]], help: letter === 'א' ? 'א היא שם של אות: אלף. הצליל שלה במילה תלוי במילה ובניקוד.' : `שם האות הוא ${name}. שם האות והצליל בתוך מילה אינם אותו דבר.` },
    { id: 'trace', kind: 'trace', target: letter, strokes: heStrokes[letter], instruction: `עקבי באצבע אחרי האות ${letter}`, speech: `עקבי באצבע אחרי הקווים של האות ${name}.`, help: 'התחילי בנקודה ועקבי אחרי כל קו. אפשר להרים את האצבע בין הקווים.' },
    { id: 'words', kind: 'introduce', target: letter, instruction: `האות ${letter} במילים מוכרות`, speech: `בואי נסתכל על מילים שמתחילות באות ${name}. לחצי על תמונה כדי לשמוע את המילה.`, examples: sample.slice(0,4) },
    { id: 'choose', kind: 'match', target: letter, instruction: `איזו מילה מתחילה באות ${letter}?`, speech: `איזו מילה מתחילה באות ${name}?`, choices: [
      { id: 'correct', label: sample[1].word, emoji: sample[1].emoji, correct: true },
      { id: 'other', label: distractor.word, emoji: distractor.emoji, correct: false },
      { id: 'apple', label: wrongWord.word, emoji: wrongWord.emoji, correct: false },
    ] },
    { id: 'find-name', kind: 'find', target: letter, text: `${sample[0].word} ${sample[1].word}`, instruction: `מצאי את כל האותיות ${letter}`, speech: `מצאי את כל הפעמים שהאות ${name} מופיעה במילים.`, help: 'לחצי על כל אות מתאימה. גם אות באמצע מילה או בסופה נחשבת.' },
    { id: 'paint', kind: 'select', target: letter, instruction: `בחרי דברים שמתחילים באות ${letter}`, speech: `בחרי את הדברים ששמם מתחיל באות ${name}.`, choices: [
      { id: 'one', label: sample[1].word, emoji: sample[1].emoji, correct: true },
      { id: 'wrong', label: wrongWord.word, emoji: wrongWord.emoji, correct: false },
      { id: 'two', label: sample[2].word, emoji: sample[2].emoji, correct: true },
      { id: 'three', label: sample[3].word, emoji: sample[3].emoji, correct: true },
    ], help: 'לחצי על כל תמונה מתאימה. אין צורך לבחור צבע.' },
    { id: 'letter-hunt', kind: 'find', target: letter, text: [...previous.slice(-3), letter, letter==='ה'?'ב':'ה', letter, ...previous.slice(-3)].join(' '), instruction: `עוד חיפוש קטן: איפה ${letter}?`, speech: `עוד חיפוש קטן. איפה האות ${name}?` },
  ];
  if(sample.length>4) pages.push({id:'more-words',kind:'introduce',target:letter,instruction:`עוד מילים שמתחילות באות ${letter}`,speech:`הנה עוד מילים שמתחילות באות ${name}. לחצי על התמונות והקשיבי.`,examples:sample.slice(4)});
  if(sample.length>4) pages.push({id:'more-choices',kind:'select',target:letter,instruction:`מצאי עוד תמונות שמתחילות באות ${letter}`,speech:`מצאי עוד תמונות ששמן מתחיל באות ${name}.`,choices:[...sample.slice(4,7).map((e,i)=>({id:`new-${i}`,label:e.word,emoji:e.emoji,correct:true})),{id:'different',label:wrongMore.word,emoji:wrongMore.emoji,correct:false}]});
  pages.push({id:'free-paint',kind:'paint',target:letter,instruction:index<4?`צבעי ציור שמתחיל באות ${letter}`:`צבעי את האות ${letter}`,speech:`עכשיו נצייר ונצבע בחופשיות. בחרי צבע והעבירי אצבע או עכבר על הציור.`,help:'זוהי צביעה חופשית. אין תשובה לא נכונה, ואפשר לסיים כשאת רוצה.'});
  if (index > 0) pages.push({ id: 'review', kind: 'match', target: previous[index - 1], instruction: `נזכרת? מצאי את האות ${previous[index - 1]}`, speech: `בואי ניזכר באות שכבר פגשנו. מצאי את האות ${hebrewAlphabet[index-1][1]}.`, choices: [...previous.slice(-3),letter].map(l => ({ id: l, label: l, correct: l === previous[index - 1] })) });
  return { id, theme: 'hebrew', locale: 'he', title: `${letter} — ${name}`, subtitle: 'מכירות, עוקבות, מוצאות וצובעות', cover: sample[1].emoji || '🌸', color: ['#f2cce2', '#dccff2', '#d2e7de', '#f3dcc6'][index%4], pages: finishPages(id, pages) };
}
const englishExamples: Record<string, WordExample[]> = {
  s: [{ word: 'sun', highlight: 's', emoji: '☀️' }, { word: 'sock', highlight: 's', emoji: '🧦' }, { word: 'sand', highlight: 's', emoji: '🏖️' }, { word: 'star', highlight: 's', emoji: '⭐' }, { word: 'snake', highlight: 's', emoji: '🐍' }, { word: 'strawberry', highlight: 's', emoji: '🍓' }],
  a: [{ word: 'apple', highlight: 'a', emoji: '🍎' }, { word: 'ant', highlight: 'a', emoji: '🐜' }, { word: 'alligator', highlight: 'a', emoji: '🐊' }, { word: 'ambulance', highlight: 'a', emoji: '🚑' }, { word: 'astronaut', highlight: 'a', emoji: '🧑‍🚀' }, { word: 'axe', highlight: 'a', emoji: '🪓' }],
  t: [{ word: 'tomato', highlight: 't', emoji: '🍅' }, { word: 'turtle', highlight: 't', emoji: '🐢' }, { word: 'tiger', highlight: 't', emoji: '🐯' }, { word: 'tree', highlight: 't', emoji: '🌳' }, { word: 'train', highlight: 't', emoji: '🚂' }, { word: 'tent', highlight: 't', emoji: '⛺' }],
  m: [{ word: 'moon', highlight: 'm', emoji: '🌙' }, { word: 'milk', highlight: 'm', emoji: '🥛' }, { word: 'monkey', highlight: 'm', emoji: '🐒' }, { word: 'mouse', highlight: 'm', emoji: '🐭' }, { word: 'mushroom', highlight: 'm', emoji: '🍄' }, { word: 'mango', highlight: 'm', emoji: '🥭' }],
};
Object.assign(englishExamples,extraEnglishExamples);
function englishBook(letter: string): Lesson {
  const id = `en-${letter}`;
  const sample = englishExamples[letter];
  const name=letter.toUpperCase();
  const suffix=letter==='x';
  const wrong=letter==='f'?{word:'cat',emoji:'🐈'}:{word:'fish',emoji:'🐟'};
  const wrong2=letter==='b'?{word:'sun',emoji:'☀️'}:{word:'banana',emoji:'🍌'};
  const soundHelp = ['a','e','i','o','u'].includes(letter) ? 'לאותיות התנועה באנגלית יש כמה צלילים. כאן מקשיבות לתנועה הקצרה במילים האלה; שם האות נלמד בנפרד.' : letter==='x'?'כאן x מופיעה בסוף המילה ונשמעת כמו קְס. לא מלמדות את שם האות כצליל.':letter==='q'?'בדוגמאות האלה q מופיעה יחד עם u. מקשיבות לצירוף בתחילת queen, ולא טוענות שזהו צליל של q לבדה.':letter==='c'||letter==='g'?'כאן מקשיבות לצליל הראשון בדוגמאות האלה. לאות הזאת יש גם צלילים אחרים במילים אחרות.':'מקשיבות לצליל הראשון של המילה. שם האות הוא תרגול נפרד.';
  const soundText = suffix?'Listen to the last sounds in fox, box, six, and wax. The letter x spells two sounds together, k and s.':letter==='q'?'Listen to queen and quilt. Here q and u work together at the start of each word.':`Listen to the first sound in ${sample[0].word}. ${sample.map(e=>e.word).join('. ')}.`;
  return { id, theme: 'english', locale: 'en', title: `${name} ${letter}`, subtitle:suffix?'מקשיבות לצלילים בסוף fox':`מקשיבות לצליל הראשון של ${sample[0].word}`, cover: sample[0].emoji || '🌟', color: '#ded5ef', pages: finishPages(id, [
    { id: 'hello', kind: 'introduce', target: letter, instruction: `הכירי את האות ${name} ${letter}`, speech: `This is the letter ${name}. Here is its lowercase shape.`, examples: sample, help: 'כאן עוקבות אחרי אותיות קטנות. האות הגדולה מופיעה בכותרת כדי להכיר גם אותה.' },
    { id: 'listen', kind: 'introduce', target: letter, instruction: suffix?'הקשיבי לצלילים בסוף המילה':'הקשיבי לצליל בתחילת המילה', speech: soundText, examples: sample.slice(2), help: soundHelp },
    { id: 'more-words', kind: 'introduce', target:letter, instruction:'עוד מילים באנגלית', speech:'Listen to some more familiar words.', examples:sample.slice(3) },
    { id:'free-paint',kind:'paint',target:letter,instruction:['s','a','t','m'].includes(letter)?'בחרי צבע וצבעי את הציור':`בחרי צבע וצבעי את האות ${letter}`,speech:'Choose a color and paint the picture. You can draw with your finger or the mouse.' },
    { id: 'trace', kind: 'trace', target: letter, strokes: englishStrokes[letter], instruction: `עקבי אחרי האות ${letter}`, speech: `Trace the lowercase letter ${name}.` },
    { id: 'find', kind: 'find', target: letter, text: sample.slice(2,5).map(e => e.word).join(' '), instruction: `מצאי את האות ${letter} במילים`, speech: `Find every lowercase ${name} in these words.` },
    { id: 'match', kind: 'match', target: letter, instruction:suffix?'באיזו מילה יש x?':`איזו מילה מתחילה ב־${letter}?`, speech:suffix?'Which word has the letter x?':`Which word starts with lowercase ${name}?`, choices: [{ id: 'yes', label: sample[0].word, emoji: sample[0].emoji, correct: true }, { id: 'no', label: wrong.word, emoji: wrong.emoji, correct: false }, { id: 'no2', label: wrong2.word, emoji: wrong2.emoji, correct: false }] },
    { id: 'color', kind: 'select', target: letter, instruction:suffix?'בחרי מילים שמכילות x':`בחרי תמונות שמתחילות ב־${letter}`, speech:suffix?'Choose the words that contain x.':'Choose the pictures whose words start with lowercase '+name+'.', choices: [{ id: 'one', label: sample[2].word, emoji: sample[2].emoji, correct: true }, { id: 'two', label: sample[3].word, emoji: sample[3].emoji, correct: true }, { id: 'other', label: wrong.word, emoji: wrong.emoji, correct: false }] },
  ]) };
}
function countingBook(id: string, low: number, high: number, cover: string, emoji: string): Lesson {
  const pages: Exercise[] = [];
  for (let n = low; n <= high; n++) {
    pages.push({ id: `count-${n}`, kind: 'count', count: n, answer: n, emoji, instruction: n === 0 ? 'אין כאן אף פריט. איזה מספר מתאים?' : 'געי בכל פריט וספרי. כמה יש?', speech: n === 0 ? 'אין כאן אף פריט. איזה מספר מתאים?' : 'געי בכל פריט וספרי. כמה פריטים יש כאן?', choices: choicesForNumbers(n, high), help: 'אפשר לגעת בכל פריט פעם אחת ואז לבחור מספר.' });
    pages.push({id:`free-paint-${n}`,kind:'paint',target:String(n),instruction:`צבעי את המספר ${n}`,speech:`בחרי צבע וצבעי את המספר ${n}. אפשר לצייר בחופשיות ולסיים מתי שתרצי.`});
    pages.push({ id: `trace-${n}`, kind: 'trace', target: String(n), strokes: numeralStrokes(n), instruction: `עקבי אחרי ${n < 10 ? 'הספרה' : 'המספר'} ${n}`, speech: `עקבי אחרי ${n < 10 ? 'הספרה' : 'המספר'} ${n}.` });
  }
  pages.push({ id: 'paint-quantity', kind: 'select', target: String(low === 0 ? 3 : low), instruction: `בחרי קבוצות שיש בהן ${low === 0 ? 3 : low} פריטים`, speech: `בחרי קבוצות שיש בהן ${low === 0 ? 3 : low} פריטים.`, choices: [
    { id: 'one', label: '🍓'.repeat(low === 0 ? 3 : low), correct: true },
    { id: 'two', label: '🌸'.repeat(low === 0 ? 3 : low), correct: true },
    { id: 'other', label: '🍋'.repeat(low === 0 ? 2 : low - 1), correct: false },
  ], help: 'ספרי את הפריטים בכל קבוצה. המספר מתייחס לכל הקבוצה.' });
  const numeralTarget = low === 0 ? 3 : high;
  pages.push({ id: 'color-numeral', kind: 'select', target: String(numeralTarget), instruction: `בחרי את המספר ${numeralTarget}`, speech: `בחרי את המספר ${numeralTarget}.`, choices: [
    { id: 'correct-one', label: String(numeralTarget), correct: true },
    { id: 'other', label: String(numeralTarget - 1), correct: false },
    { id: 'correct-two', label: String(numeralTarget), correct: true },
    { id: 'other-two', label: String(numeralTarget === 3 ? 5 : numeralTarget - 2), correct: false },
  ], help: 'כאן מזהות את צורת המספר עצמו. חפשי את כל ההופעות שלו.' });
  pages.push({ id: 'keypad', kind: 'keypad', answer: high, count: high, emoji, instruction: 'כמה פריטים? הקישי את המספר', speech: 'ספרי את הפריטים והקישי את המספר.', help: 'אפשר להיעזר במבוגר כדי להכיר את לוח הספרות.' });
  return { id, theme: 'numbers', locale: 'he', title: low === 0 ? 'סופרות עד 5' : `סופרות ${low}–${high}`, subtitle: low === 0 ? 'כולל אפס: גם כשאין אף פריט' : 'נוגעות בכל פריט וסופרות לאט', cover, color: '#e4dfb9', pages: finishPages(id, pages) };
}
const spokenApples = ['אפס תפוחים', 'תפוח אחד', 'שני תפוחים', 'שלושה תפוחים', 'ארבעה תפוחים', 'חמישה תפוחים', 'שישה תפוחים', 'שבעה תפוחים', 'שמונה תפוחים', 'תשעה תפוחים', 'עשרה תפוחים'];
const writtenApples = (n: number) => n === 1 ? 'תפוח אחד' : `${n} תפוחים`;
function arithmeticBook(operation: '+' | '-'): Lesson {
  const id = operation === '+' ? 'numbers-add' : 'numbers-subtract';
  const sets: [number, number][] = operation === '+' ? [[1, 1], [2, 1], [2, 2], [3, 2], [4, 2], [4, 3], [5, 3], [5, 4], [6, 4], [0, 3]] : [[2, 1], [3, 1], [4, 2], [5, 2], [6, 3], [7, 2], [8, 3], [9, 4], [10, 3], [3, 3]];
  const story = ([a, b]: [number, number], index: number, responseMode: 'choices' | 'keypad' | 'handwrite'): Exercise => ({
    id: `${responseMode === 'handwrite' ? 'draw' : responseMode === 'keypad' ? 'independent' : 'story'}-${index + 1}`,
    kind: 'arithmetic', operation, operands: [a, b], responseMode,
    answer: operation === '+' ? a + b : a - b, emoji: '🍎',
    instruction: operation === '+' ? `יש ${writtenApples(a)}. נוסיף עוד ${writtenApples(b)}. כמה יש יחד?` : `יש ${writtenApples(a)}. ניקח ${writtenApples(b)}. כמה נשארו?`,
    speech: operation === '+' ? `יש לנו ${spokenApples[a]}. נוסיף עוד ${spokenApples[b]}. כמה תפוחים יש לנו יחד?` : `יש לנו ${spokenApples[a]}. ניקח ${spokenApples[b]}. כמה תפוחים נשארו?`,
    choices: responseMode === 'choices' ? choicesForNumbers(operation === '+' ? a + b : a - b, 10) : undefined,
    help: operation === '+' ? 'ספרי את כל התפוחים בשתי הקבוצות יחד.' : 'התפוחים המסומנים נלקחו. ספרי רק את התפוחים שנשארו.',
  });
  const harder: [number, number][] = operation === '+' ? [[3, 4], [5, 5], [6, 2]] : [[10, 4], [8, 5], [7, 7]];
  return {
    id, theme: 'numbers', locale: 'he', title: operation === '+' ? 'מוסיפות יחד' : 'לוקחות ונשאר',
    subtitle: 'סיפור קטן עם תפוחים, עד 10', cover: operation === '+' ? '🧺' : '🍎', color: operation === '+' ? '#d4e6db' : '#f0d8df',
    pages: finishPages(id, [...sets.map((pair, index) => story(pair, index, 'choices')), ...harder.map((pair, index) => story(pair, index, 'keypad')), ...harder.map((pair,index)=>story(pair,index,'handwrite'))]),
  };
}

const hebrewWords: Lesson = { id: 'he-known-words', theme: 'hebrew', locale: 'he', title: 'בונות מילים יחד', subtitle: 'אחרי א–ד: מסדרות אותיות, בעזרת הקראה', cover: '🧩', color: '#ead4e8', pages: finishPages('he-known-words', [
  { id: 'explain', kind: 'introduce', target: 'אבא', instruction: 'נבנה מילים מאותיות שפגשנו', speech: 'עכשיו נבנה מילים מהאותיות שפגשנו. אני אגיד את המילה, ואת תסדרי את האותיות שלה.', examples: [{ word: 'אבא', highlight: 'א', emoji: '👨' }, { word: 'דג', highlight: 'ד', emoji: '🐟' }], help: 'זוהי הרכבת כתיב מוכר בעזרת הקראה, לא ציפייה לקריאה עצמאית בלי ניקוד. משתמשות רק באותיות א, ב, ג, ד.' },
  { id: 'dad', kind: 'build', target: 'אבא', letters: ['א', 'ב', 'א'], instruction: 'בני את המילה אבא', speech: 'המילה היא אבא. בני את המילה אבא. התחילי מצד ימין.', help: 'יש שתי אותיות א במילה. בוחרות את האותיות לפי סדר הקריאה מימין לשמאל.' },
  { id: 'fish', kind: 'build', target: 'דג', letters: ['ג', 'ד', 'א'], instruction: 'בני את המילה דג', speech: 'המילה היא דג. בני את המילה דג.' },
  { id: 'roof', kind: 'build', target: 'גג', letters: ['ג', 'ב', 'ג'], instruction: 'בני את המילה גג', speech: 'המילה היא גג. בני את המילה גג.', help: 'אות יכולה לחזור פעמיים באותה מילה.' },
  { id: 'letter-count-dad', kind: 'match', target: 'אבא', instruction: 'אבא — כמה אותיות יש במילה?', speech: 'הסתכלי על המילה אבא. ספרי את האותיות. כמה אותיות יש בה?', choices: choicesForNumbers(3, 5), help: 'סופרות אותיות כתובות, לא צלילים. א, ב, א: שלוש אותיות.' },
  { id: 'letter-count-fish', kind: 'match', target: 'דג', instruction: 'דג — כמה אותיות יש במילה?', speech: 'הסתכלי על המילה דג. כמה אותיות יש בה?', choices: choicesForNumbers(2, 5) },
  { id: 'asia-count', kind: 'match', target: 'אסיה', instruction: 'אסיה — כמה אותיות יש בשם שלך?', speech: 'זה השם שלך, אסיה. ספרי את האותיות בשם שלך. כמה אותיות יש בו?', choices: choicesForNumbers(4, 5), help: 'את השם מכירות כמילה מוכרת; עדיין לא למדנו בנפרד את ס, י, ה.' },
  { id: 'find-review', kind: 'find', target: 'א', text: 'אבא אסיה אבא', instruction: 'מצאי שוב את כל האותיות א', speech: 'בואי ניזכר באות אלף. מצאי את כל האותיות אלף.' },
]) };
const englishWords: Lesson = { id: 'en-first-words', theme: 'english', locale: 'en', title: 'mat · sat', subtitle: 'מחברות s, a, t, m בעזרת הקראה', cover: '🧩', color: '#d9d1ea', pages: finishPages('en-first-words', [
  { id: 'intro', kind: 'introduce', target: 'mat', instruction: 'מקשיבות למילה ומסדרות את האותיות', speech: 'Let us put familiar letters together. Listen: mat. A mat is a small rug.', examples: [{ word: 'mat', highlight: 'm', emoji: '🏠' }, { word: 'sat', highlight: 's', emoji: '🪑' }], help: 'רק אחרי s, a, t, m. מבוגר יכול להדגים חיבור צלילים. התמונות מספקות הקשר ולא תחליף למשמעות המילה.' },
  { id: 'mat', kind: 'build', target: 'mat', letters: ['a', 't', 'm'], instruction: 'בני את המילה mat', speech: 'Build the word mat. Start on the left.' },
  { id: 'sat', kind: 'build', target: 'sat', letters: ['t', 's', 'a'], instruction: 'בני את המילה sat', speech: 'Build the word sat. Sat means someone was sitting.' },
  { id: 'count', kind: 'match', target: 'mat', instruction: 'mat — כמה אותיות יש במילה?', speech: 'Count the written letters in mat. How many letters are there?', choices: choicesForNumbers(3, 5) },
]) };
/** A word-building chapter declares exactly the glyphs introduced before it. */
export const wordBuildingPrerequisites:Record<string,string[]>={
 'he-known-words':['א','ב','ג','ד'], 'en-first-words':['s','a','t','m'],
};
function wordChapter(id:string,locale:'he'|'en',title:string,known:string[],words:[string,string][]):Lesson {
 wordBuildingPrerequisites[id]=known;
 const help=locale==='he'?'הרכבת מילה מוכרת בעזרת הקראה. אותיות הכתיב אינן בהכרח צלילים נפרדים, ואין ציפייה לקריאה בלי ניקוד.':'Listen to the whole word first. A grown-up can help blend its sounds. Count written letters separately from sounds.';
 const pages:Exercise[]=[{id:'intro',kind:'introduce',target:words[0][0],instruction:'נחבר אותיות שפגשנו למילים',speech:locale==='he'?'בואי נרכיב מילים מאותיות שכבר פגשנו. הקשיבי לכל המילה, ואז סדרי את האותיות שלה.':'Let us build some words from letters we have met. Listen to each whole word before you begin.',examples:words.map(([word,emoji])=>({word,emoji,highlight:word[0]})),help}];
 words.forEach(([word,emoji],i)=>{
  pages.push({id:`build-${i}`,kind:'build',target:word,letters:[...word].reverse(),instruction:`בני את המילה ${word}`,speech:locale==='he'?`המילה היא ${word}. הרכיבי את המילה ${word}, מימין לשמאל.`:`Build the word ${word}. Start on the left.`,emoji,help});
  pages.push({id:`count-${i}`,kind:'match',target:word,instruction:`${word} — כמה אותיות יש במילה?`,speech:locale==='he'?`ספרי את האותיות הכתובות במילה ${word}. כמה אותיות יש בה?`:`Count the written letters in ${word}. How many letters are there?`,choices:choicesForNumbers([...word].length,6),help:'סופרות אותיות כתובות, לא הברות ולא צלילים.'});
 });
 return {id,theme:locale==='he'?'hebrew':'english',locale,title,subtitle:'מילים מאותיות שפגשנו, בעזרת הקראה',cover:'🧩',color:'#e6d5ed',pages:finishPages(id,pages)};
}
function finalFormBook(form:typeof finalForms[number]):Lesson {
 const [regular,final,name,slug,word,emoji]=form,id=`he-final-${slug}`;
 return {id,theme:'hebrew',locale:'he',title:`${regular} · ${final} — ${name}`,subtitle:'אות מוכרת מקבלת צורה אחרת בסוף מילה',cover:'🌿',color:'#d7e5df',pages:finishPages(id,[
  {id:'hello',kind:'introduce',target:final,instruction:`הכירי את האות ${final} בסוף מילה`,speech:`זאת ${name}. זו צורה אחרת של האות ${regular}, שמופיעה בסוף מילה.`,examples:[{word,highlight:final,emoji}],help:'לא אות חדשה בסדר האלף־בית ולא צליל חדש. לומדות לזהות צורה סופית באותה משפחת אות.'},
  {id:'trace',kind:'trace',target:final,strokes:heStrokes[final],instruction:`עקבי אחרי ${final}`,speech:`עקבי אחרי הקווים של ${name}.`},
  {id:'find',kind:'find',target:final,text:`${word} ${regular} ${word}`,instruction:`מצאי את כל האותיות ${final}`,speech:`מצאי את כל ההופעות של ${name}.`},
  {id:'match',kind:'match',target:final,instruction:`איזו צורה מופיעה בסוף המילה ${word}?`,speech:`במילה ${word}, איזו צורה של האות מופיעה בסוף?`,choices:[{id:'final',label:final,correct:true},{id:'regular',label:regular,correct:false},{id:'other',label:'א',correct:false}]},
  {id:'paint',kind:'paint',target:final,instruction:`צבעי את האות ${final}`,speech:`בחרי צבע וצבעי את ${name}.`},
 ])};
}
const hebrewProgression:Lesson[]=[];
const heKnown:string[]=[];
hebrewAlphabet.forEach(([letter,name,slug],index)=>{
 hebrewProgression.push(heBook(letter,name,`he-${slug}`,index));heKnown.push(letter);
 const form=finalForms.find(v=>v[0]===letter);
 if(form){hebrewProgression.push(finalFormBook(form));heKnown.push(form[1]);}
 if(letter==='ד')hebrewProgression.push(hebrewWords);
 if(letter==='י')hebrewProgression.push(wordChapter('he-words-to-yod','he','דובי · דוד · חיה',[...heKnown],[['דובי','🧸'],['דוד','👨'],['חיה','🐾'],['בגד','👕'],['זהב','🪙']]));
 if(letter==='מ')hebrewProgression.push(wordChapter('he-words-to-mem','he','מים · לחם · כלב',[...heKnown],[['מים','💧'],['ים','🌊'],['לחם','🍞'],['כלב','🐕'],['חלב','🥛'],['מלך','👑']]));
 if(letter==='צ')hebrewProgression.push(wordChapter('he-words-to-tsadi','he','עץ · סוס · צב',[...heKnown],[['עץ','🌳'],['סוס','🐎'],['צב','🐢'],['נעל','👟'],['אף','👃'],['גן','🌷']]));
 if(letter==='ת')hebrewProgression.push(wordChapter('he-words-alphabet','he','תות · שמש · קשת',[...heKnown],[['תות','🍓'],['שמש','☀️'],['קשת','🌈'],['פרח','🌸'],['חתול','🐈'],['אסיה','🌸']]));
});
const englishProgression:Lesson[]=[];
englishOrder.forEach((letter,index)=>{
 englishProgression.push(englishBook(letter));const known=englishOrder.slice(0,index+1);
 if(letter==='m')englishProgression.push(englishWords);
 if(letter==='k')englishProgression.push(wordChapter('en-words-first-cvc','en','cat · pin · tap',known,[['cat','🐈'],['pin','📍'],['pan','🍳'],['tap','🚰'],['map','🗺️'],['tin','🥫']]));
 if(letter==='g')englishProgression.push(wordChapter('en-words-next-cvc','en','hen · red · pig',known,[['hen','🐔'],['red','🔴'],['pig','🐖'],['hat','👒'],['pen','🖊️'],['ten','🔟']]));
 if(letter==='u')englishProgression.push(wordChapter('en-words-short-vowels','en','dog · cup · sun',known,[['dog','🐕'],['cup','☕'],['sun','☀️'],['run','🏃'],['rug','🏠'],['gum','🫧']]));
 if(letter==='q')englishProgression.push(wordChapter('en-words-alphabet','en','jam · van · fox',known,[['jam','🍓'],['van','🚐'],['web','🕸️'],['zip','🤐'],['fox','🦊'],['bed','🛏️']]));
});
const numberArt:Lesson={id:'numbers-shape-lab',theme:'numbers',locale:'he',title:'בונות ומציירות מספרים',subtitle:'משחק צורות וכתיבה, בלי לחץ ובלי זמן',cover:'🎨',color:'#e9d9ec',pages:finishPages('numbers-shape-lab',[
 {id:'intro',kind:'introduce',target:'3',instruction:'נבנה צורות של מספרים מאותיות מוכרות',speech:'היום האותיות הן חלקי יצירה. נניח אותן על הקווים ונבנה צורה של מספר. זהו משחק צורות, לא חישוב.',help:'לאותיות אין כאן ערך מספרי. משתמשות בצורתן כמו בחלקי פסיפס.'},
 ...[0,1,2,3,4,5,6,7,8,9].map(n=>({id:`mosaic-${n}`,kind:'number-shape' as const,target:String(n),letters:['א','ב','ג','ד'],instruction:`בני את צורת הספרה ${n} מאותיות`,speech:`הניחי חלקי אותיות על הקווים ובני את צורת הספרה ${n}.`})),
 ...[0,1,2,3,4,5,6,7,8,9,10,12,15,20].map(n=>({id:`draw-${n}`,kind:'handwrite' as const,count:n,answer:n,emoji:'🌸',instruction:'ספרי וציירי את המספר',speech:'ספרי את הפרחים וציירי את המספר. אפשר גם לבחור מספר בלוח הספרות.',help:'זהו ניסיון כתיבה חופשי. אם המחשב לא מזהה, בחרי את המספר שהתכוונת אליו או השתמשי בלוח הספרות.'})),
])};

const starterLessons: Lesson[] = [
  ...hebrewProgression,
  ...englishProgression,
  countingBook('numbers-0-5', 0, 5, '🦋', '🦋'),
  countingBook('numbers-6-10', 6, 10, '🌷', '🌷'),
  countingBook('numbers-11-20', 11, 20, '⭐', '⭐'),
  arithmeticBook('+'), arithmeticBook('-'), numberArt,
  { id: 'numbers-try-keypad', theme: 'numbers', locale: 'he', title: 'סופרת ומקישה', subtitle: 'ללא אפשרויות: מזינות מספר בעצמנו', cover: '🔢', color: '#d8e6e6', pages: finishPages('numbers-try-keypad', [2, 4, 5, 7, 9, 10].map(n => ({ id: `answer-${n}`, kind: 'keypad', count: n, answer: n, emoji: '🍓', instruction: 'ספרי את התותים והקישי כמה יש', speech: 'ספרי את התותים והקישי כמה יש.' }))) },
];

export const lessons: Lesson[] = [...starterLessons, ...playLessons, ...typingLessons];
