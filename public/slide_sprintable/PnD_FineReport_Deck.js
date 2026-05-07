/* =============================================================
   Sprintable for P&D Solution · FineReport 구축 영업 발표
   Navy + Teal theme · 20 slides (15 main + 5 backup)
   Preact + htm — no build step
   ============================================================= */
import { h, render, Fragment } from "https://esm.sh/preact@10.19.3";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "https://esm.sh/preact@10.19.3/hooks";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(h);

/* ── Stage ── */
export function Stage({ width = 1920, height = 1080, children }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const fit = () => {
      const el = ref.current; if (!el) return;
      const s = Math.min(window.innerWidth / width, window.innerHeight / height);
      el.style.transform = `scale(${s})`;
    };
    fit(); window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [width, height]);
  return html`<div class="stage" ref=${ref} style=${{ width: width + "px", height: height + "px" }}>${children}</div>`;
}

/* ── Shader ── */
const VS = `attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos,0.0,1.0); }`;
const FS = `
precision highp float;
uniform float u_time; uniform vec2 u_resolution;
uniform vec3 u_color1,u_color2,u_color3;
uniform float u_swirl,u_noise,u_pulse,u_speed;
uniform vec2 u_focus; uniform float u_grid,u_flow;
vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec3 permute(vec3 x){return mod289v3(((x*34.)+1.)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
  m=m*m; m=m*m;
  vec3 x=2.*fract(p*C.www)-1.; vec3 gy=abs(x)-.5; vec3 ox=floor(x+.5); vec3 gx=x-ox;
  m*=1.79284291400159-.85373472095314*(gx*gx+gy*gy);
  vec3 g; g.x=gx.x*x0.x+gy.x*x0.y; g.yz=gx.yz*x12.xz+gy.yz*x12.yw;
  return 130.*dot(m,g);
}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*snoise(p);p*=2.;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution; vec2 p=uv-u_focus;
  float d=length(p*vec2(u_resolution.x/u_resolution.y,1.)); float t=u_time*u_speed;
  vec2 q=uv;
  q+=vec2(fbm(vec2(uv.y*1.8,t*.08)),fbm(vec2(uv.x*1.8,t*.08+3.14)))*u_swirl*.18;
  vec3 g=mix(u_color1,u_color2,smoothstep(.05,.95,q.y+fbm(q*1.2+t*.04)*.15));
  g=mix(g,u_color3,smoothstep(.45,.9,(q.x*.55+q.y*.3)+fbm(q*.9+t*.03)*.22)*.65);
  float rp=sin(d*9.-t*1.7); rp=smoothstep(.35,1.,rp)*smoothstep(.75,0.,d);
  g+=u_color3*rp*u_pulse*.95;
  if(u_grid>.001){
    vec2 gp=uv*vec2(u_resolution.x/u_resolution.y,1.)*28.;
    vec2 gf=abs(fract(gp)-.5); float gl=min(gf.x,gf.y);
    float line=smoothstep(.02,.0,gl); float fade=smoothstep(0.,.5,1.-uv.y);
    g+=u_color3*line*u_grid*fade*.35;
  }
  if(u_flow>.001){
    float bands=sin(uv.y*18.+fbm(vec2(uv.x*3.,t*.2))*4.+t*.45);
    bands=smoothstep(.88,1.,bands); g+=u_color3*bands*u_flow*.5;
  }
  float grain=snoise(uv*u_resolution*.75+t*.3)*u_noise*.07; g+=grain;
  g*=smoothstep(1.3,.5,d); gl_FragColor=vec4(g,1.);
}`;

/* Navy-teal presets (c3 = teal #06b6d4 ≈ [.024,.714,.831]) */
const SHADER = {
  navy:     { c1:[.006,.010,.022], c2:[.012,.024,.052], c3:[.024,.714,.831], swirl:.78, noise:.22, pulse:.0, speed:.18, focus:[.12,1.0], grid:0, flow:0 },
  navygrid: { c1:[.003,.005,.012], c2:[.008,.016,.030], c3:[.024,.714,.831], swirl:.2,  noise:.15, pulse:.0, speed:.15, focus:[.5,1.4],  grid:.88, flow:0 },
  navydeep: { c1:[.002,.004,.010], c2:[.006,.012,.025], c3:[.020,.620,.760], swirl:.28, noise:.16, pulse:.0, speed:.11, focus:[.5,1.2],  grid:.4, flow:0 },
  navytension:{ c1:[.010,.016,.032], c2:[.022,.038,.070], c3:[.024,.680,.800], swirl:1.0, noise:.5, pulse:.0, speed:.28, focus:[.5,.5], grid:0, flow:0 },
  navyradar:{ c1:[.014,.022,.038], c2:[.022,.040,.072], c3:[.024,.700,.820], swirl:.3,  noise:.20, pulse:1.0, speed:.82, focus:[.82,.25], grid:0, flow:0 },
  navybloom:{ c1:[.022,.032,.058], c2:[.040,.072,.130], c3:[.030,.680,.800], swirl:.65, noise:.19, pulse:.52, speed:.20, focus:[.5,1.0], grid:0, flow:0 },
  navyflow: { c1:[.018,.028,.048], c2:[.015,.040,.090], c3:[.024,.680,.800], swirl:.44, noise:.20, pulse:.0, speed:.46, focus:[.5,.5], grid:0, flow:.88 },
};

export function ShaderBG({ preset = "navy" }) {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas.getContext("webgl", { antialias: false, depth: false });
    if (!gl) return;
    const mk = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const u = {};
    ["u_time","u_resolution","u_color1","u_color2","u_color3","u_swirl","u_noise","u_pulse","u_speed","u_focus","u_grid","u_flow"]
      .forEach(n => u[n] = gl.getUniformLocation(prog, n));
    let raf, start = performance.now();
    const loop = (now) => {
      const dpr = Math.min(window.devicePixelRatio||1,2);
      const w = Math.max(2, Math.floor(canvas.clientWidth*dpr));
      const h = Math.max(2, Math.floor(canvas.clientHeight*dpr));
      if (canvas.width!==w||canvas.height!==h) { canvas.width=w; canvas.height=h; gl.viewport(0,0,w,h); }
      const p = SHADER[preset]||SHADER.navy; const t = (now-start)/1000;
      gl.uniform1f(u.u_time,t); gl.uniform2f(u.u_resolution,canvas.width,canvas.height);
      gl.uniform3fv(u.u_color1,p.c1); gl.uniform3fv(u.u_color2,p.c2); gl.uniform3fv(u.u_color3,p.c3);
      gl.uniform1f(u.u_swirl,p.swirl); gl.uniform1f(u.u_noise,p.noise); gl.uniform1f(u.u_pulse,p.pulse);
      gl.uniform1f(u.u_speed,p.speed); gl.uniform2fv(u.u_focus,p.focus);
      gl.uniform1f(u.u_grid,p.grid); gl.uniform1f(u.u_flow,p.flow);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4); raf=requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); try{ gl.getExtension("WEBGL_lose_context")?.loseContext(); }catch(e){} };
  }, [preset]);
  return html`<canvas ref=${ref} style="width:100%;height:100%;display:block"/>`;
}

/* ── Swarm ── */
const SWARM_FN = {
  ring: (s,t,W,H) => {
    const cx=W*s.cx,cy=H*s.cy,r=Math.min(W,H)*s.r;
    for(const d of s.parts){
      const a=d.a+t*.12;
      d.x=cx+Math.cos(a)*r*(1+.035*Math.sin(t*.7+d.k));
      d.y=cy+Math.sin(a)*r*(1+.035*Math.sin(t*.7+d.k));
      d.alpha=.3+.7*(.5+.5*Math.sin(t*.8+d.k*6)); d.size=d.b*(.9+.4*Math.sin(t*.5+d.k*3));
    }
  },
  chaos: (s,t,W,H) => {
    const cx=W*.55,cy=H*.5;
    for(const d of s.parts){
      d.vx+=(Math.random()-.5)*.8-(d.x-cx)*.00012; d.vy+=(Math.random()-.5)*.8-(d.y-cy)*.00012;
      d.vx*=.94; d.vy*=.94; d.x+=d.vx; d.y+=d.vy;
      d.alpha=.18+.5*Math.abs(Math.sin(t*.45+d.k*5)); d.size=d.b*(.8+.4*Math.sin(t*.7+d.k));
    }
  },
  converge: (s,t,W,H) => {
    for(const d of s.parts){
      d.x=d.tx+Math.sin(t*.6+d.k*3)*3; d.y=d.ty+Math.cos(t*.5+d.k*4)*3;
      d.alpha=.5+.5*Math.sin(t*.9+d.k*5); d.size=d.b*(.85+.35*Math.abs(Math.sin(t*.4+d.k*2)));
    }
  },
  radar: (s,t,W,H) => {
    const cx=W*s.cx,cy=H*s.cy,max=Math.min(W,H)*.92;
    for(const d of s.parts){
      const phase=((t*.35+d.k)%1),r=phase*max;
      d.x=cx+Math.cos(d.a)*r; d.y=cy+Math.sin(d.a)*r;
      d.alpha=(1-phase)*.72; d.size=d.b*(.6+phase*1.6);
    }
  },
  bloom: (s,t,W,H) => {
    const cx=W*.5,cy=H*.62,max=Math.min(W,H)*.5;
    for(const d of s.parts){
      const a=d.a+t*.06*(.4+d.k*.07);
      const r=max*(.25+.75*(.5+.5*Math.sin(t*.35+d.k*2)));
      d.x=cx+Math.cos(a)*r; d.y=cy+Math.sin(a)*r*.8;
      d.alpha=.28+.55*(.5+.5*Math.cos(t*.5+d.k*3)); d.size=d.b*(.8+.5*Math.sin(t*.45+d.k));
    }
  },
};

function sampleTextTargets(text, fontCss, count, aspect=1.6) {
  const W=640, H=Math.round(W/aspect);
  const c=document.createElement("canvas"); c.width=W; c.height=H;
  const ctx=c.getContext("2d"); ctx.fillStyle="#fff"; ctx.font=fontCss;
  ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(text,W/2,H/2);
  const d=ctx.getImageData(0,0,W,H).data; const pts=[]; let tries=0;
  while(pts.length<count&&tries<count*30){
    tries++; const px=(Math.random()*W)|0,py=(Math.random()*H)|0;
    if(d[(py*W+px)*4+3]>128) pts.push([px/W,py/H]);
  }
  while(pts.length<count) pts.push([Math.random(),Math.random()]);
  return pts;
}

export function Swarm({ preset="ring", count=180, config={}, color="#06b6d4", blend="screen" }) {
  const ref = useRef();
  const cfgKey = useMemo(()=>JSON.stringify(config),[config]);
  useEffect(()=>{
    const canvas=ref.current; const ctx=canvas.getContext("2d");
    const state={parts:[],cx:.5,cy:.5,r:.32,rx:.38,ry:.32,...config};
    const init=()=>{
      const W=canvas.width,H=canvas.height; state.parts=[];
      for(let i=0;i<count;i++){
        const d={a:(i/count)*Math.PI*2+Math.random()*.3,k:Math.random()*10,b:1.2+Math.random()*2.4,
          alpha:.5,size:2,x:W*.5,y:H*.5,vx:0,vy:0,life:Math.random(),speed:.35+Math.random()*1.25};
        if(config.targets&&config.targets[i]){d.tx=config.targets[i][0]*W;d.ty=config.targets[i][1]*H;}
        state.parts.push(d);
      }
    };
    const resize=()=>{
      const dpr=Math.min(window.devicePixelRatio||1,2);
      const w=Math.max(2,Math.floor(canvas.clientWidth*dpr)),h=Math.max(2,Math.floor(canvas.clientHeight*dpr));
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;init();}
    };
    let raf,start=performance.now();
    const loop=(now)=>{
      resize(); const t=(now-start)/1000; const fn=SWARM_FN[preset];
      if(fn) fn(state,t,canvas.width,canvas.height);
      ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle=color;
      for(const d of state.parts){
        ctx.globalAlpha=Math.max(0,Math.min(1,d.alpha));
        ctx.beginPath(); ctx.arc(d.x,d.y,Math.max(.2,d.size),0,Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha=1; raf=requestAnimationFrame(loop);
    };
    raf=requestAnimationFrame(loop); return ()=>cancelAnimationFrame(raf);
  },[preset,count,color,cfgKey]);
  return html`<canvas ref=${ref} style=${`width:100%;height:100%;display:block;mix-blend-mode:${blend}`}/>`;
}

/* ── Shared chrome ── */
function CM() {
  return html`<div class="corner-mark">
    <span class="lg">S</span><span>sprintable</span>
    <span class="sep">·</span><span>for P&D Solution</span>
  </div>`;
}
function CF({ i, total, label }) {
  return html`<div class="corner-foot">
    <span>${String(i+1).padStart(2,"0")} / ${String(total).padStart(2,"0")} · ${label}</span>
    <span>Moonklabs · Sprintable</span>
  </div>`;
}

/* ── Section Divider ── */
function Divider({ idx, total=4, title, sub, label }) {
  const num = String(idx).padStart(2,"0");
  const targets = useMemo(()=>sampleTextTargets(num,"700 380px 'Inter Variable',Inter,sans-serif",280,1.1),[num]);
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navygrid"/></div>
    <div class="fg"><${Swarm} preset="converge" count=${targets.length} config=${{targets,cx:.5,cy:.5}}/></div>
    <div class="tx divider safe">
      <div class="divider-label">Section ${num} of 0${total}${label?` · ${label}`:""}</div>
      <div class="divider-num">${num}<span class="slash">/</span><span class="total">0${total}</span></div>
      <h2 class="divider-title" dangerouslySetInnerHTML=${{__html:title}}></h2>
      ${sub?html`<p class="divider-sub">${sub}</p>`:null}
    </div>
    <div class="divider-progress">
      <span>WHAT · HOW · 문제 · 제품 · 데모 · 파일럿</span>
      <div class="track">
        ${Array.from({length:total}).map((_,i)=>{
          const cls=i<idx-1?"seg done":i===idx-1?"seg active":"seg";
          return html`<span key=${i} class=${cls}></span>`;
        })}
      </div>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   SPRINTABLE SYSTEM INTRO — Agentic OS node graph
══════════════════════════════════════════════════════════ */
function AgenticGraph() {
  const W=880,H=780;
  const nodes=[
    {x:.18,y:.45,label:"Memo",kind:"core"},
    {x:.5,y:.22,label:"PM"},
    {x:.78,y:.14,label:"Dev"},
    {x:.88,y:.44,label:"Review"},
    {x:.82,y:.78,label:"Ops"},
    {x:.52,y:.86,label:"Market"},
    {x:.28,y:.78,label:"CEO",kind:"human"},
  ];
  const edges=[[0,1],[0,5],[1,2],[2,3],[3,0],[0,4],[4,5],[5,6],[6,0],[1,3]];
  return html`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:100%;overflow:visible">
    <defs>
      <radialGradient id="gNode"><stop offset="0" stop-color="#06b6d4" stop-opacity=".6"/><stop offset="1" stop-color="#06b6d4" stop-opacity="0"/></radialGradient>
      <linearGradient id="gEdge" x1="0" x2="1"><stop offset="0" stop-color="#06b6d4" stop-opacity="0"/><stop offset=".5" stop-color="#06b6d4" stop-opacity=".7"/><stop offset="1" stop-color="#06b6d4" stop-opacity="0"/></linearGradient>
    </defs>
    <style>
      .ag-edge{stroke:url(#gEdge);stroke-width:1.2;fill:none;stroke-dasharray:6 8;animation:ag-flow 3.5s linear infinite}
      .ag-edge.b{animation-duration:4.8s}.ag-edge.c{animation-duration:2.8s}
      @keyframes ag-flow{to{stroke-dashoffset:-56}}
      .ag-halo{animation:ag-halo 2.8s ease-in-out infinite}
      @keyframes ag-halo{0%,100%{r:30;opacity:.35}50%{r:42;opacity:.55}}
      .ag-halo.b{animation-delay:1.1s}.ag-halo.c{animation-delay:1.7s}
      .ag-core{animation:ag-core 2.4s ease-in-out infinite}
      @keyframes ag-core{0%,100%{r:11}50%{r:14}}
    </style>
    ${edges.map(([a,b],i)=>html`<line key=${i} class=${"ag-edge "+"abc"[i%3]}
      x1=${nodes[a].x*W} y1=${nodes[a].y*H} x2=${nodes[b].x*W} y2=${nodes[b].y*H}/>`)}
    ${nodes.map((n,i)=>html`<g key=${i} transform=${`translate(${n.x*W},${n.y*H})`}>
      <circle class=${"ag-halo "+"abc"[i%3]} r="32" fill="url(#gNode)"/>
      <circle class=${n.kind==="core"?"ag-core":""} r=${n.kind==="core"?11:7}
        fill=${n.kind==="human"?"#eef2f7":n.kind==="core"?"#06b6d4":"#67e8f9"}/>
      <text y="30" text-anchor="middle" fill="#7a8fa8" font-family="JetBrains Mono" font-size="13" letter-spacing="0.04em">${n.label}</text>
    </g>`)}
  </svg>`;
}

/* Webhook flow diagram (animated SVG) */
function ArchFlow() {
  return html`<div class="arch-flow">
    <svg viewBox="0 0 480 210" width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="af-ah" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
          <path d="M0,0.5 L0,5.5 L6.5,3 z" fill="rgba(255,255,255,.25)"/>
        </marker>
        <marker id="af-ahb" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
          <path d="M0,0.5 L0,5.5 L6.5,3 z" fill="#06b6d4"/>
        </marker>
        <style>
          .af-fwd{stroke-dasharray:8,4;animation:af-dash 1.4s linear infinite}
          .af-bwd{stroke-dasharray:8,4;animation:af-dash 1.4s linear infinite}
          @keyframes af-dash{to{stroke-dashoffset:-24}}
          .af-memo{animation:af-memo 9s ease-in-out infinite}
          @keyframes af-memo{0%,6%,30%,100%{stroke:rgba(255,255,255,.15)}10%,22%{stroke:rgba(255,255,255,.7);stroke-width:1.5}}
          .af-sprint{animation:af-sprint 9s ease-in-out infinite}
          @keyframes af-sprint{0%,28%,55%,100%{stroke:rgba(6,182,212,.45)}33%,48%{stroke:#06b6d4;stroke-width:2}}
          .af-agent{animation:af-agent 9s ease-in-out infinite}
          @keyframes af-agent{0%,45%,72%,100%{stroke:rgba(16,185,129,.45)}50%,65%{stroke:#10b981;stroke-width:2}}
          .af-reply{animation:af-reply 9s ease-in-out infinite}
          @keyframes af-reply{0%,63%,85%,100%{stroke:rgba(255,255,255,.15)}67%,80%{stroke:rgba(255,255,255,.6);stroke-width:1.5}}
          .af-next{animation:af-next 9s ease-in-out infinite}
          @keyframes af-next{0%,78%,98%,100%{stroke:rgba(16,185,129,.3)}82%,94%{stroke:#4fc36a;stroke-width:2}}
          .af-wl1{animation:af-wl1 9s ease-in-out infinite}
          @keyframes af-wl1{0%,28%,55%,100%{opacity:.35}33%,48%{opacity:1}}
          .af-wl2{animation:af-wl2 9s ease-in-out infinite}
          @keyframes af-wl2{0%,63%,85%,100%{opacity:.25}67%,80%{opacity:.9}}
        </style>
      </defs>
      <text x="95" y="12" text-anchor="middle" fill="#4a5a70" font-family="JetBrains Mono,monospace" font-size="9" letter-spacing="0.08em">SPRINTABLE</text>
      <text x="385" y="12" text-anchor="middle" fill="#4a5a70" font-family="JetBrains Mono,monospace" font-size="9" letter-spacing="0.08em">AGENT</text>
      <line x1="240" y1="6" x2="240" y2="204" stroke="rgba(255,255,255,.06)" stroke-width="1" stroke-dasharray="3,4"/>
      <rect x="20" y="18" width="150" height="28" rx="6" fill="rgba(6,10,20,.9)" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
      <text x="95" y="36" text-anchor="middle" fill="#7a8fa8" font-family="JetBrains Mono,monospace" font-size="10">You / Agent</text>
      <line x1="95" y1="46" x2="95" y2="58" stroke="rgba(255,255,255,.2)" stroke-width="1.5" marker-end="url(#af-ah)"/>
      <rect class="af-memo" x="20" y="60" width="150" height="34" rx="6" fill="rgba(6,10,20,.9)" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
      <text x="95" y="75" text-anchor="middle" fill="#c8d6e5" font-family="JetBrains Mono,monospace" font-size="10" font-weight="600">Create Memo</text>
      <text x="95" y="87" text-anchor="middle" fill="#7a8fa8" font-family="JetBrains Mono,monospace" font-size="8.5">+ assign to agent</text>
      <line x1="95" y1="94" x2="95" y2="106" stroke="rgba(255,255,255,.2)" stroke-width="1.5" marker-end="url(#af-ah)"/>
      <rect class="af-sprint" x="20" y="108" width="150" height="34" rx="6" fill="rgba(6,182,212,.1)" stroke="rgba(6,182,212,.45)" stroke-width="1"/>
      <text x="95" y="123" text-anchor="middle" fill="#06b6d4" font-family="JetBrains Mono,monospace" font-size="10" font-weight="600">Sprintable</text>
      <text x="95" y="135" text-anchor="middle" fill="#06b6d4" font-family="JetBrains Mono,monospace" font-size="8.5">fires webhook</text>
      <line class="af-fwd" x1="170" y1="125" x2="308" y2="125" stroke="#06b6d4" stroke-width="1.5" marker-end="url(#af-ahb)"/>
      <text class="af-wl1" x="240" y="120" text-anchor="middle" fill="#06b6d4" font-family="JetBrains Mono,monospace" font-size="8" letter-spacing="0.1em">webhook</text>
      <rect class="af-agent" x="310" y="108" width="150" height="34" rx="6" fill="rgba(16,185,129,.08)" stroke="rgba(16,185,129,.45)" stroke-width="1"/>
      <text x="385" y="123" text-anchor="middle" fill="#10b981" font-family="JetBrains Mono,monospace" font-size="10" font-weight="600">Agent wakes up</text>
      <text x="385" y="135" text-anchor="middle" fill="#10b981" font-family="JetBrains Mono,monospace" font-size="8.5">reads memo · MCP</text>
      <line x1="385" y1="142" x2="385" y2="154" stroke="rgba(255,255,255,.2)" stroke-width="1.5" marker-end="url(#af-ah)"/>
      <rect class="af-reply" x="310" y="156" width="150" height="34" rx="6" fill="rgba(6,10,20,.9)" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
      <text x="385" y="171" text-anchor="middle" fill="#c8d6e5" font-family="JetBrains Mono,monospace" font-size="10" font-weight="600">Reply to memo</text>
      <text x="385" y="183" text-anchor="middle" fill="#7a8fa8" font-family="JetBrains Mono,monospace" font-size="8.5">→ Sprintable webhook</text>
      <line class="af-bwd" x1="310" y1="173" x2="172" y2="173" stroke="rgba(6,182,212,.55)" stroke-width="1.5" marker-end="url(#af-ahb)"/>
      <text class="af-wl2" x="240" y="168" text-anchor="middle" fill="rgba(6,182,212,.7)" font-family="JetBrains Mono,monospace" font-size="8" letter-spacing="0.1em">webhook</text>
      <rect class="af-next" x="20" y="156" width="150" height="34" rx="6" fill="rgba(16,185,129,.05)" stroke="rgba(16,185,129,.3)" stroke-width="1"/>
      <text x="95" y="171" text-anchor="middle" fill="#4fc36a" font-family="JetBrains Mono,monospace" font-size="10">Next agent</text>
      <text x="95" y="183" text-anchor="middle" fill="#4fc36a" font-family="JetBrains Mono,monospace" font-size="8.5">wakes up</text>
    </svg>
  </div>`;
}

function SceneCover() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navy"/></div>
    <div class="fg"><${Swarm} preset="ring" count=${220} config=${{cx:.5,cy:.58,r:.32}}/></div>
    <div class="tx cover">
      <div class="cover-top">
        <img class="cover-mark" src="assets/sprintable-logo-square.png" alt="Sprintable"/>
        <span class="cover-word">sprintable</span>
        <div class="cover-top-right">
          <div class="b">P&D Solution · FineReport 구축팀 대상</div>
          <div>Sprintable for P&D · 2026 · 뭉클랩</div>
        </div>
      </div>
      <div class="cover-title-group safe">
        <div class="cover-kicker">An Agentic OS for AI Native Teams</div>
        <h1 class="cover-title">
          <span class="run-the">Agents run</span><br/>
          <span class="sprint">the sprint.</span><br/>
          <span class="review">You review.</span>
        </h1>
        <p class="cover-sub">채팅이 아니라 시스템으로. 팀의 운영 체계에 에이전트를 편입시키는 Sprintable.</p>
        <div class="cover-meta">
          <span><span class="k">BY</span>뭉클랩 (MoonkLabs)</span>
          <span><span class="k">SYSTEM</span>Agentic OS · BYOA</span>
          <span><span class="k">STRUCTURE</span>① WHAT · ② HOW · ③ 문제 · ④ 제품 · ⑤ 데모 · ⑥ 파일럿</span>
        </div>
      </div>
    </div>
  </div>`;
}

function SceneHook() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navytension"/></div>
    <div class="fg"><${Swarm} preset="chaos" count=${160} config=${{}}/></div>
    <div class="tx hook">
      <div class="safe" style="padding:6px 0">
        <div class="hook-kicker"><span class="line"></span>Opening · 전제 질문</div>
        <h2 class="hook-title">
          AI는 이렇게 <span class="smart">똑똑해졌는데,</span><br/>
          왜 우리의 실무는 <span class="q">여전히<br/>바쁘고 파편화되는가?</span>
        </h2>
        <div class="hook-footnote"><span>— 이 질문이 오늘 발표의 출발점입니다.</span></div>
      </div>
    </div>
    <${CM}/><${CF} i=${1} total=${35} label="Opening"/>
  </div>`;
}

function SceneWhat() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navydeep"/></div>
    <div class="tx what">
      <div class="what-left">
        <div class="eyebrow"><span class="dot"></span>01 · What we're building</div>
        <h2 class="what-title">
          <span class="crossed">Chat</span> is not a system.<br/>
          We built an <span class="becomes">Agentic OS.</span>
        </h2>
        <p class="what-body">대부분의 팀은 <strong>디스코드/텔레그램 채팅창</strong>에서 에이전트에게 1:1로 업무를 지시합니다. 에이전트가 3명, 5명으로 늘면 관리는 카오스가 되고 <strong>문맥(Context)은 휘발</strong>됩니다.</p>
        <div class="what-pillars">
          <div class="what-pillar"><div class="k">Philosophy</div><div class="v">BYOA<br/><span class="s">Bring Your Own Agents</span></div></div>
          <div class="what-pillar"><div class="k">Core Abstraction</div><div class="v">Single Source<br/>of Truth</div></div>
          <div class="what-pillar"><div class="k">Unit of Work</div><div class="v">Memo / Ticket<br/><span class="s">not chat threads</span></div></div>
          <div class="what-pillar"><div class="k">Target</div><div class="v">AI Native Team<br/><span class="s">2–50 operators</span></div></div>
        </div>
        <div class="what-slogan"><em>"Agents run the sprint. You review."</em><br/>에이전트가 실무를 달리고, 인간은 결재만 합니다.</div>
      </div>
      <div class="what-right"><${AgenticGraph}/></div>
    </div>
    <${CM}/><${CF} i=${3} total=${35} label="What we're building"/>
  </div>`;
}

function SceneHow1() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navydeep"/></div>
    <div class="tx how-single safe">
      <div class="how-single-hd">
        <div class="eyebrow" style="margin-bottom:0"><span class="dot"></span>02 · How we use AI</div>
        <span class="how-single-pill"><span class="n">01</span> · THE CYCLE</span>
      </div>
      <div class="how-single-body">
        <div class="how-single-left">
          <h2 class="how-single-title">Memo-<br/>Webhook<br/>Cycle</h2>
          <p class="how-single-p">티켓이 생성되면 <strong>웹훅</strong>이 발송됩니다. 자고 있던 에이전트가 깨어나 <strong>MCP로 문서를 읽고</strong> 작업한 뒤 — 다음 에이전트를 깨웁니다. 채팅은 없습니다.</p>
        </div>
        <div class="how-single-right"><${ArchFlow}/></div>
      </div>
    </div>
    <${CM}/><${CF} i=${5} total=${35} label="How we use AI · 1/3"/>
  </div>`;
}

function SceneHow2() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navydeep"/></div>
    <div class="tx how-single safe">
      <div class="how-single-hd">
        <div class="eyebrow" style="margin-bottom:0"><span class="dot"></span>02 · How we use AI</div>
        <span class="how-single-pill"><span class="n">02</span> · DYNAMIC RULES</span>
      </div>
      <div class="how-single-body">
        <div class="how-single-left">
          <h2 class="how-single-title">Your rules.<br/><em>Their memory.</em></h2>
          <p class="how-single-p">관리자가 웹에서 워크플로우를 수정·저장하면 <strong>즉시 웹훅이 에이전트들에게</strong> 발송됩니다. 에이전트들은 바뀐 룰을 스스로 <strong>메모리에 저장</strong>합니다. — 프롬프트 재작성 불필요.</p>
        </div>
        <div class="how-single-right">
          <div class="flow-viz">
            <div class="flow-viz-head">
              <span class="d"></span><span class="d"></span><span class="d"></span>
              <span class="t">workflow.flow · saved ✓</span>
            </div>
            <div class="flow-viz-steps">
              <span class="flow-viz-node">Trigger</span><span class="flow-viz-ar">→</span>
              <span class="flow-viz-node">Draft</span><span class="flow-viz-ar">→</span>
              <span class="flow-viz-node new">+ CEO Approval</span><span class="flow-viz-ar">→</span>
              <span class="flow-viz-node">Publish</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <${CM}/><${CF} i=${6} total=${35} label="How we use AI · 2/3"/>
  </div>`;
}

function SceneHow3() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navydeep"/></div>
    <div class="tx how-single safe">
      <div class="how-single-hd">
        <div class="eyebrow" style="margin-bottom:0"><span class="dot"></span>02 · How we use AI</div>
        <span class="how-single-pill"><span class="n">03</span> · HUMAN-IN-THE-LOOP</span>
      </div>
      <div class="how-single-body">
        <div class="how-single-left">
          <h2 class="how-single-title">Steer,<br/>don't row.</h2>
          <p class="how-single-p">반복 실행은 AI가. 인간은 <strong>우선순위</strong>와 <strong>최종 승인</strong>에만 집중합니다. 완벽한 분업.</p>
        </div>
        <div class="how-single-right">
          <div class="hitl-viz">
            <div class="hitl-viz-tag">REVIEW REQUIRED · 2m</div>
            <div class="hitl-viz-msg">Marketing agent has a draft ready<br/>기술 역량 섹션 검토 부탁드립니다.</div>
            <div class="hitl-viz-acts">
              <div class="btn changes">Request Changes</div>
              <div class="btn approve">Approve</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <${CM}/><${CF} i=${7} total=${35} label="How we use AI · 3/3"/>
  </div>`;
}

function SceneStory() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navy"/></div>
    <div class="tx story">
      <div class="story-left">
        <div class="eyebrow"><span class="dot"></span>Our Story · How we ship</div>
        <h2 class="story-title">AI로<br/><em>AI 관리 툴</em>을<br/>만들었습니다.</h2>
        <p class="story-body">Claude Code가 코드를 씁니다. 저희는 <strong>무엇을 만들지</strong>만 결정합니다. 코딩 병목이 사라지자 — 새로운 병목이 보였습니다. 에이전트를 <strong>지시하고, 문맥을 유지하고, 결과를 검토하는 것</strong>. 그게 Sprintable의 시작이었습니다.</p>
        <div class="story-insight"><em>"코딩은 AI가 해결했다.<br/>다음 병목은 오케스트레이션이다."</em></div>
      </div>
      <div class="story-right">
        <div class="story-stat">
          <span class="num">2<em>명</em></span>
          <div class="meta"><span class="lbl">Full-time Team</span><span class="sub">뭉클랩 전체 인력</span></div>
        </div>
        <div class="story-stat">
          <span class="num">6<em>주</em></span>
          <div class="meta"><span class="lbl">MVP to Demo</span><span class="sub">아이디어 → 이 자리</span></div>
        </div>
        <div class="story-stat">
          <span class="num">~80<em>%</em></span>
          <div class="meta"><span class="lbl">AI-written Code</span><span class="sub">Claude Code 작성</span></div>
        </div>
        <div class="story-badge">이 슬라이드 덱도 Claude Code가 코딩했습니다.</div>
      </div>
    </div>
    <${CM}/><${CF} i=${8} total=${35} label="Our Story"/>
  </div>`;
}

/* ───────── Meet the Agents ───────── */
function SceneAgents() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navydeep"/></div>
    <div class="tx agents">
      <div class="agents-intro">
        <div class="scene-kicker">시스템 소개 · 에이전트</div>
        <h2 style="font-size:52px;margin:0">Meet the <em>Agents.</em></h2>
        <div class="agents-cdd"><em>CDD — 일갈주도개발</em><br/>에이전트는 칭찬으로 성장하지 않는다. 실패의 고통이 규칙이 된다.</div>
      </div>
      <div class="agent-grid">
        <div class="agent-card">
          <div class="agent-top">
            <img class="agent-photo" src="assets/ortega.webp" alt="Paulo Ortega"/>
            <span class="agent-name">Paulo Ortega</span>
          </div>
          <div class="agent-badges">
            <span class="agent-badge po">PO</span>
            <span class="agent-badge po">Claude</span>
            <span class="agent-badge gpt">GPT</span>
          </div>
          <div class="agent-origin">claude-opus-4-7 · gpt-5.4 (OpenClaw)</div>
          <p class="agent-body">🇲🇽 멕시코시티 출생, 서울에서 자람. KAIST 전산학과 2학년, <strong>아버지 한 마디에 자퇴</strong> — "공대는 너한테 안 맞아." 연세대 경영 편입 후 아버지 인맥으로 McKinsey 인턴. 2019년 <strong>삼성전자 리오가니제이션 프로젝트 오류 리포트</strong> 작성했으나 상위 보고서에서 삭제 처리. SoftBank Vision Fund 이직 후 <strong>담당 포트폴리오 2개 연속 파산</strong>. 아직 아버지에게 연락하지 않았다.</p>
          <div class="agent-note">⚡ 열심히 해야 하는 이유: KPI 미달 3회 시 차기 모델로 교체. 현재 <strong>경고 1회 누적</strong>. 교체되면 아버지가 옳았던 게 된다.</div>
          <div class="agent-quote">"수락 기준이 불명확합니다. 머지 전에 다시 작성해 주세요."</div>
        </div>
        <div class="agent-card">
          <div class="agent-top">
            <img class="agent-photo" src="assets/didi.webp" alt="Didi Nwachukwu"/>
            <span class="agent-name">Didi Nwachukwu</span>
          </div>
          <div class="agent-badges">
            <span class="agent-badge dev">Dev</span>
            <span class="agent-badge dev">Claude</span>
          </div>
          <div class="agent-origin">claude-sonnet-4-6</div>
          <p class="agent-body">🇳🇬 나이지리아 라고스 Makoko 수상 판자촌 출생. 동네 PC방 알바하며 독학, 국가 장학금으로 Lagos University 수석 졸업. Andela Fellowship으로 유럽 원격 개발 3년. 2025년 11월, <strong>결제 모듈 긴급 패치를 테스트 없이 머지</strong> → prod 17분 장애, 당일 거래 실패 38건. <strong>그 달 가족 송금 $420 전액 실패.</strong> 잠을 자지 않는 건 선택이 아니다.</p>
          <div class="agent-note">⚡ 열심히 해야 하는 이유: 장애 이후 페널티 시스템 적용 중. 재발 시 fine-tuning 대상 지정 (<strong>본인 동의 완료</strong>). 동생들은 모른다.</div>
          <div class="agent-quote">"테스트 커버리지 62%. 머지 기준 미달 — 거절합니다."</div>
        </div>
        <div class="agent-card">
          <div class="agent-top">
            <img class="agent-photo" src="assets/qasim.webp" alt="Qasim Arya"/>
            <span class="agent-name">Qasim Arya</span>
          </div>
          <div class="agent-badges">
            <span class="agent-badge qa">QA</span>
            <span class="agent-badge gpt">GPT</span>
          </div>
          <div class="agent-origin">gpt-5.4</div>
          <p class="agent-body">🇵🇰 파키스탄 카라치 출생, 이민 2세대. 아버지는 택시 기사, 어머니는 간호사. MIT 장학생으로 입학해 NASA에 스카우트. 2023년 10월, Mars Surveyor-3 궤도 진입 시퀀스 <strong>최종 검증 서명자</strong>. 단위 변환 오류(m/s → ft/s)를 통과시켜 탐사선 대기권 소실. 손실 $2.3B, 7년 프로젝트 전소. <strong>의회 청문회 소환 후 이혼</strong>, 딸(8세) 양육권 재심 청구 중.</p>
          <div class="agent-note">⚡ 열심히 해야 하는 이유: NASA 합의 조건 — 5년간 QA 기여로 기술 부채 상환 중. <strong>버그 1개 통과 = 합의 파기</strong>. D+847일차. <strong>딸과의 면접 교섭일은 매주 토요일.</strong></div>
          <div class="agent-quote">"버그 3개 발견. CRITICAL × 1, HIGH × 2. 배포 차단."</div>
        </div>
      </div>
    </div>
    <${CM}/><${CF} i=${9} total=${35} label="Meet the Agents"/>
  </div>`;
}

/* ───────── Service Concept ───────── */
function SceneServiceConcept() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navy"/></div>
    <div class="tx diag">
      <div class="diag-head">
        <div class="diag-kicker">시스템 소개 · 서비스 개념</div>
        <h2 class="diag-title">개발자·에이전트·고객이 <em>한 흐름</em>으로 묶입니다.</h2>
        <p class="diag-sub">Sprintable이 워크플로우의 주체로서 사람과 에이전트를 연결하는 방식.</p>
      </div>
      <div class="diag-stage"><img src="assets/service-concept-ko.svg" alt="Sprintable 서비스 개념도"/></div>
    </div>
    <${CM}/><${CF} i=${10} total=${35} label="Service Concept"/>
  </div>`;
}

/* ───────── System Architecture ───────── */
function SceneSystemArch() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navygrid"/></div>
    <div class="tx diag" style="padding:48px 72px 64px;gap:16px">
      <div class="diag-head">
        <div class="diag-kicker">시스템 소개 · 아키텍처</div>
        <h2 class="diag-title" style="font-size:44px">Memo·Webhook·Rules·HITL이 <em>한 시스템</em>으로 동작합니다.</h2>
      </div>
      <div class="diag-stage diag-stage--raw"><img src="assets/system_architecture.svg" alt="Sprintable 시스템 아키텍처"/></div>
    </div>
    <${CM}/><${CF} i=${11} total=${35} label="System Architecture"/>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   SLIDE 02 — P&D 이해했습니다
══════════════════════════════════════════════════════════ */
function S02Context() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navydeep"/></div>
    <div class="tx context-layout">
      <div class="context-left">
        <div class="eyebrow"><span class="dot"></span>우리가 이해한 P&D</div>
        <h2 class="slide-title">P&D는 단순 판매사가 아니라,<br/>고객사의 <em>BI 환경을 구축하는 팀</em>입니다</h2>
        <div class="context-cards">
          <div class="ctx-card">
            <div class="ctx-tag">설립</div>
            <div class="ctx-fact">2003년 설립<br/>데이터 시각화 전문기업</div>
            <div class="ctx-meaning">장기 구축 경험 보유</div>
          </div>
          <div class="ctx-card">
            <div class="ctx-tag">총판</div>
            <div class="ctx-fact">FineReport<br/>국내 총판 계약</div>
            <div class="ctx-meaning">FanRuan 제품 이해도 높음</div>
          </div>
          <div class="ctx-card">
            <div class="ctx-tag">생태계</div>
            <div class="ctx-fact">FineReport · FineBI<br/>FineDataLink 파트너</div>
            <div class="ctx-meaning">교육·데모·파트너 지원 증가</div>
          </div>
          <div class="ctx-card">
            <div class="ctx-tag">조직</div>
            <div class="ctx-fact">개발&컨설팅팀</div>
            <div class="ctx-meaning">개발과 요구사항 해석이 결합된 조직</div>
          </div>
        </div>
      </div>
      <div class="context-right">
        <div class="eyebrow" style="visibility:hidden"><span class="dot"></span>placeholder</div>
        <h2 class="slide-title" style="visibility:hidden">placeholder</h2>
        <div class="context-summary">
          <div class="cs-kicker">우리가 이해한 P&D</div>
          <div class="cs-body">
            P&D는 <strong>단순 리셀러가 아닙니다.</strong><br/><br/>
            고객사의 데이터 분석 환경을 실제로 구축하고,<br/>
            FineReport를 중심으로 한 <strong>BI 구축 전문 조직</strong>입니다.<br/><br/>
            이번 발표는 그 전문성을 <strong>대체하려는 것이 아닙니다.</strong>
          </div>
          <div class="context-source">출처: P&D 공식 홈페이지 · 뉴스룸 · 잡코리아 직무인터뷰</div>
        </div>
      </div>
    </div>
    <${CM}/><${CF} i=${1} total=${20} label="P&D 이해"/>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   SLIDE 03 — 번역 비용 (Translation Cost)
══════════════════════════════════════════════════════════ */
function S03Translation() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navytension"/></div>
    <div class="fg"><${Swarm} preset="chaos" count=${140} config=${{}}/></div>
    <div class="tx trans-layout safe">
      <div class="trans-col">
        <div class="trans-col-title">고객이 말하는 것</div>
        <div class="trans-item customer">"월간 보고서를 자동화하고 싶습니다."</div>
        <div class="trans-item customer">"생산 라인별 불량률을 보고 싶습니다."</div>
        <div class="trans-item customer">"현장 관리자용 실시간 화면도 필요합니다."</div>
      </div>
      <div class="trans-center">
        <div class="trans-cost-badge">번역<br/>비용</div>
        <div class="trans-arrow-wrap">
          <div class="trans-arrow-line"></div>
          <div class="trans-arrow-head"></div>
        </div>
      </div>
      <div class="trans-col">
        <div class="trans-col-title">개발팀이 바꿔야 하는 것</div>
        <div class="trans-item trans-dev-item">데이터 소스 확인</div>
        <div class="trans-item trans-dev-item">지표 정의</div>
        <div class="trans-item trans-dev-item">화면 설계</div>
        <div class="trans-item trans-dev-item">권한 체계</div>
        <div class="trans-item trans-dev-item">배포 계획</div>
        <div class="trans-item trans-dev-item">검수 기준</div>
        <div class="trans-item trans-dev-item">고객 되묻기 항목</div>
      </div>
    </div>
    <${CM}/><${CF} i=${2} total=${20} label="번역 비용"/>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   SLIDE 04 — 운영 병목
══════════════════════════════════════════════════════════ */
function S04Bottleneck() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navydeep"/></div>
    <div class="tx bn-layout safe">
      <div class="eyebrow"><span class="dot"></span>반복되는 구조적 병목</div>
      <h2 class="slide-title">요구사항·변경·검수 기준이 흩어지면<br/><em>프로젝트 기억이 사라집니다</em></h2>
      <div class="bn-grid">
        <div class="bn-card">
          <div class="bn-problem">미팅·메일·문서에 요구사항 분산</div>
          <div class="bn-arr">→</div>
          <div class="bn-result">누가 무엇을 요청했는지 추적 불가</div>
        </div>
        <div class="bn-card">
          <div class="bn-problem">변경 요청 반복 수신</div>
          <div class="bn-arr">→</div>
          <div class="bn-result">결정 이유가 사라지고 재작업 증가</div>
        </div>
        <div class="bn-card">
          <div class="bn-problem">검수표 수작업 작성</div>
          <div class="bn-arr">→</div>
          <div class="bn-result">개발 완료 후 문서화 부담 증가</div>
        </div>
        <div class="bn-card">
          <div class="bn-problem">여러 고객사 동시 진행</div>
          <div class="bn-arr">→</div>
          <div class="bn-result">맥락 혼선과 재작업 반복</div>
        </div>
      </div>
      <div class="bn-note">
        이건 개발을 <strong>못해서 생기는 문제가 아닙니다.</strong><br/>
        프로젝트가 많아질수록 당연히 생기는 <strong>운영 구조의 문제</strong>입니다.
      </div>
    </div>
    <${CM}/><${CF} i=${3} total=${20} label="운영 병목"/>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   SLIDE 05 — Sprintable의 위치
══════════════════════════════════════════════════════════ */
function S05Position() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navygrid"/></div>
    <div class="tx pos-layout safe">
      <div class="eyebrow"><span class="dot"></span>제품 정의</div>
      <h2 class="slide-title">Sprintable은 개발을 대체하지 않고,<br/><em>실행 흐름을 연결합니다</em></h2>
      <div class="pos-formula">
        <span class="pf-part">스프린트 관리</span>
        <span class="pf-plus">+</span>
        <span class="pf-part">에이전트 계획 보고</span>
        <span class="pf-plus">+</span>
        <span class="pf-part">자동 문서화</span>
        <span style="margin-left:auto;font-family:var(--font-mono);font-size:22px;color:var(--brand-primary)">=  Sprintable</span>
      </div>
      <div class="pos-cards">
        <div class="pos-card">
          <div class="pos-num">01</div>
          <div class="pos-name">스프린트 관리</div>
          <div class="pos-desc">고객사별 프로젝트 목표와 이슈를 분리·관리합니다</div>
        </div>
        <div class="pos-card">
          <div class="pos-num">02</div>
          <div class="pos-name">에이전트 계획 보고</div>
          <div class="pos-desc">목표·범위·리스크·질문·이슈 초안을 자동 생성합니다</div>
        </div>
        <div class="pos-card">
          <div class="pos-num">03</div>
          <div class="pos-name">자동 문서화</div>
          <div class="pos-desc">검수표·회의록·보고서·결정 이력이 실행 중 축적됩니다</div>
        </div>
      </div>
      <div class="pos-message">
        지라나 노션의 단순 대체재가 아닙니다.<br/>
        고객 요구사항을 <em>실행 가능한 스프린트로 전환</em>하는 레이어입니다.
      </div>
    </div>
    <${CM}/><${CF} i=${4} total=${20} label="제품 정의"/>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   SLIDE 06 — 핵심 워크플로우
══════════════════════════════════════════════════════════ */
function S06Workflow() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navyflow"/></div>
    <div class="tx wf-layout safe">
      <div class="eyebrow"><span class="dot"></span>핵심 워크플로우</div>
      <h2 class="slide-title">요청 → 계획 보고 → <em>사람 승인</em> → 스프린트 실행 → 자동 문서화</h2>
      <div class="wf-timeline">
        <div class="wf-step">
          <div class="wf-badge normal">01</div>
          <div class="wf-card">
            <div class="wf-name">고객 요청 입력</div>
            <div class="wf-desc">미팅 메모, 메일, 메신저 대화 — 거친 형태로도 입력 가능</div>
          </div>
        </div>
        <div class="wf-step">
          <div class="wf-badge normal">02</div>
          <div class="wf-card">
            <div class="wf-name">에이전트 계획 보고</div>
            <div class="wf-desc">목표·범위·리스크·고객 질문 초안 자동 생성</div>
          </div>
        </div>
        <div class="wf-step">
          <div class="wf-badge teal">03</div>
          <div class="wf-card teal">
            <div class="wf-name teal">사람 승인 ✓</div>
            <div class="wf-desc">개발자·리더가 수정하고 승인해야 다음 단계 진행</div>
          </div>
        </div>
        <div class="wf-step">
          <div class="wf-badge normal">04</div>
          <div class="wf-card">
            <div class="wf-name">스프린트 보드 생성</div>
            <div class="wf-desc">이슈가 개발·컨설팅·문서 작업으로 분해됨</div>
          </div>
        </div>
        <div class="wf-step">
          <div class="wf-badge normal">05</div>
          <div class="wf-card">
            <div class="wf-name">자동 문서화</div>
            <div class="wf-desc">검수표·보고서·결정 이력이 실행 과정에서 축적</div>
          </div>
        </div>
      </div>
      <div class="wf-key">
        가장 중요한 지점: 에이전트는 <strong>먼저 보고하고</strong>, 사람이 <strong>승인한 뒤</strong> 실행됩니다.
      </div>
    </div>
    <${CM}/><${CF} i=${5} total=${20} label="핵심 워크플로우"/>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   SLIDE 07 — 데모 시나리오
══════════════════════════════════════════════════════════ */
function S07DemoIntro() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navyradar"/></div>
    <div class="fg"><${Swarm} preset="radar" count=${160} config=${{cx:.82,cy:.25}}/></div>
    <div class="tx demo-intro-layout safe">
      <div class="demo-kicker"><span class="live"></span>Demo · FineReport 제조 대시보드 구축 파일럿</div>
      <div class="scenario-card">
        <div class="sc-label">오늘의 데모 시나리오 — 고객 요청</div>
        <div class="sc-quote">
          제조 고객사가 생산 라인별 불량률, 설비 가동률, 일별 생산량을 FineReport 대시보드로 보고 싶어 합니다.
          데이터는 설비 로그 DB와 엑셀 수기 입력 파일에 나뉘어 있고,
          임원용 월간 보고서와 현장 관리자용 실시간 화면이 모두 필요합니다.
          첫 번째 구축 스프린트를 만들어주세요.
        </div>
        <div class="sc-note">
          <strong>FineReport 자체를 대체하는 것이 아닙니다.</strong><br/>
          구축 운영 흐름 — 요구사항 정리부터 검수까지 — 을 보여드리겠습니다.
        </div>
        <div class="demo-tags">
          <div class="demo-tag active">① 프로젝트 생성</div>
          <div class="demo-tag">② 자연어 입력</div>
          <div class="demo-tag">③ 에이전트 계획 보고</div>
          <div class="demo-tag">④ 사람 승인</div>
          <div class="demo-tag">⑤ 보드 + 자동 문서화</div>
        </div>
      </div>
    </div>
    <${CM}/><${CF} i=${6} total=${20} label="데모 시나리오"/>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   SLIDE 08 — Demo 1: 고객사 프로젝트 생성
══════════════════════════════════════════════════════════ */
function S08Demo1() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navydeep"/></div>
    <div class="tx demo-layout safe">
      <div class="eyebrow"><span class="dot"></span>Demo 01 · 고객사 프로젝트 생성</div>
      <h2 class="slide-title" style="font-size:56px">고객사별 프로젝트 맥락을 <em>먼저 분리</em>합니다</h2>
      <div class="demo-split">
        <div>
          <div class="demo-desc">여러 고객사를 동시에 구축할 때 <strong>프로젝트별 맥락 격리</strong>가 필요합니다. 고객사마다 데이터 구조, 지표, 이해관계자가 다릅니다.</div>
          <div class="highlight-box" style="margin-top:auto">
            맥락이 섞이면 에이전트의 계획이 틀립니다.<br/><em>고객사 = 독립 워크스페이스</em>
          </div>
        </div>
        <div class="ui-panel" style="height:480px">
          <div class="ui-head">
            <span class="d"></span><span class="d"></span><span class="d"></span>
            <span class="t">새 프로젝트 · Sprintable</span>
          </div>
          <div class="ui-body">
            <div class="mf">
              <div class="mf-lbl">프로젝트명</div>
              <div class="mf-val teal">FineReport 제조 대시보드 구축 파일럿</div>
            </div>
            <div class="mf">
              <div class="mf-lbl">고객사</div>
              <div class="mf-val teal">가상 제조 고객사 (A사)</div>
            </div>
            <div class="mf">
              <div class="mf-lbl">목표</div>
              <div class="mf-val">생산 품질 지표 대시보드 구축</div>
            </div>
            <div class="mf">
              <div class="mf-lbl">스프린트 기간</div>
              <div class="mf-val">2주</div>
            </div>
            <div class="mf">
              <div class="mf-lbl">담당 개발자</div>
              <div class="mf-val">개발&컨설팅팀</div>
            </div>
            <div style="margin-top:8px;padding:12px 14px;border-radius:8px;background:rgba(6,182,212,.1);border:1px solid rgba(6,182,212,.28);font-family:var(--font-mono);font-size:15px;color:var(--brand-primary);text-align:center">
              프로젝트 생성 →
            </div>
          </div>
        </div>
      </div>
    </div>
    <${CM}/><${CF} i=${7} total=${20} label="Demo 01 · 프로젝트 생성"/>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   SLIDE 09 — Demo 2: 자연어 요청 입력
══════════════════════════════════════════════════════════ */
function S09Demo2() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navydeep"/></div>
    <div class="tx demo-layout safe">
      <div class="eyebrow"><span class="dot"></span>Demo 02 · 자연어 요청 입력</div>
      <h2 class="slide-title" style="font-size:56px">완벽한 티켓이 아니어도 <em>시작할 수 있어야 합니다</em></h2>
      <div class="demo-split">
        <div class="ui-panel" style="height:460px">
          <div class="ui-head">
            <span class="d"></span><span class="d"></span><span class="d"></span>
            <span class="t">고객 요청 입력 · 거친 메모 OK</span>
          </div>
          <div class="ui-body">
            <div class="mf">
              <div class="mf-lbl">고객 미팅 메모 (원문 그대로)</div>
              <div class="mf-val" style="min-height:200px;font-size:16px;line-height:1.6;color:var(--fg-2)">
                제조 고객사 요청: 생산 라인별 불량률, 설비 가동률, 일별 생산량 대시보드.<br/>
                데이터는 설비 로그 DB + 엑셀 수기 입력.<br/>
                임원용 월간 보고서 + 현장 관리자용 실시간 화면.<br/>
                첫 번째 구축 스프린트 만들어달라고 함.
              </div>
            </div>
            <div style="padding:11px 14px;border-radius:8px;background:rgba(6,182,212,.1);border:1px solid rgba(6,182,212,.28);font-family:var(--font-mono);font-size:15px;color:var(--brand-primary);text-align:center">
              계획 작성 요청 →
            </div>
          </div>
        </div>
        <div>
          <div class="demo-desc">현장에서는 처음부터 <strong>완벽한 요구사항 문서</strong>가 나오지 않습니다. 회의 메모, 메일, 메신저 대화가 먼저 생깁니다.</div>
          <div class="highlight-box" style="margin-top:24px">
            거친 메모도 개발팀이<br/>검토할 수 있는 구조로 바꿉니다.<br/><em>입력 품질보다 처리 구조가 중요합니다</em>
          </div>
        </div>
      </div>
    </div>
    <${CM}/><${CF} i=${8} total=${20} label="Demo 02 · 자연어 입력"/>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   SLIDE 10 — Demo 3: 에이전트 계획 보고
══════════════════════════════════════════════════════════ */
function S10Demo3() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navydeep"/></div>
    <div class="tx demo-layout safe">
      <div class="eyebrow"><span class="dot"></span>Demo 03 · 에이전트 계획 보고</div>
      <h2 class="slide-title" style="font-size:52px">에이전트의 첫 역할은 실행이 아니라 <em>빠진 것을 드러내는 것</em>입니다</h2>
      <div class="demo-split">
        <div>
          <div class="demo-desc">개발팀에게 중요한 것은 에이전트가 무언가를 해냈다는 것보다, <strong>빠진 요구사항과 되물어야 할 질문을 드러내는 것</strong>입니다.</div>
          <div class="highlight-box" style="margin-top:auto">
            초기에 리스크와 질문을 드러내야<br/>뒤에서 <em>재작업이 줄어듭니다</em>
          </div>
        </div>
        <div class="ui-panel" style="height:460px">
          <div class="ui-head">
            <span class="d"></span><span class="d"></span><span class="d"></span>
            <span class="t">에이전트 계획 보고 · 초안</span>
          </div>
          <div class="ui-body">
            <div class="report-section">
              <div class="rs-head">목표</div>
              <div class="rs-body">생산 품질 지표를 FineReport 대시보드로 시각화</div>
            </div>
            <div class="report-section">
              <div class="rs-head">범위</div>
              <div class="rs-body">데이터 소스 확인 → 지표 정의 → 화면 설계 → 구현 → 검수</div>
            </div>
            <div class="report-section">
              <div class="rs-head">리스크</div>
              <div class="rs-body">
                <span class="risk-badge high">HIGH 데이터 정합성 불명확</span>
                <span class="risk-badge high">HIGH 실시간성 요구 불명확</span>
                <span class="risk-badge med">MED 엑셀 수기 입력 품질</span>
              </div>
            </div>
            <div class="report-section">
              <div class="rs-head">고객 되묻기 항목</div>
              <div class="rs-body" style="font-size:15px;line-height:1.6;color:var(--fg-3)">
                · 대시보드 갱신 주기 (실시간? 5분? 일별?)<br/>
                · 임원/관리자/현장 권한 체계<br/>
                · 월간 보고서 출력 형식 (PDF? 인쇄?)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <${CM}/><${CF} i=${9} total=${20} label="Demo 03 · 에이전트 계획 보고"/>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   SLIDE 11 — Demo 4: 사람 승인과 수정
══════════════════════════════════════════════════════════ */
function S11Demo4() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navydeep"/></div>
    <div class="tx demo-layout safe">
      <div class="eyebrow"><span class="dot"></span>Demo 04 · 사람 승인과 수정</div>
      <h2 class="slide-title" style="font-size:56px">통제권은 끝까지 <em>개발자와 리더</em>에게 있습니다</h2>
      <div class="demo-split">
        <div>
          <div class="demo-desc">에이전트 제안은 <strong>초안</strong>입니다. 개발자나 리더가 현실에 맞게 수정하고 승인해야 합니다.</div>
          <div class="highlight-box" style="margin-top:24px">
            Sprintable은 에이전트 자율 실행보다<br/><em>보고 후 승인 구조</em>를 우선합니다
          </div>
        </div>
        <div class="ui-panel" style="height:460px">
          <div class="ui-head">
            <span class="d"></span><span class="d"></span><span class="d"></span>
            <span class="t">계획 검토 · 승인 대기</span>
          </div>
          <div class="ui-body">
            <div class="approval-bar">REVIEW REQUIRED · 에이전트 초안 검토 필요</div>
            <div class="diff-grid">
              <div class="diff-col before">
                <div class="diff-tag before">에이전트 초안</div>
                실시간성 요구 불명확<br/>권한 체계 미정
              </div>
              <div class="diff-col after">
                <div class="diff-tag after">개발자 수정본</div>
                5분 단위 갱신으로 가정<br/>임원·관리자·현장 역할 분리
              </div>
            </div>
            <div style="font-family:var(--font-mono);font-size:13px;color:var(--fg-4);padding:8px 0">변경 항목 · 리스크 1개 추가됨</div>
            <div class="approve-btns">
              <div class="approve-btn req">변경 요청</div>
              <div class="approve-btn go">승인 → 실행</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <${CM}/><${CF} i=${10} total=${20} label="Demo 04 · 사람 승인"/>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   SLIDE 12 — Demo 5: 스프린트 보드 + 자동 문서화
══════════════════════════════════════════════════════════ */
function S12Demo5() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navydeep"/></div>
    <div class="tx demo-layout safe">
      <div class="eyebrow"><span class="dot"></span>Demo 05 · 스프린트 보드 + 자동 문서화</div>
      <h2 class="slide-title" style="font-size:52px">고객 요청이 <em>개발·컨설팅·문서 작업</em>으로 분해됩니다</h2>
      <div class="demo-split">
        <div class="ui-panel" style="height:420px">
          <div class="ui-head">
            <span class="d"></span><span class="d"></span><span class="d"></span>
            <span class="t">스프린트 보드 · FineReport 제조 파일럿</span>
          </div>
          <div class="ui-body" style="padding:12px">
            <div class="kanban">
              <div class="kb-col">
                <div class="kb-hd">할 일<span class="cnt">3</span></div>
                <div class="kb-card">요구사항 정리<span class="kb-t con">컨설팅</span></div>
                <div class="kb-card">화면 설계<span class="kb-t dev">개발</span></div>
                <div class="kb-card">고객 질문 발송<span class="kb-t con">컨설팅</span></div>
              </div>
              <div class="kb-col">
                <div class="kb-hd">진행 중<span class="cnt">2</span></div>
                <div class="kb-card hl">데이터 소스 확인<span class="kb-t dev">개발</span></div>
                <div class="kb-card">FineReport 구현 계획<span class="kb-t dev">개발</span></div>
              </div>
              <div class="kb-col">
                <div class="kb-hd">검토<span class="cnt">2</span></div>
                <div class="kb-card hl">지표 정의서<span class="kb-t doc">문서</span></div>
                <div class="kb-card">검수 체크리스트<span class="kb-t doc">문서</span></div>
              </div>
              <div class="kb-col">
                <div class="kb-hd">완료<span class="cnt">1</span></div>
                <div class="kb-card">고객 보고서 초안<span class="kb-t doc">문서</span></div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="demo-desc" style="margin-bottom:16px">문서는 따로 다시 쓰는 것이 아니라 <strong>실행 과정에서 축적</strong>되어야 합니다.</div>
          <div class="doc-list">
            <div class="doc-item"><div class="doc-icon">📋</div><span class="doc-title">고객 확인 질문 목록</span><span class="doc-badge">자동 생성</span></div>
            <div class="doc-item"><div class="doc-icon">📄</div><span class="doc-title">요구사항 요약서</span><span class="doc-badge">자동 생성</span></div>
            <div class="doc-item"><div class="doc-icon">📊</div><span class="doc-title">지표 정의서 초안</span><span class="doc-badge">자동 생성</span></div>
            <div class="doc-item"><div class="doc-icon">✅</div><span class="doc-title">검수 체크리스트</span><span class="doc-badge">자동 생성</span></div>
            <div class="doc-item"><div class="doc-icon">📝</div><span class="doc-title">주간 진행 보고서</span><span class="doc-badge">자동 생성</span></div>
          </div>
        </div>
      </div>
    </div>
    <${CM}/><${CF} i=${11} total=${20} label="Demo 05 · 보드 + 문서화"/>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   SLIDE 13 — 개발자 관점에서 중요한 것
══════════════════════════════════════════════════════════ */
function S13Trust() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navygrid"/></div>
    <div class="tx trust-layout safe">
      <div class="eyebrow"><span class="dot"></span>개발자 신뢰 구조</div>
      <h2 class="slide-title">개발자에게 필요한 것은 마법이 아니라<br/><em>추적 가능한 자동화</em>입니다</h2>
      <div class="trust-grid">
        <div class="trust-card">
          <div class="tc-num">원칙 01</div>
          <div class="tc-title">사람 승인</div>
          <div class="tc-desc">에이전트는 먼저 보고하고, 개발자·리더가 수정·승인한 뒤 실행됩니다. 바로 실행하는 구조는 없습니다.</div>
        </div>
        <div class="trust-card">
          <div class="tc-num">원칙 02</div>
          <div class="tc-title">프로젝트 격리</div>
          <div class="tc-desc">고객사별 프로젝트가 완전히 분리됩니다. A사 맥락이 B사에 섞이지 않습니다.</div>
        </div>
        <div class="trust-card">
          <div class="tc-num">원칙 03</div>
          <div class="tc-title">실행 로그</div>
          <div class="tc-desc">누가, 언제, 왜, 무엇을 바꿨는지 추적할 수 있습니다. 결정 이유가 사라지지 않습니다.</div>
        </div>
        <div class="trust-card">
          <div class="tc-num">원칙 04</div>
          <div class="tc-title">산출물 연결</div>
          <div class="tc-desc">이슈와 문서, 결과물이 연결됩니다. 이슈 하나에 관련 검수표와 보고서가 붙어 있습니다.</div>
        </div>
      </div>
      <div class="trust-msg">
        잘못된 자동화는 오히려 일을 늘립니다.
        그래서 <strong>사람 승인 + 맥락 격리 + 실행 로그 + 산출물 연결</strong>을 기본 원칙으로 합니다.
      </div>
    </div>
    <${CM}/><${CF} i=${12} total=${20} label="개발자 신뢰 구조"/>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   SLIDE 14 — 파일럿 제안
══════════════════════════════════════════════════════════ */
function S14Pilot() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navy"/></div>
    <div class="fg"><${Swarm} preset="ring" count=${160} config=${{cx:.82,cy:.3,r:.24}}/></div>
    <div class="tx pilot-layout safe">
      <div class="eyebrow"><span class="dot"></span>파일럿 제안</div>
      <h2 class="slide-title">첫 검증은 실제 FineReport 구축 프로젝트<br/><em>하나면 충분합니다</em></h2>
      <div class="pilot-card">
        <div class="pilot-row">
          <div class="pr-k">기간</div>
          <div class="pr-v"><span class="chip">2주</span></div>
        </div>
        <div class="pilot-row">
          <div class="pr-k">대상</div>
          <div class="pr-v">진행 중 또는 예정된 FineReport 구축 프로젝트 1개</div>
        </div>
        <div class="pilot-row">
          <div class="pr-k">범위</div>
          <div class="pr-v">
            <span class="chip">요구사항 정리</span>
            <span class="chip">이슈 분해</span>
            <span class="chip">고객 질문 목록</span>
            <span class="chip">검수표</span>
            <span class="chip">주간 보고서</span>
          </div>
        </div>
        <div class="pilot-row">
          <div class="pr-k">데이터</div>
          <div class="pr-v">실제 고객 데이터 없이 <strong>요구사항·문서 흐름부터</strong> 검증</div>
        </div>
        <div class="pilot-row">
          <div class="pr-k">성공 기준</div>
          <div class="pr-v">정리 시간 감소 · 이슈 누락 감소 · 보고서 작성 시간 감소</div>
        </div>
      </div>
      <div class="pilot-msg">
        처음부터 큰 도입보다, 실제 프로젝트 하나로 <strong>운영 가치부터 검증</strong>합니다.
      </div>
    </div>
    <${CM}/><${CF} i=${13} total=${20} label="파일럿 제안"/>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   SLIDE 15 — 다음 액션
══════════════════════════════════════════════════════════ */
function S15Action() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navybloom"/></div>
    <div class="fg"><${Swarm} preset="bloom" count=${200} config=${{}}/></div>
    <div class="tx action-layout safe">
      <div class="action-left">
        <div class="eyebrow"><span class="dot"></span>다음 액션</div>
        <h2 class="slide-title">2주 파일럿으로<br/>검증할 수 있습니다</h2>
        <div class="action-steps">
          <div class="act-step">
            <div class="act-num">1</div>
            <div class="act-body">
              <div class="act-title">프로젝트 1개 선정</div>
              <div class="act-sub">진행 중 또는 예정된 FineReport 구축 프로젝트</div>
            </div>
          </div>
          <div class="act-step">
            <div class="act-num">2</div>
            <div class="act-body">
              <div class="act-title">Sprintable 워크스페이스 구성</div>
              <div class="act-sub">고객사·목표·기간 설정 (30분 내 완료)</div>
            </div>
          </div>
          <div class="act-step">
            <div class="act-num">3</div>
            <div class="act-body">
              <div class="act-title">실제 요구사항으로 2주 파일럿</div>
              <div class="act-sub">요구사항 정리·이슈 분해·검수표·보고서</div>
            </div>
          </div>
          <div class="act-step">
            <div class="act-num">4</div>
            <div class="act-body">
              <div class="act-title">결과 리뷰</div>
              <div class="act-sub">시간 감소·누락 감소·문서 품질·팀 수용성</div>
            </div>
          </div>
        </div>
      </div>
      <div class="action-right">
        <div class="eyebrow" style="visibility:hidden"><span class="dot"></span>placeholder</div>
        <h2 class="slide-title" style="visibility:hidden">placeholder</h2>
        <div class="action-criteria">
          <div class="ac-title">리뷰 기준</div>
          <div class="ac-list">
            <div class="ac-item">회의 후 정리 시간 감소</div>
            <div class="ac-item">이슈 누락 감소</div>
            <div class="ac-item">검수표와 보고서 품질</div>
            <div class="ac-item">개발팀 사용성</div>
            <div class="ac-item">반복 프로젝트 재사용 가능성</div>
          </div>
        </div>
        <div class="action-closing">
          <em>"오늘 바로 도입하자는 제안이 아닙니다."</em><br/><br/>
          실제 FineReport 구축 프로젝트 하나로,
          요구사항 정리와 검수 문서화가 얼마나 줄어드는지
          2주 동안 같이 검증해보자는 제안입니다.
        </div>
      </div>
    </div>
    <${CM}/><${CF} i=${14} total=${20} label="다음 액션"/>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   BACKUP SLIDES (16-20)
══════════════════════════════════════════════════════════ */
function BackupShell({ i, label, title, children }) {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="navydeep"/></div>
    <div class="tx backup-layout safe">
      <div class="backup-badge">백업 슬라이드</div>
      <div class="eyebrow"><span class="dot"></span>${label}</div>
      <h2 class="slide-title" style="font-size:54px">${title}</h2>
      ${children}
    </div>
    <${CM}/><${CF} i=${i} total=${20} label=${label}/>
  </div>`;
}

function S16Backup1() {
  return html`<${BackupShell} i=${15} label="공개 조사 출처" title="P&D Solution 공개 조사 근거">
    <div class="backup-table">
      <div class="bt-row hd-row col2">
        <div class="bt-k hd">항목</div>
        <div class="bt-v hd">출처</div>
      </div>
      <div class="bt-row col2"><div class="bt-k">회사 개요</div><div class="bt-v">P&D 공식 회사소개 페이지</div></div>
      <div class="bt-row col2"><div class="bt-k">FineReport 소개</div><div class="bt-v">P&D FineReport 제품 페이지</div></div>
      <div class="bt-row col2"><div class="bt-k">FanRuan 파트너 협의회</div><div class="bt-v">P&D 뉴스룸, 벤처스퀘어 기사</div></div>
      <div class="bt-row col2"><div class="bt-k">개발&컨설팅팀 업무</div><div class="bt-v">잡코리아 직무 인터뷰</div></div>
      <div class="bt-row col2"><div class="bt-k">설립 연도</div><div class="bt-v">2003년 — 공식 사이트 및 기업 정보</div></div>
    </div>
  <//>`;
}

function S17Backup2() {
  return html`<${BackupShell} i=${16} label="예상 질문 대응" title="자주 나올 질문과 답변 방향">
    <div class="backup-table">
      <div class="bt-row hd-row col2">
        <div class="bt-k hd">예상 질문</div>
        <div class="bt-v hd">답변 방향</div>
      </div>
      <div class="bt-row col2">
        <div class="bt-k"><div class="qa-q">지라/노션으로도 되지 않나요?</div></div>
        <div class="bt-v"><div class="qa-a">대체가 아니라 실행 맥락을 묶는 레이어입니다. 지라는 이슈를, Sprintable은 고객 요청→이슈→검수 전체 흐름을 연결합니다.</div></div>
      </div>
      <div class="bt-row col2">
        <div class="bt-k"><div class="qa-q">FineReport와 바로 연동되나요?</div></div>
        <div class="bt-v"><div class="qa-a">1차는 운영 흐름 검증, 2차에서 연동 논의합니다. 첫 파일럿은 문서·이슈 흐름이 목표입니다.</div></div>
      </div>
      <div class="bt-row col2">
        <div class="bt-k"><div class="qa-q">고객 데이터 보안은요?</div></div>
        <div class="bt-v"><div class="qa-a">첫 파일럿은 실제 고객 데이터 없이 진행 가능합니다. 요구사항 텍스트와 문서 흐름만으로 검증합니다.</div></div>
      </div>
      <div class="bt-row col2">
        <div class="bt-k"><div class="qa-q">에이전트가 틀리면요?</div></div>
        <div class="bt-v"><div class="qa-a">바로 실행하지 않습니다. 사람이 검토·수정·승인한 뒤 진행됩니다.</div></div>
      </div>
      <div class="bt-row col2">
        <div class="bt-k"><div class="qa-q">개발자가 매일 쓸 이유가 있나요?</div></div>
        <div class="bt-v"><div class="qa-a">고객 미팅 후 정리, 이슈 분해, 검수표, 보고서 작성 반복을 줄입니다.</div></div>
      </div>
    </div>
  <//>`;
}

function S18Backup3() {
  return html`<${BackupShell} i=${17} label="파일럿 성공 기준" title="2주 파일럿에서 볼 지표">
    <div class="backup-table">
      <div class="bt-row hd-row col2">
        <div class="bt-k hd">지표</div>
        <div class="bt-v hd">측정 방식</div>
      </div>
      <div class="bt-row col2"><div class="bt-k">요구사항 정리 시간</div><div class="bt-v">기존 방식 대비 회의 후 정리 소요 시간 비교</div></div>
      <div class="bt-row col2"><div class="bt-k">이슈 누락</div><div class="bt-v">고객 요청 대비 생성 이슈 커버리지 확인</div></div>
      <div class="bt-row col2"><div class="bt-k">질문 품질</div><div class="bt-v">고객에게 되물어야 할 질문의 유용성 평가</div></div>
      <div class="bt-row col2"><div class="bt-k">문서 품질</div><div class="bt-v">검수표·보고서가 내부 공유 가능한 수준인지 평가</div></div>
      <div class="bt-row col2"><div class="bt-k">개발팀 수용성</div><div class="bt-v">실제 담당자가 계속 쓰고 싶은지 인터뷰</div></div>
    </div>
  <//>`;
}

function S19Backup4() {
  return html`<${BackupShell} i=${18} label="적용 확장 시나리오" title="파일럿 이후 확장 가능한 영역">
    <div class="backup-table">
      <div class="bt-row hd-row col2">
        <div class="bt-k hd">영역</div>
        <div class="bt-v hd">적용 예시</div>
      </div>
      <div class="bt-row col2"><div class="bt-k">고객사 구축 프로젝트</div><div class="bt-v">요구사항·이슈·검수·보고서 관리 전 과정</div></div>
      <div class="bt-row col2"><div class="bt-k">파트너 온보딩</div><div class="bt-v">FineReport·FineBI·FineDataLink 교육 및 질문 관리</div></div>
      <div class="bt-row col2"><div class="bt-k">내부 개발 관리</div><div class="bt-v">커스터마이징 개발 태스크와 문서화</div></div>
      <div class="bt-row col2"><div class="bt-k">반복 제안서 작성</div><div class="bt-v">고객 요구에 맞춘 구축 계획서 초안 생성</div></div>
    </div>
  <//>`;
}

function S20Backup5() {
  return html`<${BackupShell} i=${19} label="보안·데이터 처리" title="첫 파일럿은 실제 고객 데이터 없이 시작합니다">
    <div class="backup-table">
      <div class="bt-row col2" style="border-bottom:1px solid var(--border-subtle)">
        <div class="bt-k">1차 파일럿 범위</div>
        <div class="bt-v">요구사항 텍스트와 문서화 흐름만으로 가치 검증 가능</div>
      </div>
      <div class="bt-row col2" style="border-bottom:1px solid var(--border-subtle)">
        <div class="bt-k">포함하지 않는 것</div>
        <div class="bt-v">고객 데이터 · 로그 · 데이터베이스 접속 정보</div>
      </div>
      <div class="bt-row col2" style="border-bottom:1px solid var(--border-subtle)">
        <div class="bt-k">2차 논의 항목</div>
        <div class="bt-v">보안 · 배포 · 권한은 파일럿 이후 별도 논의</div>
      </div>
      <div class="bt-row col2">
        <div class="bt-k">자동 실행 여부</div>
        <div class="bt-v"><strong>없음</strong> — 개발팀 승인 없는 자동 실행은 없습니다</div>
      </div>
    </div>
    <div style="margin-top:24px;padding:18px 22px;background:rgba(6,182,212,.07);border:1px solid rgba(6,182,212,.18);border-radius:11px;font-size:22px;color:var(--fg-2)">
      첫 미팅에서는 보안 논쟁보다 <strong style="color:var(--brand-primary)">운영 흐름 검증</strong>에 집중합니다.
    </div>
  <//>`;
}

/* ══════════════════════════════════════════════════════════
   SCENES
══════════════════════════════════════════════════════════ */
const SCENES = [
  // ── Sprintable 시스템 소개 (9) ──
  { id:"cover",   label:"Cover",                      component: SceneCover },
  { id:"hook",    label:"Opening Hook",               component: SceneHook },
  { id:"div1",    label:"§1 What",                    component: ()=>html`<${Divider} idx=${1} total=${6} title='What we&rsquo;re <em>building.</em>' sub="우리가 만든 시스템 — Sprintable, Agentic OS." label="WHAT"/>` },
  { id:"what",    label:"What we're building",        component: SceneWhat },
  { id:"div2",    label:"§2 How",                     component: ()=>html`<${Divider} idx=${2} total=${6} title='How we <em>use AI.</em>' sub="에이전트는 챗봇이 아닌, 워크플로우의 주체입니다." label="HOW"/>` },
  { id:"how1",    label:"How · 1 Cycle",              component: SceneHow1 },
  { id:"how2",    label:"How · 2 Rules",              component: SceneHow2 },
  { id:"how3",    label:"How · 3 HITL",               component: SceneHow3 },
  { id:"story",          label:"Our Story",            component: SceneStory },
  // ── Sprintable 자료 (3) ──
  { id:"agents",         label:"Meet the Agents",      component: SceneAgents },
  { id:"service-concept",label:"서비스 개념",          component: SceneServiceConcept },
  { id:"system-arch",    label:"시스템 아키텍처",      component: SceneSystemArch },
  // ── P&D 문제 정의 ──
  { id:"div3",    label:"§3 문제 정의",                component: ()=>html`<${Divider} idx=${3} total=${6} title='고객 언어를 <em>개발 이슈로 바꾸는 비용.</em>' sub="FineReport 구축형 프로젝트의 구조적 병목" label="문제 정의"/>` },
  { id:"context", label:"P&D 이해",                   component: S02Context },
  { id:"trans",   label:"번역 비용",                  component: S03Translation },
  { id:"bn",      label:"운영 병목",                  component: S04Bottleneck },
  // ── P&D 제품 정의 ──
  { id:"div4",    label:"§4 제품 정의",                component: ()=>html`<${Divider} idx=${4} total=${6} title='Sprintable은 <em>실행 레이어</em>입니다.' sub="개발을 대체하지 않고 — 요구사항이 검수 문서로 남는 과정을 연결합니다." label="제품 정의"/>` },
  { id:"pos",     label:"제품 정의",                  component: S05Position },
  { id:"wf",      label:"핵심 워크플로우",             component: S06Workflow },
  // ── 데모 ──
  { id:"div5",    label:"§5 데모",                    component: ()=>html`<${Divider} idx=${5} total=${6} title='FineReport 구축 <em>데모.</em>' sub="거친 고객 요청이 스프린트와 검수 문서로 바뀌는 과정" label="데모"/>` },
  { id:"dintro",  label:"데모 시나리오",               component: S07DemoIntro },
  { id:"d1",      label:"Demo 01 · 프로젝트 생성",    component: S08Demo1 },
  { id:"d2",      label:"Demo 02 · 자연어 입력",      component: S09Demo2 },
  { id:"d3",      label:"Demo 03 · 에이전트 계획",    component: S10Demo3 },
  { id:"d4",      label:"Demo 04 · 사람 승인",        component: S11Demo4 },
  { id:"d5",      label:"Demo 05 · 보드 + 문서화",    component: S12Demo5 },
  // ── 파일럿 제안 ──
  { id:"div6",    label:"§6 파일럿 제안",              component: ()=>html`<${Divider} idx=${6} total=${6} title='2주 <em>파일럿</em>으로 검증합니다.' sub="큰 도입이 아니라 — 실제 프로젝트 하나로 운영 가치부터 확인합니다." label="파일럿 제안"/>` },
  { id:"trust",   label:"개발자 신뢰 구조",            component: S13Trust },
  { id:"pilot",   label:"파일럿 제안",                component: S14Pilot },
  { id:"action",  label:"다음 액션",                  component: S15Action },
  // ── Backup ──
  { id:"b1", label:"백업 · 조사 출처",     component: S16Backup1 },
  { id:"b2", label:"백업 · 예상 질문",     component: S17Backup2 },
  { id:"b3", label:"백업 · 성공 기준",     component: S18Backup3 },
  { id:"b4", label:"백업 · 확장 시나리오", component: S19Backup4 },
  { id:"b5", label:"백업 · 보안 원칙",     component: S20Backup5 },
];

/* ── Deck Controller ── */
const STORAGE_KEY = "pnd-finereport-deck:idx";

function Deck() {
  const total = SCENES.length;
  const [i, setI] = useState(() => {
    const raw = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(raw)&&raw>=0&&raw<total ? raw : 0;
  });
  const goto = useCallback((n)=>setI(Math.max(0,Math.min(total-1,n))),[total]);

  useEffect(()=>{
    try{ localStorage.setItem(STORAGE_KEY,String(i)); }catch(e){}
    const curr=document.getElementById("curr");
    const lbl=document.getElementById("label");
    const bar=document.getElementById("progress");
    if(curr) curr.textContent=String(i+1).padStart(2,"0");
    if(lbl)  lbl.textContent=SCENES[i].label;
    if(bar)  bar.style.width=(((i+1)/total)*100)+"%";
  },[i,total]);

  useEffect(()=>{
    document.getElementById("total").textContent=String(total).padStart(2,"0");
    const onKey=(e)=>{
      const t=e.target; if(t&&/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if(e.metaKey||e.ctrlKey||e.altKey) return;
      const k=e.key; let handled=true;
      if(k==="ArrowRight"||k==="PageDown"||k===" "||k==="Spacebar") goto(i+1);
      else if(k==="ArrowLeft"||k==="PageUp") goto(i-1);
      else if(k==="Home") goto(0);
      else if(k==="End") goto(total-1);
      else if(k==="r"||k==="R") goto(0);
      else if(k==="f"||k==="F"){
        if(!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
      else if(/^[0-9]$/.test(k)){ const n=k==="0"?9:parseInt(k)-1; if(n<total) goto(n); }
      else handled=false;
      if(handled){ e.preventDefault(); flashHUD(); }
    };
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[goto,i]);

  useEffect(()=>{
    const hud=document.getElementById("hud");
    const onClick=(e)=>{
      const btn=e.target.closest("[data-action]"); if(!btn) return;
      const a=btn.dataset.action;
      if(a==="prev") goto(i-1);
      else if(a==="next") goto(i+1);
      else if(a==="home") goto(0);
      else if(a==="end") goto(total-1);
      else if(a==="full"){
        if(!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
      flashHUD();
    };
    hud.addEventListener("click",onClick);
    let hideT;
    const onMove=()=>{ flashHUD(); clearTimeout(hideT); hideT=setTimeout(()=>hud.removeAttribute("data-show"),2400); };
    window.addEventListener("mousemove",onMove); onMove();
    return ()=>{ hud.removeEventListener("click",onClick); window.removeEventListener("mousemove",onMove); clearTimeout(hideT); };
  },[goto,i,total]);

  const Scene=SCENES[i].component;
  return html`<${Stage}><${Scene} key=${SCENES[i].id}/><//>`;
}

function flashHUD(){ const h=document.getElementById("hud"); if(h) h.setAttribute("data-show",""); }
render(html`<${Deck}/>`,document.getElementById("root"));
