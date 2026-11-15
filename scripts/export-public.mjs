import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { createHash } from 'node:crypto';

const root=process.cwd(), output=resolve(process.argv[2] ?? '../Toddlergame-web');
if(output===root||output.startsWith(root+'/')) throw Error('Public export must be outside the private source checkout.');
const tracked=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const hash=b=>createHash('sha256').update(b).digest('hex');
const privateHashes=new Set(tracked.filter(p=>p.startsWith('public/portraits/')&&/\.(webp|png|jpe?g)$/i.test(p)).map(p=>hash(readFileSync(p))));
let count=0;
for(const path of tracked){
  if(path.startsWith('public/portraits/')||path.startsWith('.env')||/\.(pdf|log)$/i.test(path)||/^docs\/.*\.(png|jpe?g|webp)$/i.test(path))continue;
  if(!/^(src\/|scripts\/|tests\/|docs\/|public\/(characters|audio|fonts)\/|\.github\/|(?:AGENTS|README)\.md$|\.gitignore$|(?:package(?:-lock)?|tsconfig)\.json$|vite\.config\.ts$|index\.html$)/.test(path))continue;
  const bytes=readFileSync(path);
  if(privateHashes.has(hash(bytes)))throw Error(`Private photo under another name: ${path}`);
  if(/\.(?:[cm]?[jt]sx?|json|md|html|css|yml|yaml|txt)$/i.test(path)&&/(?:ghp_[A-Za-z0-9]{20,}|sk-proj-[A-Za-z0-9_-]{20,})/.test(bytes.toString()))throw Error(`Credential pattern: ${path}`);
  const target=resolve(output,path);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,bytes);count++;
}
if(existsSync(resolve(output,'public/portraits')))throw Error('Destination already contains portraits. Use a clean checkout.');
console.log(`Exported ${count} safe files to ${relative(root,output)}. Git history and classroom photos were not copied.`);
