export interface PaintOutline { name: string; paths: string[]; glyph?:string; circles?: {cx:number;cy:number;r:number}[]; ellipses?: {cx:number;cy:number;rx:number;ry:number}[] }
export const paintOutlines: Record<string,PaintOutline> = {
  watermelon: {name:'אבטיח',paths:['M115 150 Q300 420 485 150 Z','M132 150 Q300 385 468 150','M211 192 Q205 205 214 214 Q224 205 211 192 Z','M275 222 Q268 237 277 245 Q289 235 275 222 Z','M340 221 Q331 236 341 244 Q354 231 340 221 Z','M393 185 Q385 200 395 209 Q407 196 393 185 Z']},
  banana: {name:'בננה',paths:['M146 110 C154 270 321 365 457 223 C394 357 210 374 136 230 C112 184 120 140 146 110 Z','M146 110 L159 91 L172 98 L160 124','M160 124 C183 266 327 321 446 226','M448 220 L468 213 L476 226 L458 237']},
  carrot: {name:'גזר',paths:['M246 130 C267 106 337 107 355 138 C354 204 316 293 266 352 C246 292 226 206 246 130 Z','M262 124 C235 90 235 56 249 45 C272 48 283 87 286 116','M287 115 C277 65 295 38 310 42 C330 61 317 91 313 116','M314 119 C332 72 358 64 367 78 C372 98 344 122 336 128','M250 170 L282 179','M314 207 L341 194','M252 246 L283 254','M291 292 L310 278']},
  fish: {name:'דג',paths:['M151 213 C200 101 350 92 421 202 C350 328 211 328 151 213 Z','M151 213 L83 145 Q104 212 83 282 Z','M270 126 L311 83 L329 128','M264 294 L305 337 L332 294','M377 157 Q339 217 378 265','M395 229 Q408 235 419 220'],circles:[{cx:383,cy:194,r:9},{cx:458,cy:114,r:17},{cx:490,cy:74,r:11}]},
  apple: {name:'apple',paths:['M300 142 C220 81 138 144 156 230 C166 291 207 345 251 334 C281 326 305 326 337 334 C389 347 439 283 444 221 C450 142 375 94 300 142 Z','M300 143 Q289 108 311 77','M309 104 Q340 59 385 81 Q361 128 309 104 Z']},
  sun: {name:'sun',paths:['M300 49 V79','M300 339 V369','M139 209 H170','M430 209 H461','M186 95 L208 117','M392 301 L414 323','M185 323 L208 301','M392 117 L414 95'],circles:[{cx:300,cy:209,r:101}]},
  moon: {name:'moon',paths:['M358 72 C198 43 147 222 245 315 C288 355 365 360 412 310 C291 326 243 169 358 72 Z','M419 107 L429 129 L454 133 L435 150 L439 176 L418 164 L395 176 L400 151 L382 133 L407 129 Z','M164 64 L172 82 L191 84 L176 98 L179 117 L163 107 L147 117 L150 98 L136 84 L155 82 Z']},
  turtle: {name:'turtle',paths:['M182 214 Q189 132 294 122 Q398 128 417 211 Z','M225 137 L253 171 L229 211','M293 123 L315 171 L291 212','M356 139 L366 176 L349 212','M185 213 Q161 261 185 273 Q215 271 229 217','M348 214 Q361 270 388 271 Q413 257 390 215','M170 208 L141 226 L173 234','M414 187 C448 145 483 157 482 188 C480 216 448 234 414 218'],circles:[{cx:466,cy:181,r:5}]},
  tree: {name:'tree',paths:['M265 268 V357 H334 V267','M300 54 L188 170 H237 L157 260 H443 L362 170 H410 Z','M300 283 V340','M300 315 L279 298']},
  flower: {name:'פרח',paths:['M301 231 V350','M301 309 C241 304 224 272 232 261 C265 256 291 279 301 309 Z','M301 281 C326 249 357 246 372 257 C365 282 331 299 301 296'],circles:[{cx:300,cy:154,r:35},{cx:300,cy:98,r:33},{cx:351,cy:128,r:33},{cx:351,cy:181,r:33},{cx:300,cy:210,r:33},{cx:249,cy:182,r:33},{cx:249,cy:128,r:33}]},
};
export function outlineFor(target?:string,outline?:string): PaintOutline {
  if(!outline&&/^(?:0|[1-9]|1[0-9]|20)$/.test(target??''))return {name:target!,glyph:target,paths:[]};
  const map:Record<string,string>={'א':'watermelon','ב':'banana','ג':'carrot','ד':'fish',a:'apple',s:'sun',t:'turtle',m:'moon'};
  const mapped=outline??map[target??''];
  if(mapped&&paintOutlines[mapped])return paintOutlines[mapped];
  if(!outline&&/^[א-תa-z]$/i.test(target??''))return {name:/^[א-ת]$/.test(target!)?`האות ${target}`:`Letter ${target}`,glyph:target,paths:[]};
  return paintOutlines.flower;
}
export function paintPoint(clientX:number,clientY:number,rect:{left:number;top:number;width:number;height:number}):{x:number;y:number} {
  return {x:Math.max(0,Math.min(600,(clientX-rect.left)/rect.width*600)),y:Math.max(0,Math.min(420,(clientY-rect.top)/rect.height*420))};
}
