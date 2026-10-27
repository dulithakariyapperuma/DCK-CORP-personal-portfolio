import React, { Suspense, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check, Command, Folder, FolderOpen, Grid2X2, HardDrive, LockKeyhole, Maximize2, Minus, Monitor, Search, Settings2, ShieldCheck, Terminal, UserRound, Volume2, VolumeX, X } from 'lucide-react';
import './style.css';
import { DesktopAudio } from './audio';
import TerminalApp, { initialTerminal } from './TerminalApp';
import ProfileArchive from './ProfileArchive';

type WindowId = 'explorer'|'about'|'project'|'terminal'|'settings';
const projects = [
 {name:'MONOLITH',category:'DIGITAL EXPERIENCE',year:'2026',type:'Web design / Development',image:'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1300&q=85',desc:'An architectural study in clarity. A concept digital experience exploring the space between physical structures and the interfaces we inhabit.'},
 {name:'FORM / 02',category:'IDENTITY SYSTEM',year:'2026',type:'Art direction / Identity',image:'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=85',desc:'A concept identity system built from structure, repetition, and restraint. An exploration of how simple forms become a distinctive visual language.'},
 {name:'SIGNAL',category:'EXPERIMENTAL LAB',year:'2025',type:'Creative coding / Three.js',image:'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=85',desc:'An ongoing concept experiment in generative movement. Organic rhythms and digital systems meet in an ever-changing visual landscape.'}
];
function Sculpture({animated}:{animated:boolean}) {const ref=useRef<THREE.Group>(null); useFrame((_,delta)=>{if(ref.current&&animated){ref.current.rotation.z+=delta*.018;ref.current.rotation.y+=delta*.025;}});return <group ref={ref} rotation={[.2,.1,-.53]} position={[1,0,-2]}>{[-4,-1,2,5].map((x,i)=><mesh key={x} position={[x,0,i%2]}><boxGeometry args={[1.5,24,.4]}/><meshStandardMaterial color={i%2?'#8d8f85':'#363a35'} roughness={.6} metalness={.4}/></mesh>)}</group>}
function Background({animated}:{animated:boolean}) {return <div className="three-background"><Canvas camera={{position:[0,0,12],fov:48}} dpr={[1,1.5]} gl={{alpha:true}}><ambientLight intensity={2}/><directionalLight position={[5,8,8]} intensity={3}/><Suspense fallback={null}><Sculpture animated={animated}/></Suspense></Canvas></div>}
function Logo({className=''}:{className?:string}){return <img className={className} src="/logo.svg" alt="DCK CORP logo"/>}
function App(){
 const [menu,setMenu]=useState(false);
 const [menuSearch,setMenuSearch]=useState('');
 const [intro,setIntro]=useState(()=>{try{return localStorage.getItem('dck-os-welcomed')!=='1'}catch{return true}});
 const [terminalSession,setTerminalSession]=useState(initialTerminal);
 const menuRef=useRef<HTMLDivElement>(null);
 const launcherRef=useRef<HTMLButtonElement>(null);
 const introRef=useRef<HTMLButtonElement>(null);
 function dismissIntro(){setIntro(false);try{localStorage.setItem('dck-os-welcomed','1')}catch{} launcherRef.current?.focus();}
 useEffect(()=>{if(intro)introRef.current?.focus();},[intro]);
 useEffect(()=>{if(!menu)return;const outside=(e:PointerEvent)=>{if(!menuRef.current?.contains(e.target as Node)&&!launcherRef.current?.contains(e.target as Node))setMenu(false)};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside)},[menu]);
 const reduced=useReducedMotion();const [animated,setAnimated]=useState(!reduced);const [windows,setWindows]=useState<WindowId[]>([]);const [selected,setSelected]=useState(0);const [locked,setLocked]=useState(false);const [boot,setBoot]=useState(true);const [time,setTime]=useState(new Date());const [folder,setFolder]=useState('Projects');const [search,setSearch]=useState('');const [sound,setSound]=useState(false);const [toast,setToast]=useState('');const [maximized,setMaximized]=useState<WindowId|null>(null);
 useEffect(()=>{const t=setTimeout(()=>setBoot(false),1100);const clock=setInterval(()=>setTime(new Date()),1000);return()=>{clearTimeout(t);clearInterval(clock)}},[]);
 useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(''),3000);return()=>clearTimeout(t)}},[toast]);
 function open(id:WindowId){setMenu(false);setWindows(w=>[...w.filter(x=>x!==id),id]);}function close(id:WindowId){setWindows(w=>w.filter(x=>x!==id));setMaximized(m=>m===id?null:m)}
 useEffect(()=>{function key(e:KeyboardEvent){if(e.key==='Escape'){if(intro){dismissIntro();return}if(menu){setMenu(false);launcherRef.current?.focus();return}if(locked)setLocked(false);else setWindows(w=>w.slice(0,-1));}if((e.metaKey||e.ctrlKey)&&e.key==='k'&&!intro&&!locked){e.preventDefault();open('explorer')}}window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[locked,menu,intro]);
 function showProject(i:number){setSelected(i);open('project')}
 const audio = useRef<DesktopAudio | null>(null);
 useEffect(() => {
   const click = (event: MouseEvent) => {
     if ((event.target as Element).closest('button, a, input')) audio.current?.click();
   };
   const visibility = () => audio.current?.setVisible(!document.hidden);
   document.addEventListener('click', click, true);
   document.addEventListener('visibilitychange', visibility);
   return () => {
     document.removeEventListener('click', click, true);
     document.removeEventListener('visibilitychange', visibility);
     audio.current?.dispose();
     audio.current = null;
   };
 }, []);
 function beep() {
   if (audio.current) {
     audio.current.dispose(); audio.current = null; setSound(false);
   } else {
     try {
       const engine = new DesktopAudio(); audio.current = engine; setSound(true);
       void engine.enable().then(() => engine.click()).catch(() => {
         engine.dispose();
         if (audio.current === engine) { audio.current = null; setSound(false); setToast('Audio could not start. Try enabling it again.'); }
       });
     } catch { setToast('Audio is unavailable in this browser.'); }
   }
 }
 return <main className="os"><Background animated={animated}/><div className="noise"/>
 <header className="os-topbar">
   <button ref={launcherRef} className={'os-launcher '+(menu?'selected':'')} aria-label="DCK CORP OS applications" aria-expanded={menu} aria-controls="application-menu" onClick={()=>{setMenu(!menu);setMenuSearch('')}}><Logo/><strong>DCK CORP OS</strong><span>⌄</span></button>
   <span className="top-active">{windows.at(-1)==='about'?'PROFILE':windows.at(-1)?.toUpperCase()||'DESKTOP'}</span>
   <time>{time.toLocaleDateString('en-GB',{day:'2-digit',month:'short'})} <span>·</span> {time.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</time>
   <span className="top-online"><span className="live-dot"/> ONLINE</span>
 </header>
 <AnimatePresence>{menu&&<motion.div id="application-menu" ref={menuRef} className="application-menu" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} onKeyDown={e=>{if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)&&!(e.target instanceof HTMLInputElement)){e.preventDefault();const items=Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button')||[]);const current=items.indexOf(document.activeElement as HTMLButtonElement);items[e.key==='Home'?0:e.key==='End'?items.length-1:(current+(e.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus();}}}>
   <div className="menu-heading"><Logo/><div><strong>DCK CORP OS</strong><span>Guest · Local workspace</span></div><span className="menu-version">01</span></div>
   <label className="menu-search"><Search size={14}/><input autoFocus aria-label="Search applications" placeholder="Find an application…" value={menuSearch} onChange={e=>setMenuSearch(e.target.value)} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();menuRef.current?.querySelector('button')?.focus()}}}/></label>
   <nav aria-label="Applications">{[{id:'about',name:'Profile',detail:'Certifications and learning archive',icon:UserRound},{id:'explorer',name:'Projects',detail:'Browse the project directory',icon:FolderOpen},{id:'terminal',name:'Terminal',detail:'Control your workspace',icon:Terminal},{id:'settings',name:'Settings',detail:'Sound and appearance',icon:Settings2}].filter(app=>(app.name+' '+app.detail).toLowerCase().includes(menuSearch.toLowerCase())).map(({id,name,detail,icon:Icon})=><button key={id} onClick={()=>open(id as WindowId)}><Icon size={21} strokeWidth={1.3}/><span><strong>{name}</strong><small>{detail}</small></span><ArrowUpRight size={14}/></button>)}</nav>
   {menuSearch&&!['profile certifications and learning archive','projects browse the project directory','terminal control your workspace','settings sound and appearance'].some(s=>s.includes(menuSearch.toLowerCase()))&&<p className="menu-empty">No applications found.</p>}
   <div className="menu-utilities"><button onClick={()=>{setWindows([]);setMenu(false)}}><Grid2X2 size={15}/>Show desktop</button><button onClick={()=>{setIntro(true);setMenu(false)}}><Monitor size={15}/>Introduction</button></div>
   <div className="menu-session"><button onClick={beep}>{sound?<Volume2 size={15}/>:<VolumeX size={15}/>}Sound {sound?'on':'off'}</button><button onClick={()=>{setLocked(true);setMenu(false)}}><LockKeyhole size={15}/>Lock session</button></div>
 </motion.div>}</AnimatePresence>
 <section className="desktop clean-desktop" aria-label="Desktop">
   <aside className="desktop-shortcuts" aria-label="Desktop applications">
     {[{icon:UserRound,label:'Profile',id:'about'},{icon:FolderOpen,label:'Projects',id:'explorer'},{icon:Terminal,label:'Terminal',id:'terminal'}].map(({icon:Icon,label,id})=><button key={id} onClick={()=>open(id as WindowId)}><span><Icon size={28} strokeWidth={1.25}/></span>{label}</button>)}
   </aside>
 </section>
 <footer className="taskbar"><button className="start-button" onClick={()=>{setWindows([]);setMaximized(null)}}><Logo/><span>DCK CORP<span> OS</span></span></button><nav>{[{icon:Grid2X2,label:'Workspace',id:''},{icon:FolderOpen,label:'Files',id:'explorer'},{icon:UserRound,label:'Profile',id:'about'},{icon:Terminal,label:'Terminal',id:'terminal'}].map(({icon:Icon,label,id})=><button key={label} aria-label={label} className={(!id&&!windows.length)||windows.includes(id as WindowId)?'active':''} onClick={()=>id?open(id as WindowId):setWindows([])}><Icon size={17}/><span>{label}</span>{windows.includes(id as WindowId)&&<i/>}</button>)}</nav><div className="taskbar-right"><span className="session-label"><span className="live-dot"/>LOCAL SESSION</span><button aria-pressed={sound} title={sound?'Mute ambient sound':'Enable ambient sound'} aria-label={sound?'Mute sound':'Enable sound'} onClick={beep}>{sound?<Volume2 size={16}/>:<VolumeX size={16}/>}</button><button aria-label="Settings" onClick={()=>open('settings')}><Settings2 size={17}/></button><button aria-label="Lock screen" onClick={()=>setLocked(true)}><LockKeyhole size={16}/></button></div></footer>
 <AnimatePresence>{windows.map((id,index)=><OSWindow key={id} id={id} index={index} max={maximized===id} onFocus={()=>{if(windows.at(-1)!==id)open(id)}} onClose={()=>close(id)} onMax={()=>setMaximized(maximized===id?null:id)}>
 {id==='about'&&<ProfileArchive/>}
 {id==='explorer'&&<div className="explorer-content"><aside>{['Projects','Experiments'].map(f=><button className={folder===f?'selected':''} onClick={()=>setFolder(f)} key={f}><Folder size={15}/>{f}</button>)}<span>LOCAL DISK / DCK</span></aside><div><div className="explorer-search"><span>/ {folder.toLowerCase()}</span><label><Search size={14}/><input aria-label="Search projects" placeholder="Find a project…" value={search} onChange={e=>setSearch(e.target.value)}/></label></div><div className="file-grid">{projects.map((p,i)=>({p,i})).filter(({p,i})=>(folder!=='Experiments'||i>0)&&p.name.toLowerCase().includes(search.toLowerCase())).map(({p,i})=><button key={p.name} onClick={()=>showProject(i)}><img src={p.image} alt={p.name+' concept'}/><strong>{p.name}<ArrowUpRight size={13}/></strong><span>{p.category}</span></button>)}</div>{!projects.some((p,i)=>(folder!=='Experiments'||i>0)&&p.name.toLowerCase().includes(search.toLowerCase()))&&<p className="empty-state">No files match “{search}”. Try another name.</p>}<div className="explorer-foot"><HardDrive size={12}/> Concept portfolio / Read only</div></div></div>}
 {id==='project'&&<div className="project-detail"><img src={projects[selected].image} alt={projects[selected].name+' architecture study'}/><div><span className="eyebrow">{projects[selected].category} / {projects[selected].year}</span><h2>{projects[selected].name}</h2><p>{projects[selected].desc}</p><div className="project-facts"><span>DISCIPLINE<strong>{projects[selected].type}</strong></span><span>STATUS<strong>Concept study</strong></span></div><button className="solid-button" onClick={()=>setSelected((selected+1)%projects.length)}>Next project <ArrowUpRight size={16}/></button></div></div>}
 {id==='terminal'&&<TerminalApp session={terminalSession} setSession={setTerminalSession} open={open} close={close} project={showProject} folder={setFolder} lock={()=>setLocked(true)} intro={()=>setIntro(true)} sound={sound} toggleSound={beep} animated={animated} setAnimated={setAnimated} windows={windows} projects={projects}/>}
 {id==='settings'&&<div className="settings-content"><span className="eyebrow">PERSONALIZE YOUR SESSION</span><h2>System preferences</h2><div><span><Monitor size={19}/> Animated environment<small>Three.js background movement</small></span><button role="switch" aria-checked={animated} aria-label="Animated environment" className={'toggle '+(animated?'on':'')} onClick={()=>setAnimated(!animated)}><i/></button></div><div><span>{sound?<Volume2 size={19}/>:<VolumeX size={19}/>} Interface audio<small>Quiet cinematic ambience and metallic click effects</small></span><button role="switch" aria-checked={sound} aria-label="Interface audio" className={'toggle '+(sound?'on':'')} onClick={beep}><i/></button></div><div><span><ShieldCheck size={19}/> Session storage<small>Everything runs locally in your browser</small></span><Check size={16}/></div><p>DCK CORP OS / React + Three.js + Framer Motion</p></div>}
 </OSWindow>)}</AnimatePresence>
 <AnimatePresence>{intro&&<motion.div className="intro-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><section role="dialog" aria-modal="true" aria-labelledby="intro-title" className="intro-card" onKeyDown={e=>{if(e.key==='Tab'){e.preventDefault();introRef.current?.focus()}}}>
 <div className="intro-top"><Logo/><span>WELCOME / 01</span></div><span className="eyebrow">AN INDEPENDENT DIGITAL WORKSPACE</span><h1 id="intro-title">DCK CORP OS<span>A different way<br/>to explore.</span></h1><p>A personal portfolio built like a desktop. Open a window, discover the projects, and make yourself at home.</p>
 <div className="intro-features"><span><UserRound size={18}/><strong>Meet the creator</strong><small>Open Profile</small></span><span><FolderOpen size={18}/><strong>Explore the work</strong><small>Browse Projects</small></span><span><Terminal size={18}/><strong>Take control</strong><small>Type help in Terminal</small></span></div>
 <button ref={introRef} className="solid-button" onClick={dismissIntro}>Enter desktop <ArrowUpRight size={18}/></button><footer>LOGO → APPLICATIONS <span>SOUND IS OFF BY DEFAULT</span></footer>
 </section></motion.div>}</AnimatePresence>
 <AnimatePresence>{locked&&<motion.div className="lockscreen" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><Logo/><span className="eyebrow">DCK CORP OS</span><h2>{time.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</h2><p>{time.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</p><button className="solid-button" onClick={()=>setLocked(false)}><LockKeyhole size={16}/> Enter workspace <ArrowUpRight size={16}/></button><small>GUEST SESSION · NO PASSWORD REQUIRED</small></motion.div>}</AnimatePresence>
 <AnimatePresence>{toast&&<motion.div role="status" className="toast" initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} exit={{opacity:0}}><Check size={16}/>{toast}</motion.div>}{boot&&<motion.div className="boot" exit={{opacity:0}} transition={{duration:.4}}><Logo/><span>DCK CORP OS</span><div/><small>INITIALIZING WORKSPACE</small></motion.div>}</AnimatePresence>
 </main>
}
function OSWindow({id,index,max,onFocus,onClose,onMax,children}:{id:WindowId,index:number,max:boolean,onFocus:()=>void,onClose:()=>void,onMax:()=>void,children:React.ReactNode}){const controls=useDragControls();return <motion.section role="dialog" aria-label={id} className={'os-window '+(max?'maximized':'')} drag={!max} dragListener={false} dragControls={controls} dragMomentum={false} dragConstraints={{left:-200,right:200,top:-70,bottom:150}} style={{zIndex:30+index}} initial={{opacity:0,scale:.96,y:15}} animate={{opacity:1,scale:1,y:0,x:max?0:undefined}} exit={{opacity:0,scale:.97}} onPointerDown={onFocus}><div className="window-title" onPointerDown={e=>controls.start(e)} onDoubleClick={onMax}><span><Command size={14}/> DCK / {id==='about'?'PROFILE':id.toUpperCase()}</span><div><button aria-label={'Minimize '+id} onClick={onClose}><Minus size={14}/></button><button aria-label={'Maximize '+id} onClick={onMax}><Maximize2 size={12}/></button><button aria-label={'Close '+id} onClick={onClose}><X size={15}/></button></div></div><div className="window-body">{children}</div><div className="window-status"><span className="session-label"><span className="live-dot"/> LOCAL SESSION</span><span>DCK CORP © 2026</span></div></motion.section>}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
