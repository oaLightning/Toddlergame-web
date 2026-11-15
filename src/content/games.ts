import type { Lesson } from '../types';

export const playLessons: Lesson[] = [
  { id: 'play-freeze', theme: 'play', locale: 'he', title: 'קסם הקרח של אלזה', subtitle: 'מקפיאות דברים שזזים, בלי שעון', cover: '❄️', color: '#d4e7ef', pages: [
    { id: 'freeze-garden', kind: 'freeze', instruction: 'הקפיאי את כל הדברים בגן הקסום', speech: 'בואי נעשה קסם כמו אלזה! לחצי על הדברים שזזים והקפיאי אותם. אין צורך למהר.', audioId: 'play.freeze.instructions' },
  ] },
  { id: 'play-puzzle', theme: 'play', locale: 'he', title: 'תמונות שמתחברות', subtitle: 'דמויות אהובות, 20 עד 60 חלקים', cover: '🧩', color: '#ead6e9', pages: [
    { id: 'picture-puzzle', kind: 'puzzle', instruction: 'בואי נחבר את התמונה', speech: 'בחרי תמונה וכמה חלקים תרצי. גררי כל חלק צבעוני למקום שלו בתמונה. אם הוא לא מתאים, הוא יחזור למגש.', audioId: 'play.puzzle.instructions' },
  ] },
  { id: 'play-keybash', theme: 'play', locale: 'he', title: 'מקלדת של הפתעות', subtitle: 'מקישות, נוגעות ומגלות קסמים', cover: '🫧', color: '#d8e9df', pages: [
    { id: 'surprises', kind: 'keybash', instruction: 'כל מקש הוא הפתעה קטנה', speech: 'לחצי על משטח המשחק. עכשיו אפשר להקיש על המקלדת, או לגעת במסך, ולגלות הפתעות!', audioId: 'play.keybash.instructions' },
  ] },
];

export const typingLessons: Lesson[] = [
  { id: 'he-typing', theme: 'hebrew', locale: 'he', title: 'האותיות במקלדת', subtitle: 'מוצאות א–ד, ואז מקלידות רצפים', cover: '⌨️', color: '#dfd4ef', pages: [
    { id: 'find-key', kind: 'typing', typingMode: 'find', keyboardLocale: 'he', targets: ['א','ב','ג','ד'], instruction: 'מצאי את האות במקלדת', speech: 'מצאי את האות הגדולה במקלדת ולחצי עליה. אפשר גם לגעת במקלדת שעל המסך.', audioId: 'typing.he.find' },
    { id: 'repeat-keys', kind: 'typing', typingMode: 'repeat', keyboardLocale: 'he', sequences: ['אב','גד','בא','אבא','דג'], instruction: 'הקשיבי לרצף, ואז הקלידי כמוני', speech: 'נסתכל על רצף של אותיות. אחר כך הקלידי אותו לפי הסדר. אפשר לשמוע שוב בכל רגע.', audioId: 'typing.he.repeat' },
  ] },
  { id: 'en-typing', theme: 'english', locale: 'en', title: 'Letters on the keyboard', subtitle: 'מוצאות s, a, t, m ומקלידות יחד', cover: '⌨️', color: '#d8e4ee', pages: [
    { id: 'find-key', kind: 'typing', typingMode: 'find', keyboardLocale: 'en', targets: ['s','a','t','m'], instruction: 'מצאי את האות באנגלית במקלדת', speech: 'Find the big letter on the keyboard. You can also tap the keyboard on the screen.', audioId: 'typing.en.find' },
    { id: 'repeat-keys', kind: 'typing', typingMode: 'repeat', keyboardLocale: 'en', sequences: ['sa','at','am','mat','sat'], instruction: 'הקלידי את האותיות לפי הסדר', speech: 'Watch the letters. Then type the same letters in order. You can play the example again.', audioId: 'typing.en.repeat' },
  ] },
  { id: 'numbers-typing', theme: 'numbers', locale: 'he', title: 'מספרים במקלדת', subtitle: 'מוצאות ספרות וחוזרות על רצפים', cover: '⌨️', color: '#e8dfc9', pages: [
    { id: 'find-key', kind: 'typing', typingMode: 'find', keyboardLocale: 'numbers', targets: ['1','2','3','4','5','6','7','8','9','0'], instruction: 'מצאי את הספרה במקלדת', speech: 'הסתכלי על הספרה הגדולה ולחצי עליה במקלדת. אפשר גם לגעת במספר שעל המסך.', audioId: 'typing.numbers.find' },
    { id: 'repeat-keys', kind: 'typing', typingMode: 'repeat', keyboardLocale: 'numbers', sequences: ['12','23','10','321','2020'], instruction: 'הקלידי את רצף הספרות', speech: 'נראה רצף של ספרות. הקלידי אותן לפי הסדר. זה רצף ספרות, ולא תרגיל חשבון.', audioId: 'typing.numbers.repeat' },
  ] },
];
