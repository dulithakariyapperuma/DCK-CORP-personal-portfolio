import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
export type AppId = 'explorer'|'about'|'project'|'terminal'|'settings';
export type TerminalSession = { cwd: string; lines: string[]; history: string[] };
export const initialTerminal: TerminalSession = {cwd:'/',lines:['DCK CORP OS / Application shell','Type help for commands. Tab completes; ↑ ↓ recalls history.','Files live in this browser. This shell controls DCK CORP OS, not your computer.'],history:[]};
type Props = {session:TerminalSession;setSession:React.Dispatch<React.SetStateAction<TerminalSession>>;open:(id:AppId)=>void;close:(id:AppId)=>void;project:(index:number)=>void;folder:(name:string)=>void;lock:()=>void;intro:()=>void;sound:boolean;toggleSound:()=>void;animated:boolean;setAnimated:(value:boolean)=>void;windows:AppId[];projects:{name:string;desc:string;type:string}[]};
const commands=['help','ls','cd','pwd','cat','open','close','windows','projects','about','settings','sound','motion','lock','intro','date','whoami','uname','status','echo','write','rm','history','clear'];
const aliases:Record<string,AppId>={profile:'about',about:'about',projects:'explorer',files:'explorer',explorer:'explorer',terminal:'terminal',settings:'settings',project:'project'};
export function resolvePath(cwd:string,path:string){const parts=(path.startsWith('/')?path:cwd+'/'+path).split('/');const result:string[]=[];for(const part of parts){if(part==='..')result.pop();else if(part&&part!=='.'&&part!=='~')result.push(part);}return '/'+result.join('/');}
function readNotes():Record<string,string>{try{const raw=JSON.parse(localStorage.getItem('dck-os-notes')||'{}');return Object.fromEntries(Object.entries(raw).filter(([k,v])=>/^\/notes\/[\w.-]+$/.test(k)&&typeof v==='string')) as Record<string,string>;}catch{return {}}}
export default function TerminalApp(p:Props){const [input,setInput]=useState('');const [position,setPosition]=useState(-1);const draft=useRef('');const end=useRef<HTMLDivElement>(null);const inputRef=useRef<HTMLInputElement>(null);useEffect(()=>{end.current?.scrollIntoView({block:'nearest'})},[p.session.lines]);
 const files:Record<string,string>={'/profile.txt':'DCK CORP — independent creative practice. Design, development, and interactive experiences.','/readme.txt':'Welcome to DCK CORP OS.\n/projects contains concept project dossiers.\n/notes stores your own text files in this browser.\nTry: open projects, cat /projects/monolith.txt, write /notes/idea.txt "A new idea".'};
 const slugs=['monolith','form-02','signal'];p.projects.forEach((project,i)=>{files['/projects/'+slugs[i]+'.txt']=`${project.name}\n${project.type}\n\n${project.desc}`});
 const dirs=['/','/projects','/notes'];const notes=readNotes();const all={...files,...notes};
 function execute(raw:string){const tokens=raw.match(/"[^"]*"|'[^']*'|\S+/g)?.map(t=>t.replace(/^(["'])(.*)\1$/,'$2'))||[];const command=(tokens.shift()||'').toLowerCase();const arg=tokens[0];const path=resolvePath(p.session.cwd,arg||'.');let cwd=p.session.cwd;let output='';let action:(()=>void)|undefined;
 if(!command)return;
 if((raw.match(/"/g)||[]).length%2||(raw.match(/'/g)||[]).length%2) output='Unclosed quote. Wrap text in matching single or double quotes.';
 else switch(command){
 case 'help': output='NAVIGATE\n  ls [path] · cd <directory> · pwd · cat <file>\nAPPLICATIONS\n  open <profile|projects|terminal|settings|project name>\n  close <app> · windows · projects · about · settings\nSESSION\n  sound on|off · motion on|off · lock · intro\n  status · date · whoami · uname\nYOUR NOTES (saved in this browser)\n  write /notes/name.txt "your text" · rm /notes/name.txt\nSHELL\n  echo <text> · history · clear\n\nUse Tab to complete commands/paths, ↑ ↓ for history, Ctrl+L to clear.\nNo system shell commands, pipes, or network access.';break;
 case 'pwd':output=cwd;break;
 case 'ls':if(!dirs.includes(path))output=all[path]!==undefined?path:`No such path: ${path}`;else output=[...dirs.filter(d=>d!=='/'&&resolvePath(d,'..')===path).map(d=>d.split('/').pop()+'/'),...Object.keys(all).filter(f=>resolvePath(f,'..')===path).map(f=>f.split('/').pop())].join('  ')||'(empty directory)';break;
 case 'cd':if(!arg||arg==='~')cwd='/';else if(dirs.includes(path))cwd=path;else output=`Not a directory: ${path}`;break;
 case 'cat':output=!arg?'Usage: cat <file>':all[path]??`No such file: ${path}`;break;
 case 'write':if(!arg||tokens.length<2)output='Usage: write /notes/name.txt "your text"';else if(!/^\/notes\/[\w.-]+$/.test(path))output='Write files inside /notes using letters, numbers, dots, dashes, or underscores.';else{try{localStorage.setItem('dck-os-notes',JSON.stringify({...notes,[path]:tokens.slice(1).join(' ')}));output=`Saved ${path}`;}catch{output='Could not save: browser storage is unavailable or full.'}}break;
 case 'rm':if(!arg)output='Usage: rm /notes/name.txt';else if(notes[path]===undefined)output='Only existing files in /notes can be removed.';else{try{const next={...notes};delete next[path];localStorage.setItem('dck-os-notes',JSON.stringify(next));output=`Removed ${path}`;}catch{output='Could not update browser storage.'}}break;
 case 'open':{const name=tokens.join(' ').toLowerCase();const project=slugs.indexOf(name.replace(/^\/projects\//,'').replace(/\.txt$/,''));if(project>=0){action=()=>p.project(project);output=`Opening ${p.projects[project].name}…`;}else if(aliases[name]){action=()=>p.open(aliases[name]);output=`Opening ${name}…`;}else output='Usage: open profile|projects|terminal|settings|monolith|form-02|signal';break;}
 case 'close':if(!arg||!aliases[arg])output='Usage: close profile|projects|terminal|settings|project';else if(!p.windows.includes(aliases[arg]))output=`${arg} is not open.`;else{action=()=>p.close(aliases[arg]);output=`Closed ${arg}.`;}break;
 case 'windows':output=p.windows.join('\n')||'No open windows.';break;
 case 'projects':action=()=>{p.folder('Projects');p.open('explorer')};output='Opening projects…';break;
 case 'about':action=()=>p.open('about');output='Opening profile…';break;
 case 'settings':action=()=>p.open('settings');output='Opening settings…';break;
 case 'sound':if(!arg)output=`Sound is ${p.sound?'on':'off'}.`;else if(!['on','off'].includes(arg))output='Usage: sound on|off';else{if((arg==='on')!==p.sound)action=p.toggleSound;output=`Sound ${arg==='on'?'requested on':'off'}.`;}break;
 case 'motion':if(!arg)output=`Motion is ${p.animated?'on':'off'}.`;else if(!['on','off'].includes(arg))output='Usage: motion on|off';else{action=()=>p.setAnimated(arg==='on');output=`Motion ${arg}.`;}break;
 case 'lock':action=p.lock;output='Session locked.';break;
 case 'intro':action=p.intro;output='Opening introduction…';break;
 case 'date':output=new Date().toLocaleString();break;
 case 'whoami':output='guest / local browser session';break;
 case 'uname':output='DCK CORP OS 1.0 / Browser application shell';break;
 case 'status':output=`DCK CORP OS — online\nSound: ${p.sound?'on':'off'}\nMotion: ${p.animated?'on':'off'}\nOpen windows: ${p.windows.length}\nSaved notes: ${Object.keys(notes).length}`;break;
 case 'echo':output=tokens.join(' ');break;
 case 'history':output=[...p.session.history,raw].map((line,i)=>`${i+1}  ${line}`).join('\n');break;
 case 'clear':break;
 default:output=`Unknown command: ${command}. Type help to see available commands.`;
 }
 p.setSession(s=>({cwd,history:[...s.history,raw].slice(-100),lines:command==='clear'?[]:[...s.lines,`guest@dck:${s.cwd} $ ${raw}`,...(output?[output]:[])].slice(-200)}));setInput('');setPosition(-1);draft.current='';action?.();inputRef.current?.focus();
 }
 function key(event:React.KeyboardEvent<HTMLInputElement>){if(event.key==='ArrowUp'||event.key==='ArrowDown'){event.preventDefault();if(position===-1)draft.current=input;const next=event.key==='ArrowUp'?Math.min(position+1,p.session.history.length-1):Math.max(position-1,-1);setPosition(next);setInput(next===-1?draft.current:p.session.history[p.session.history.length-1-next]||'');}else if(event.ctrlKey&&event.key==='l'){event.preventDefault();p.setSession(s=>({...s,lines:[]}));}else if(event.key==='Tab'){event.preventDefault();const tokens=input.split(' ');const partial=tokens.pop()||'';const candidates=tokens.length===0?commands:[...Object.keys(aliases),...slugs,...dirs,...Object.keys(all),...Object.keys(all).filter(f=>resolvePath(f,'..')===p.session.cwd).map(f=>f.split('/').pop()!)];const matches=[...new Set(candidates)].filter(c=>c.startsWith(partial));if(matches.length===1)setInput([...tokens,matches[0]].join(' '));else if(matches.length>1)p.setSession(s=>({...s,lines:[...s.lines,matches.join('  ')]}));}}
 return <div className="terminal-app"><div role="log" aria-label="Terminal output" aria-live="polite">{p.session.lines.map((line,i)=><p key={i}>{line}</p>)}</div><form onSubmit={e=>{e.preventDefault();execute(input)}}><label htmlFor="terminal-input">guest@dck:{p.session.cwd} $</label><input ref={inputRef} id="terminal-input" aria-label="Terminal command" autoFocus autoComplete="off" spellCheck={false} value={input} onChange={e=>{setInput(e.target.value);setPosition(-1)}} onKeyDown={key}/><button aria-label="Run command"><Play size={12}/></button></form><div ref={end}/></div>
}
