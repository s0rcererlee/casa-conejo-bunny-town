// Original fingerstyle arrangement with locally stored CC-BY FluidR3 nylon guitar samples. See audio/ATTRIBUTION.md.
export class TownSound {
 constructor(){this.ctx=null;this.playing=false;this.ambient=true;this.volume=.3;this.season='spring';this.notesScheduled=0;this.step=0;this.next=0;this.nextBird=0;this.night=false;this.samples=new Map();this.sampleLoad=null;}
 async toggle(){
  try { if(navigator.audioSession)navigator.audioSession.type='playback'; } catch {}
  if(!this.ctx)this.init();
  if(this.playing&&this.ctx.state==='running'){this.playing=false;clearInterval(this.audioTimer);await this.ctx.suspend();return false;}
  this.playing=false;
  const resumed=this.ctx.resume();
  const pulse=this.ctx.createBufferSource();pulse.buffer=this.ctx.createBuffer(1,1,this.ctx.sampleRate);pulse.connect(this.ctx.destination);pulse.start();
  let timeout;
  try{
   await Promise.race([Promise.all([resumed,this.sampleLoad]),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('音频启动超时，请重试')),15000);})]);
   if(this.ctx.state!=='running')throw new Error('手机音频尚未唤醒，请再次点击');
  }catch(error){this.sampleLoad=this.loadSamples();this.sampleLoad.catch(()=>{});throw error;}finally{clearTimeout(timeout);}
  this.playing=true;this.next=this.ctx.currentTime+.1;this.nextBird=this.next+4;
  clearInterval(this.audioTimer);this.audioTimer=setInterval(()=>this.update(this.season,this.night?22:10),80);
  this.update(this.season,this.night?22:10);return true;
 }
 async loadSamples(){await Promise.all(Array.from({length:37},async(_,i)=>{const midi=i+40,res=await fetch(`./audio/nylon-${midi}.mp3`);if(!res.ok)throw new Error('Guitar sample unavailable: '+midi);const buffer=await this.ctx.decodeAudioData(await res.arrayBuffer());this.samples.set(midi,buffer);}));}
 init(){const AC=window.AudioContext||window.webkitAudioContext;this.ctx=new AC();const c=this.ctx;this.master=c.createGain();this.master.gain.value=this.volume;this.master.connect(c.destination);this.analyser=c.createAnalyser();this.analyser.fftSize=256;this.master.connect(this.analyser);this.music=c.createGain();this.music.gain.value=.7;this.music.connect(this.master);this.nature=c.createGain();this.nature.gain.value=this.ambient?.09:0;this.nature.connect(this.master);
 // Short diffuse room response, with no rhythmic delay repeats.
 const room=c.createConvolver(),ir=c.createBuffer(2,Math.floor(c.sampleRate*.48),c.sampleRate);for(let ch=0;ch<2;ch++){const a=ir.getChannelData(ch);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*Math.exp(-i/(c.sampleRate*.09))*.18;}room.buffer=ir;const wet=c.createGain();wet.gain.value=.10;this.music.connect(room);room.connect(wet);wet.connect(this.master);this.sampleLoad=this.loadSamples();
 const noise=c.createBuffer(1,c.sampleRate*3,c.sampleRate),a=noise.getChannelData(0);let last=0;for(let i=0;i<a.length;i++){last=.97*last+.03*(Math.random()*2-1);a[i]=last*2;}
 const source=c.createBufferSource();source.buffer=noise;source.loop=true;const filter=c.createBiquadFilter();filter.type='lowpass';filter.frequency.value=750;source.connect(filter);filter.connect(this.nature);source.start();this.noiseFilter=filter;const water=c.createBiquadFilter();water.type='bandpass';water.frequency.value=1700;water.Q.value=.7;const flow=c.createGain();flow.gain.value=.35;source.connect(water);water.connect(flow);flow.connect(this.nature);
 }
 setVolume(v){this.volume=v;if(this.ctx)this.master.gain.setTargetAtTime(v,this.ctx.currentTime,.08);}
 setAmbient(on){this.ambient=on;if(this.ctx)this.nature.gain.setTargetAtTime(on?.09:0,this.ctx.currentTime,.3);}
 pluck(midi,time,gain=.32){const c=this.ctx,buffer=this.samples.get(midi);if(!buffer)return;const src=c.createBufferSource();src.buffer=buffer;const filter=c.createBiquadFilter();filter.type='lowpass';filter.frequency.value=4200;filter.Q.value=.45;const g=c.createGain();g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(gain,time+.009);const duration=Math.min(buffer.duration,3.8);g.gain.setValueAtTime(gain,time+Math.max(.01,duration-.3));g.gain.linearRampToValueAtTime(0,time+duration);src.connect(filter);filter.connect(g);g.connect(this.music);src.start(time);src.stop(time+duration);this.notesScheduled++;}
 bird(t){const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(this.night?2600:1800,t);o.frequency.exponentialRampToValueAtTime(this.night?2400:3400,t+.09);o.frequency.exponentialRampToValueAtTime(1700,t+.24);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.027,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.26);o.connect(g);g.connect(this.nature);o.start(t);o.stop(t+.3);}
 update(season,hour){this.season=season;this.night=hour>=20||hour<6;if(!this.playing||!this.ctx)return;const c=this.ctx,tempo={spring:72,summer:76,autumn:68,winter:62}[season],beat=60/tempo/2;
 // Am / Dm / G / C / F / Dm / E7 / Am, with alternating bass and space between phrases.
 const chords=[[45,52,57,60,64],[50,57,62,65,69],[43,50,55,59,62],[48,55,60,64,67],[41,48,53,57,60],[50,57,62,65,69],[40,47,52,56,62],[45,52,57,60,64]];
 const melody=[[64,60],[65,62],[62,59],[64,67],[65,64],[62,60],[59,56],[60,null]];
 if(this.next<c.currentTime-.25)this.next=c.currentTime+.05;
 while(this.next<c.currentTime+.18){const bar=Math.floor(this.step/6)%8,ch=chords[bar],k=this.step%6;const melodyNote=k===0?melody[bar][0]:k===4?melody[bar][1]:null;const accompaniment=ch[[0,2,3,1,4,3][k]];const t=this.next+(k===0?0:Math.random()*.014);if(accompaniment!==melodyNote)this.pluck(accompaniment,t,(k===0||k===3?.40:.24)*(this.night?.85:1));if(melodyNote!==null)this.pluck(melodyNote,t+.018,.34);this.step++;this.next+=beat*(k===5?1.07:1);}
 if(this.ambient&&c.currentTime>this.nextBird){if(season!=='winter')this.bird(c.currentTime+.03);this.nextBird=c.currentTime+8+Math.random()*10;}
 this.noiseFilter.frequency.setTargetAtTime(season==='winter'?420:season==='summer'?950:700,c.currentTime,.3);
 }
 get state(){return {playing:this.playing,context:this.ctx?.state??'uninitialized',season:this.season,volume:this.volume,ambient:this.ambient,notesScheduled:this.notesScheduled,samplesLoaded:this.samples.size,instrument:'sampled nylon guitar'};}
}
