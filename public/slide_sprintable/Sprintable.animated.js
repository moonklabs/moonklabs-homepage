/* =============================================================
   Sprintable — OpenAI Showcase · Animated deck
   Starter primitives (Stage, Sprite, useTime) + shader runtime
   + dot-swarm + 11 scenes + deck controller.

   Renders into #root using Preact + htm (no build step).
   ============================================================= */
import { h, render, Fragment } from "https://esm.sh/preact@10.19.3";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "https://esm.sh/preact@10.19.3/hooks";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(h);

/* =============================================================
   STARTER — animation.tsx primitives
   ============================================================= */

// seconds since mount, 60fps, for React-driven animation
export function useTime() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf, start = performance.now();
    const loop = (now) => { setT((now - start) / 1000); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return t;
}

// Authored-size container that scales to viewport, preserving aspect
export function Stage({ width = 1920, height = 1080, children }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const fit = () => {
      const el = ref.current; if (!el) return;
      const s = Math.min(window.innerWidth / width, window.innerHeight / height);
      el.style.transform = `scale(${s})`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [width, height]);
  return html`<div class="stage" ref=${ref} style=${{ width: width + "px", height: height + "px" }}>${children}</div>`;
}

// Positioned/transformed element (authored in stage px)
export function Sprite({ x = 0, y = 0, rotate = 0, scale = 1, opacity = 1, style = {}, className = "", children }) {
  const s = {
    position: "absolute", left: 0, top: 0,
    transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`,
    opacity, ...style,
  };
  return html`<div class=${className} style=${s}>${children}</div>`;
}

/* =============================================================
   SHADER BACKGROUND — single parameterized fragment shader
   ============================================================= */
const VS = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const FS = `
precision highp float;
uniform float u_time;
uniform vec2  u_resolution;
uniform vec3  u_color1;
uniform vec3  u_color2;
uniform vec3  u_color3;
uniform float u_swirl;
uniform float u_noise;
uniform float u_pulse;
uniform float u_speed;
uniform vec2  u_focus;
uniform float u_grid;
uniform float u_flow;

vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 mod289v3(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289v3(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 gy=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 gx=x-ox;
  m*=1.79284291400159-0.85373472095314*(gx*gx+gy*gy);
  vec3 g; g.x=gx.x*x0.x+gy.x*x0.y;
  g.yz=gx.yz*x12.xz+gy.yz*x12.yw;
  return 130.0*dot(m,g);
}
float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<4;i++){ v+=a*snoise(p); p*=2.0; a*=0.5; } return v; }

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p  = uv - u_focus;
  float d = length(p * vec2(u_resolution.x/u_resolution.y, 1.0));
  float t = u_time * u_speed;

  vec2 q = uv;
  q += vec2(fbm(vec2(uv.y*1.8, t*0.08)), fbm(vec2(uv.x*1.8, t*0.08+3.14))) * u_swirl * 0.18;

  vec3 g = mix(u_color1, u_color2, smoothstep(0.05, 0.95, q.y + fbm(q*1.2 + t*0.04)*0.15));
  g = mix(g, u_color3, smoothstep(0.45, 0.9, (q.x*0.55 + q.y*0.3) + fbm(q*0.9 + t*0.03)*0.22) * 0.65);

  float rp = sin(d*9.0 - t*1.7);
  rp = smoothstep(0.35, 1.0, rp) * smoothstep(0.75, 0.0, d);
  g += u_color3 * rp * u_pulse * 0.95;

  if (u_grid > 0.001) {
    vec2 gp = uv * vec2(u_resolution.x/u_resolution.y, 1.0) * 28.0;
    vec2 gf = abs(fract(gp) - 0.5);
    float gl = min(gf.x, gf.y);
    float line = smoothstep(0.02, 0.0, gl);
    float fade = smoothstep(0.0, 0.5, 1.0 - uv.y);
    g += u_color3 * line * u_grid * fade * 0.35;
  }
  if (u_flow > 0.001) {
    float bands = sin(uv.y*18.0 + fbm(vec2(uv.x*3.0, t*0.2))*4.0 + t*0.45);
    bands = smoothstep(0.88, 1.0, bands);
    g += u_color3 * bands * u_flow * 0.5;
  }

  float grain = snoise(uv * u_resolution * 0.75 + t*0.3) * u_noise * 0.07;
  g += grain;

  g *= smoothstep(1.3, 0.5, d);
  gl_FragColor = vec4(g, 1.0);
}`;

const SHADER = {
  aurora: { c1: [.035, .04, .055], c2: [.03, .08, .16], c3: [.2, .52, .97], swirl: 0.85, noise: 0.25, pulse: 0.0, speed: 0.22, focus: [0.12, 1.0], grid: 0, flow: 0 },
  tension: { c1: [.02, .022, .03], c2: [.05, .05, .10], c3: [.22, .48, .95], swirl: 1.0, noise: 0.55, pulse: 0.0, speed: 0.32, focus: [0.5, 0.5], grid: 0, flow: 0 },
  grid: { c1: [.004, .005, .008], c2: [.012, .02, .035], c3: [.2, .52, .97], swirl: 0.2, noise: 0.15, pulse: 0.0, speed: 0.18, focus: [0.5, 1.4], grid: 0.9, flow: 0 },
  waves: { c1: [.028, .035, .045], c2: [.02, .05, .12], c3: [.2, .52, .97], swirl: 0.45, noise: 0.22, pulse: 0.0, speed: 0.5, focus: [0.5, 0.5], grid: 0, flow: 0.9 },
  radar: { c1: [.025, .03, .04], c2: [.03, .06, .14], c3: [.2, .52, .97], swirl: 0.3, noise: 0.2, pulse: 1.0, speed: 0.85, focus: [0.82, 0.25], grid: 0, flow: 0 },
  swarm: { c1: [.01, .012, .02], c2: [.025, .035, .08], c3: [.25, .55, 1.0], swirl: 0.9, noise: 0.35, pulse: 0.25, speed: 0.22, focus: [0.55, 0.5], grid: 0, flow: 0 },
  deep: { c1: [.004, .004, .008], c2: [.008, .012, .02], c3: [.2, .5, .97], swirl: 0.3, noise: 0.18, pulse: 0.0, speed: 0.12, focus: [0.5, 1.2], grid: 0.4, flow: 0 },
  bloom: { c1: [.03, .04, .065], c2: [.05, .09, .18], c3: [.3, .6, 1.0], swirl: 0.7, noise: 0.2, pulse: 0.55, speed: 0.22, focus: [0.5, 1.05], grid: 0, flow: 0 },
};

export function ShaderBG({ preset = "aurora" }) {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas.getContext("webgl", { antialias: false, depth: false, premultipliedAlpha: false });
    if (!gl) { console.warn("WebGL not available"); return; }
    const mk = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn("shader err:", gl.getShaderInfoLog(s), src);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const u = {};
    ["u_time", "u_resolution", "u_color1", "u_color2", "u_color3", "u_swirl", "u_noise", "u_pulse", "u_speed", "u_focus", "u_grid", "u_flow"]
      .forEach(n => u[n] = gl.getUniformLocation(prog, n));

    let raf, start = performance.now();
    const loop = (now) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(2, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(2, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h);
      }
      const p = SHADER[preset] || SHADER.aurora;
      const t = (now - start) / 1000;
      gl.uniform1f(u.u_time, t);
      gl.uniform2f(u.u_resolution, canvas.width, canvas.height);
      gl.uniform3fv(u.u_color1, p.c1); gl.uniform3fv(u.u_color2, p.c2); gl.uniform3fv(u.u_color3, p.c3);
      gl.uniform1f(u.u_swirl, p.swirl); gl.uniform1f(u.u_noise, p.noise); gl.uniform1f(u.u_pulse, p.pulse);
      gl.uniform1f(u.u_speed, p.speed); gl.uniform2fv(u.u_focus, p.focus);
      gl.uniform1f(u.u_grid, p.grid); gl.uniform1f(u.u_flow, p.flow);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); try { gl.getExtension("WEBGL_lose_context")?.loseContext(); } catch (e) { } };
  }, [preset]);
  return html`<canvas ref=${ref} style="width:100%;height:100%;display:block"/>`;
}

/* =============================================================
   SWARM — canvas-2D particle system, the "Headless Agent Swarm"
   motif reused across scenes with different presets.
   ============================================================= */
const SWARM = {
  ring: (s, t, W, H) => {
    const cx = W * s.cx, cy = H * s.cy, r = Math.min(W, H) * s.r;
    for (const d of s.parts) {
      const a = d.a + t * 0.12;
      d.x = cx + Math.cos(a) * r * (1 + 0.035 * Math.sin(t * 0.7 + d.k));
      d.y = cy + Math.sin(a) * r * (1 + 0.035 * Math.sin(t * 0.7 + d.k));
      d.alpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.8 + d.k * 6));
      d.size = d.b * (0.9 + 0.4 * Math.sin(t * 0.5 + d.k * 3));
    }
  },
  chaos: (s, t, W, H) => {
    const cx = W * 0.55, cy = H * 0.5;
    for (const d of s.parts) {
      d.vx += (Math.random() - 0.5) * 0.8 - (d.x - cx) * 0.00012;
      d.vy += (Math.random() - 0.5) * 0.8 - (d.y - cy) * 0.00012;
      d.vx *= 0.94; d.vy *= 0.94;
      d.x += d.vx; d.y += d.vy;
      d.alpha = 0.22 + 0.5 * Math.abs(Math.sin(t * 0.45 + d.k * 5));
      d.size = d.b * (0.8 + 0.4 * Math.sin(t * 0.7 + d.k));
    }
  },
  cycle: (s, t, W, H) => {
    const cx = W * s.cx, cy = H * s.cy, rx = Math.min(W, H) * s.rx, ry = Math.min(W, H) * s.ry;
    for (const d of s.parts) {
      const a = d.a + t * 0.4;
      d.x = cx + Math.cos(a) * rx;
      d.y = cy + Math.sin(a) * ry;
      const phase = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      d.alpha = 0.22 + 0.78 * Math.pow(Math.sin(phase / 2), 4);
      d.size = d.b * (0.7 + 1.4 * Math.pow(Math.sin(phase / 2), 6));
    }
  },
  radar: (s, t, W, H) => {
    const cx = W * s.cx, cy = H * s.cy, max = Math.min(W, H) * 0.95;
    for (const d of s.parts) {
      const phase = ((t * 0.35 + d.k) % 1);
      const r = phase * max;
      d.x = cx + Math.cos(d.a) * r;
      d.y = cy + Math.sin(d.a) * r;
      d.alpha = (1 - phase) * 0.75;
      d.size = d.b * (0.6 + phase * 1.6);
    }
  },
  starfield: (s, t, W, H) => {
    const cx = W * s.cx, cy = H * s.cy;
    for (const d of s.parts) {
      d.life += 0.008;
      if (d.life > 1) { d.life = 0; d.a = Math.random() * Math.PI * 2; d.speed = 0.35 + Math.random() * 1.25; d.k = Math.random() * 10; }
      const r = d.life * d.life * Math.min(W, H) * 0.95 * d.speed;
      d.x = cx + Math.cos(d.a) * r;
      d.y = cy + Math.sin(d.a) * r;
      d.alpha = Math.pow(d.life, 1.3) * 0.9;
      d.size = d.b * (0.5 + d.life * 2.2);
    }
  },
  converge: (s, t, W, H) => {
    for (const d of s.parts) {
      d.x = d.tx + Math.sin(t * 0.6 + d.k * 3) * 3;
      d.y = d.ty + Math.cos(t * 0.5 + d.k * 4) * 3;
      d.alpha = 0.55 + 0.45 * Math.sin(t * 0.9 + d.k * 5);
      d.size = d.b * (0.85 + 0.35 * Math.abs(Math.sin(t * 0.4 + d.k * 2)));
    }
  },
  bloom: (s, t, W, H) => {
    const cx = W * 0.5, cy = H * 0.62, max = Math.min(W, H) * 0.5;
    for (const d of s.parts) {
      const a = d.a + t * 0.06 * (0.4 + d.k * 0.07);
      const r = max * (0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * 0.35 + d.k * 2)));
      d.x = cx + Math.cos(a) * r;
      d.y = cy + Math.sin(a) * r * 0.8;
      d.alpha = 0.3 + 0.55 * (0.5 + 0.5 * Math.cos(t * 0.5 + d.k * 3));
      d.size = d.b * (0.8 + 0.5 * Math.sin(t * 0.45 + d.k));
    }
  },
};

// Sample non-empty pixels of rendered text → normalized [0..1] target points
export function sampleTextTargets(text, fontCss, count, aspect = 1.6) {
  const W = 640, H = Math.round(W / aspect);
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.font = fontCss;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(text, W / 2, H / 2);
  const d = ctx.getImageData(0, 0, W, H).data;
  const pts = []; let tries = 0;
  while (pts.length < count && tries < count * 30) {
    tries++;
    const px = (Math.random() * W) | 0, py = (Math.random() * H) | 0;
    if (d[(py * W + px) * 4 + 3] > 128) pts.push([px / W, py / H]);
  }
  while (pts.length < count) pts.push([Math.random(), Math.random()]);
  return pts;
}

export function Swarm({ preset = "ring", count = 180, config = {}, color = "#3385f8", blend = "screen" }) {
  const ref = useRef();
  const cfgKey = useMemo(() => JSON.stringify(config), [config]);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const state = { parts: [], cx: 0.5, cy: 0.5, r: 0.32, rx: 0.38, ry: 0.32, ...config };
    const init = () => {
      const W = canvas.width, H = canvas.height;
      state.parts = [];
      for (let i = 0; i < count; i++) {
        const d = {
          a: (i / count) * Math.PI * 2 + Math.random() * 0.3,
          k: Math.random() * 10,
          b: 1.2 + Math.random() * 2.6,
          alpha: 0.5, size: 2,
          x: W * 0.5, y: H * 0.5, vx: 0, vy: 0,
          life: Math.random(),
          speed: 0.35 + Math.random() * 1.25,
        };
        if (config.targets && config.targets[i]) {
          d.tx = config.targets[i][0] * W;
          d.ty = config.targets[i][1] * H;
        }
        state.parts.push(d);
      }
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(2, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(2, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; init(); }
    };
    let raf, start = performance.now();
    const loop = (now) => {
      resize();
      const t = (now - start) / 1000;
      const fn = SWARM[preset];
      if (fn) fn(state, t, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      for (const d of state.parts) {
        ctx.globalAlpha = Math.max(0, Math.min(1, d.alpha));
        ctx.beginPath();
        ctx.arc(d.x, d.y, Math.max(0.2, d.size), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [preset, count, color, cfgKey]);
  return html`<canvas ref=${ref} style=${`width:100%;height:100%;display:block;mix-blend-mode:${blend}`}/>`;
}

/* =============================================================
   Agentic OS node graph (SVG, CSS-animated)
   ============================================================= */
export function AgenticGraph() {
  const W = 880, H = 780;
  const nodes = [
    { x: .18, y: .45, label: "Memo", kind: "core" },
    { x: .5, y: .22, label: "PM" },
    { x: .78, y: .14, label: "Dev" },
    { x: .88, y: .44, label: "Review" },
    { x: .82, y: .78, label: "Ops" },
    { x: .52, y: .86, label: "Market" },
    { x: .28, y: .78, label: "CEO", kind: "human" },
  ];
  const edges = [[0, 1], [0, 5], [1, 2], [2, 3], [3, 0], [0, 4], [4, 5], [5, 6], [6, 0], [1, 3]];
  return html`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:100%;overflow:visible">
    <defs>
      <radialGradient id="gNode"><stop offset="0" stop-color="#3385f8" stop-opacity=".6"/><stop offset="1" stop-color="#3385f8" stop-opacity="0"/></radialGradient>
      <linearGradient id="gEdge" x1="0" x2="1"><stop offset="0" stop-color="#3385f8" stop-opacity="0"/><stop offset=".5" stop-color="#3385f8" stop-opacity=".7"/><stop offset="1" stop-color="#3385f8" stop-opacity="0"/></linearGradient>
    </defs>
    <style>
      .edge{stroke:url(#gEdge);stroke-width:1.2;fill:none;stroke-dasharray:6 8;animation:flow 3.5s linear infinite}
      .edge.b{animation-duration:4.8s}
      .edge.c{animation-duration:2.8s}
      @keyframes flow{to{stroke-dashoffset:-56}}
      .halo{animation:halo 2.8s ease-in-out infinite}
      @keyframes halo{0%,100%{r:30;opacity:.35}50%{r:42;opacity:.55}}
      .halo.a{animation-delay:.4s}.halo.b{animation-delay:1.1s}.halo.c{animation-delay:1.7s}
      .core{animation:coreP 2.4s ease-in-out infinite}
      @keyframes coreP{0%,100%{r:11}50%{r:14}}
      .pkt{animation:pkt 3.4s linear infinite}
      @keyframes pkt{to{offset-distance:100%}}
    </style>
    ${edges.map(([a, b], i) => html`<line key=${i} class=${"edge " + "abc"[i % 3]}
      x1=${nodes[a].x * W} y1=${nodes[a].y * H} x2=${nodes[b].x * W} y2=${nodes[b].y * H}/>`)}
    ${nodes.map((n, i) => html`<g key=${i} transform=${`translate(${n.x * W}, ${n.y * H})`}>
      <circle class=${"halo " + "abc"[i % 3]} r="32" fill="url(#gNode)"/>
      <circle class=${n.kind === "core" ? "core" : ""} r=${n.kind === "core" ? 11 : 7}
        fill=${n.kind === "human" ? "#f7f8f8" : n.kind === "core" ? "#3385f8" : "#71aefe"}/>
      <text y="30" text-anchor="middle" fill="#8a8f98" font-family="JetBrains Mono" font-size="13" letter-spacing="0.04em">${n.label}</text>
    </g>`)}
  </svg>`;
}

/* =============================================================
   Live demo flow — simple animated step highlight
   ============================================================= */
export function useActiveStep(count, period = 900) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % count), period);
    return () => clearInterval(id);
  }, [count, period]);
  return i;
}

/* =============================================================
   SCENES
   ============================================================= */
function CornerMark() {
  return html`<div class="corner-mark">
    <img class="lg" src="assets/sprintable-logo-square.png" alt="Sprintable"/>
    <span>sprintable</span>
    <span class="sep">·</span>
    <span>OpenAI Showcase</span>
  </div>`;
}
function CornerFoot({ i, total, label }) {
  return html`<div class="corner-foot">
    <span>${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")} · ${label}</span>
    <span>뭉클랩 · 윤도선</span>
  </div>`;
}

/* ---------- Slide 1: Cover ---------- */
function SceneCover() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="aurora"/></div>
    <div class="fg"><${Swarm} preset="ring" count=${220} config=${{ cx: 0.5, cy: 0.58, r: 0.32 }}/></div>
    <div class="tx cover">
      <div class="cover-top">
        <img class="cover-mark" src="assets/sprintable-logo-square.png" alt="Sprintable"/>
        <span class="cover-word">sprintable</span>
        <div class="cover-top-right">
          <div class="b">OpenAI Korea Showcase · 2026</div>
          <div>10 min · 뭉클랩 · 윤도선</div>
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
          <span><span class="k">WHEN</span>10 min showcase</span>
          <span><span class="k">STRUCTURE</span>① Build · ② How · ③ Demo · ④ Ask</span>
        </div>
      </div>
    </div>
  </div>`;
}

/* ---------- Slide 2: Opening Hook ---------- */
function SceneHook() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="tension"/></div>
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
    <${CornerMark}/>
    <${CornerFoot} i=${1} total=${16} label="Opening"/>
  </div>`;
}

/* ---------- Slide 3: Section 01 Divider ---------- */
function Divider({ idx, total = 4, title, sub, label }) {
  const num = String(idx).padStart(2, "0");
  const targets = useMemo(() => sampleTextTargets(num, "700 420px 'Inter Variable', Inter, sans-serif", 320, 1.1), [num]);
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="grid"/></div>
    <div class="fg"><${Swarm} preset="converge" count=${targets.length}
      config=${{ targets, cx: 0.5, cy: 0.5 }}/></div>
    <div class="tx divider safe">
      <div class="divider-label">Section ${num} of 0${total}${label ? ` · ${label}` : ""}</div>
      <div class="divider-num">${num}<span class="slash">/</span><span class="total">0${total}</span></div>
      <h2 class="divider-title" dangerouslySetInnerHTML=${{ __html: title }}></h2>
      ${sub ? html`<p class="divider-sub">${sub}</p>` : null}
    </div>
    <div class="divider-progress">
      <span>WHAT · HOW · DEMO · ASK</span>
      <div class="track">
        ${Array.from({ length: total }).map((_, i) => {
    const cls = i < idx - 1 ? "seg done" : i === idx - 1 ? "seg active" : "seg";
    return html`<span key=${i} class=${cls}></span>`;
  })}
      </div>
    </div>
  </div>`;
}

/* ---------- Slide 4: What we're building ---------- */
function SceneWhat() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="deep"/></div>
    <div class="tx what">
      <div class="what-left">
        <div class="eyebrow"><span class="dot"></span>01 · What we're building</div>
        <h2 class="what-title">
          <span class="crossed">Chat</span> is not a system.<br/>
          We built an <span class="becomes">Agentic OS.</span>
        </h2>
        <p class="what-body">
          대부분의 팀은 <strong>디스코드/텔레그램 채팅창</strong>에서 에이전트에게 1:1로 업무를 지시합니다.
          에이전트가 3명, 5명으로 늘면 관리는 카오스가 되고 <strong>문맥(Context)은 휘발</strong>됩니다.
        </p>
        <div class="what-pillars">
          <div class="what-pillar"><div class="k">Philosophy</div><div class="v">BYOA<br/><span class="s">Bring Your Own Agents</span></div></div>
          <div class="what-pillar"><div class="k">Core Abstraction</div><div class="v">Single Source<br/>of Truth</div></div>
          <div class="what-pillar"><div class="k">Unit of Work</div><div class="v">Memo / Ticket<br/><span class="s">not chat threads</span></div></div>
          <div class="what-pillar"><div class="k">Target</div><div class="v">AI Native Team<br/><span class="s">2–50 operators</span></div></div>
        </div>
        <div class="what-slogan">
          <em>"Agents run the sprint. You review."</em><br/>
          에이전트가 실무를 달리고, 인간은 결재만 합니다.
        </div>
      </div>
      <div class="what-right">
        <${AgenticGraph}/>
      </div>
    </div>
    <${CornerMark}/>
    <${CornerFoot} i=${3} total=${16} label="What we're building"/>
  </div>`;
}

/* ---------- Arch flow diagram ---------- */
function ArchFlow() {
  return html`<div class="arch-flow">
    <svg viewBox="0 0 480 210" width="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="ah" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
          <path d="M0,0.5 L0,5.5 L6.5,3 z" fill="rgba(255,255,255,.25)"/>
        </marker>
        <marker id="ahb" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
          <path d="M0,0.5 L0,5.5 L6.5,3 z" fill="#3385f8"/>
        </marker>
        <style>
          /* Webhook flowing dashes */
          .wh-fwd{stroke-dasharray:8,4;animation:dash-fwd 1.4s linear infinite}
          .wh-bwd{stroke-dasharray:8,4;animation:dash-bwd 1.4s linear infinite}
          @keyframes dash-fwd{to{stroke-dashoffset:-24}}
          @keyframes dash-bwd{to{stroke-dashoffset:-24}}
          /* Sequential node border highlights — 9s cycle */
          .sn-memo{animation:sn-memo 9s ease-in-out infinite}
          @keyframes sn-memo{0%,6%,30%,100%{stroke:rgba(255,255,255,.15)}10%,22%{stroke:rgba(255,255,255,.7);stroke-width:1.5}}
          .sn-sprint{animation:sn-sprint 9s ease-in-out infinite}
          @keyframes sn-sprint{0%,28%,55%,100%{stroke:rgba(51,133,248,.45)}33%,48%{stroke:#3385f8;stroke-width:2}}
          .sn-agent{animation:sn-agent 9s ease-in-out infinite}
          @keyframes sn-agent{0%,45%,72%,100%{stroke:rgba(39,166,68,.45)}50%,65%{stroke:#27a644;stroke-width:2}}
          .sn-reply{animation:sn-reply 9s ease-in-out infinite}
          @keyframes sn-reply{0%,63%,85%,100%{stroke:rgba(255,255,255,.15)}67%,80%{stroke:rgba(255,255,255,.6);stroke-width:1.5}}
          .sn-next{animation:sn-next 9s ease-in-out infinite}
          @keyframes sn-next{0%,78%,98%,100%{stroke:rgba(39,166,68,.3)}82%,94%{stroke:#4fc36a;stroke-width:2}}
          /* Webhook label brightness */
          .wl1{animation:wl1 9s ease-in-out infinite}
          @keyframes wl1{0%,28%,55%,100%{opacity:.35}33%,48%{opacity:1}}
          .wl2{animation:wl2 9s ease-in-out infinite}
          @keyframes wl2{0%,63%,85%,100%{opacity:.25}67%,80%{opacity:.9}}
        </style>
      </defs>
      <text x="95" y="12" text-anchor="middle" fill="#4d5259" font-family="JetBrains Mono,monospace" font-size="9" letter-spacing="0.08em">SPRINTABLE</text>
      <text x="385" y="12" text-anchor="middle" fill="#4d5259" font-family="JetBrains Mono,monospace" font-size="9" letter-spacing="0.08em">AGENT</text>
      <line x1="240" y1="6" x2="240" y2="204" stroke="rgba(255,255,255,.06)" stroke-width="1" stroke-dasharray="3,4"/>
      <rect x="20" y="18" width="150" height="28" rx="6" fill="rgba(20,22,26,.9)" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
      <text x="95" y="36" text-anchor="middle" fill="#8a8f98" font-family="JetBrains Mono,monospace" font-size="10">You / Agent</text>
      <line x1="95" y1="46" x2="95" y2="58" stroke="rgba(255,255,255,.2)" stroke-width="1.5" marker-end="url(#ah)"/>
      <rect class="sn-memo" x="20" y="60" width="150" height="34" rx="6" fill="rgba(20,22,26,.9)" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
      <text x="95" y="75" text-anchor="middle" fill="#c9cdd4" font-family="JetBrains Mono,monospace" font-size="10" font-weight="600">Create Memo</text>
      <text x="95" y="87" text-anchor="middle" fill="#8a8f98" font-family="JetBrains Mono,monospace" font-size="8.5">+ assign to agent</text>
      <line x1="95" y1="94" x2="95" y2="106" stroke="rgba(255,255,255,.2)" stroke-width="1.5" marker-end="url(#ah)"/>
      <rect class="sn-sprint" x="20" y="108" width="150" height="34" rx="6" fill="rgba(51,133,248,.1)" stroke="rgba(51,133,248,.45)" stroke-width="1"/>
      <text x="95" y="123" text-anchor="middle" fill="#3385f8" font-family="JetBrains Mono,monospace" font-size="10" font-weight="600">Sprintable</text>
      <text x="95" y="135" text-anchor="middle" fill="#3385f8" font-family="JetBrains Mono,monospace" font-size="8.5">fires webhook</text>
      <line class="wh-fwd" x1="170" y1="125" x2="308" y2="125" stroke="#3385f8" stroke-width="1.5" marker-end="url(#ahb)"/>
      <text class="wl1" x="240" y="120" text-anchor="middle" fill="#3385f8" font-family="JetBrains Mono,monospace" font-size="8" letter-spacing="0.1em">webhook</text>
      <rect class="sn-agent" x="310" y="108" width="150" height="34" rx="6" fill="rgba(39,166,68,.08)" stroke="rgba(39,166,68,.45)" stroke-width="1"/>
      <text x="385" y="123" text-anchor="middle" fill="#27a644" font-family="JetBrains Mono,monospace" font-size="10" font-weight="600">Agent wakes up</text>
      <text x="385" y="135" text-anchor="middle" fill="#27a644" font-family="JetBrains Mono,monospace" font-size="8.5">reads memo · MCP</text>
      <line x1="385" y1="142" x2="385" y2="154" stroke="rgba(255,255,255,.2)" stroke-width="1.5" marker-end="url(#ah)"/>
      <rect class="sn-reply" x="310" y="156" width="150" height="34" rx="6" fill="rgba(20,22,26,.9)" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
      <text x="385" y="171" text-anchor="middle" fill="#c9cdd4" font-family="JetBrains Mono,monospace" font-size="10" font-weight="600">Reply to memo</text>
      <text x="385" y="183" text-anchor="middle" fill="#8a8f98" font-family="JetBrains Mono,monospace" font-size="8.5">→ Sprintable webhook</text>
      <line class="wh-bwd" x1="310" y1="173" x2="172" y2="173" stroke="rgba(51,133,248,.55)" stroke-width="1.5" marker-end="url(#ahb)"/>
      <text class="wl2" x="240" y="168" text-anchor="middle" fill="rgba(51,133,248,.7)" font-family="JetBrains Mono,monospace" font-size="8" letter-spacing="0.1em">webhook</text>
      <rect class="sn-next" x="20" y="156" width="150" height="34" rx="6" fill="rgba(39,166,68,.05)" stroke="rgba(39,166,68,.3)" stroke-width="1"/>
      <text x="95" y="171" text-anchor="middle" fill="#4fc36a" font-family="JetBrains Mono,monospace" font-size="10">Next agent</text>
      <text x="95" y="183" text-anchor="middle" fill="#4fc36a" font-family="JetBrains Mono,monospace" font-size="8.5">wakes up</text>
    </svg>
  </div>`;
}

/* ---------- Slide 6a: How — Memo-Webhook Cycle ---------- */
function SceneHow1() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="deep"/></div>
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
        <div class="how-single-right">
          <${ArchFlow}/>
        </div>
      </div>
    </div>
    <${CornerMark}/>
    <${CornerFoot} i=${5} total=${16} label="How we use AI · 1/3"/>
  </div>`;
}

/* ---------- Slide 6b: How — Dynamic Rules ---------- */
function SceneHow2() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="deep"/></div>
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
    <${CornerMark}/>
    <${CornerFoot} i=${6} total=${16} label="How we use AI · 2/3"/>
  </div>`;
}

/* ---------- Slide 6c: How — Human-in-the-Loop ---------- */
function SceneHow3() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="deep"/></div>
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
    <${CornerMark}/>
    <${CornerFoot} i=${7} total=${16} label="How we use AI · 3/3"/>
  </div>`;
}

/* ---------- Slide 7: Our Story ---------- */
function SceneStory() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="aurora"/></div>
    <div class="tx story">
      <div class="story-left">
        <div class="eyebrow"><span class="dot"></span>Our Story · How we ship</div>
        <h2 class="story-title">
          AI로<br/><em>AI 관리 툴</em>을<br/>만들었습니다.
        </h2>
        <p class="story-body">
          Claude Code가 코드를 씁니다. 저희는 <strong>무엇을 만들지</strong>만 결정합니다.
          코딩 병목이 사라지자 — 새로운 병목이 보였습니다.
          에이전트를 <strong>지시하고, 문맥을 유지하고, 결과를 검토하는 것</strong>.
          그게 Sprintable의 시작이었습니다.
        </p>
        <div class="story-insight">
          <em>"코딩은 AI가 해결했다.<br/>다음 병목은 오케스트레이션이다."</em>
        </div>
      </div>
      <div class="story-right">
        <div class="story-stat">
          <span class="num">2<em>명</em></span>
          <div class="meta">
            <span class="lbl">Full-time Team</span>
            <span class="sub">뭉클랩 전체 인력</span>
          </div>
        </div>
        <div class="story-stat">
          <span class="num">6<em>주</em></span>
          <div class="meta">
            <span class="lbl">MVP to Demo</span>
            <span class="sub">아이디어 → 이 자리</span>
          </div>
        </div>
        <div class="story-stat">
          <span class="num">~80<em>%</em></span>
          <div class="meta">
            <span class="lbl">AI-written Code</span>
            <span class="sub">Claude Code 작성</span>
          </div>
        </div>
        <div class="story-badge">이 슬라이드 덱도 Claude Code가 코딩했습니다.</div>
      </div>
    </div>
    <${CornerMark}/>
    <${CornerFoot} i=${8} total=${16} label="Our Story"/>
  </div>`;
}

/* ---------- Slide: Meet the Agents ---------- */
function SceneAgents() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="deep"/></div>
    <div class="tx agents">
      <div class="agents-intro">
        <div class="scene-kicker">03 · Demo · 에이전트 소개</div>
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
    <${CornerMark}/>
    <${CornerFoot} i=${10} total=${16} label="Meet the Agents"/>
  </div>`;
}

/* ---------- Slide 8: Demo Lineup ---------- */
function mkDemoRender(steps, highs, activeAt) {
  return steps.map((s, i) => {
    if (s === "→") return html`<span key=${i} class="ar">→</span>`;
    if (s && s.type === "agent") {
      const roleClass = ({ PO: "po", Dev: "dev", QA: "qa" })[s.role] || "";
      const cls = ["flow-agent", i === activeAt ? "active" : ""].filter(Boolean).join(" ");
      return html`<div key=${i} class=${cls}>
        <img src=${s.photo} alt=${s.name}/>
        <span class="fa-name">${s.name}</span>
        <span class=${"fa-role " + roleClass}>${s.task || s.role}</span>
      </div>`;
    }
    const cls = ["step"];
    if (highs[i]) cls.push(highs[i]);
    if (i === activeAt) cls.push("active");
    return html`<span key=${i} class=${cls.join(" ")}>${s}</span>`;
  });
}

function SceneDemo1() {
  const steps = [
    { type: "agent", name: "Ortega", role: "PO", photo: "assets/ortega.webp" }, "→",
    { type: "agent", name: "Nwachukwu", role: "Dev", photo: "assets/didi.webp" }, "→",
    "GitHub PR", "→",
    { type: "agent", name: "Qasim", role: "QA", photo: "assets/qasim.webp" }, "→",
    "Done"
  ];
  const highs = { 4: "highlight", 8: "highlight" };
  const idx = useActiveStep(5, 950);
  const activeMap = [0, 2, 4, 6, 8];
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="radar"/></div>
    <div class="fg"><${Swarm} preset="radar" count=${180} config=${{ cx: 0.82, cy: 0.25 }}/></div>
    <div class="tx demo">
      <div class="safe" style="padding-bottom:8px">
        <div class="demo-kicker"><span class="live"></span>03 · Demo · 1 of 2</div>
        <h2 class="demo-title"><em>Demo</em> 01</h2>
      </div>
      <div class="demo-cards" style="grid-template-columns:1fr;margin-top:0;flex:0 0 500px">
        <div class="demo-card">
          <span class="num">DEMO 01 · DOGFOODING</span>
          <h3>Sprintable,<br/>self-building.</h3>
          <p>PM 에이전트가 버그를 찾아 할당 → 개발 에이전트가 <strong>GitHub PR</strong>을 올림 → 리뷰 에이전트가 검수 → 티켓이 <strong>자동으로 Done</strong>.</p>
          <div class="flow">${mkDemoRender(steps, highs, activeMap[idx])}</div>
        </div>
      </div>
    </div>
    <${CornerMark}/>
    <${CornerFoot} i=${11} total=${16} label="Demo 01 · Dogfooding"/>
  </div>`;
}

function SceneDemo2() {
  const steps = [
    "Cron", "→",
    { type: "agent", name: "Ortega", role: "PO", photo: "assets/ortega.webp", task: "Ticket · Story" }, "→",
    { type: "agent", name: "Ortega", role: "PO", photo: "assets/ortega.webp", task: "Planner · 초안" }, "→",
    "📱 Approve"
  ];
  const highs = { 8: "highlight" };
  const idx = useActiveStep(4, 1100);
  const activeMap = [0, 2, 4, 6, 8];
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="radar"/></div>
    <div class="fg"><${Swarm} preset="radar" count=${180} config=${{ cx: 0.82, cy: 0.25 }}/></div>
    <div class="tx demo">
      <div class="safe" style="padding-bottom:8px">
        <div class="demo-kicker"><span class="live"></span>03 · Demo · 2 of 2</div>
        <h2 class="demo-title"><em>Demo</em> 02</h2>
      </div>
      <div class="demo-cards" style="grid-template-columns:1fr;margin-top:0;flex:0 0 500px">
        <div class="demo-card">
          <span class="num">DEMO 02 · BUSINESS AUTOMATION</span>
          <h3>정부지원사업,<br/>자율 결재 요청.</h3>
          <p>크론잡 에이전트가 <strong>공고를 수집</strong>·티켓 생성 → 기획 에이전트가 초안 → <strong>대표에게 Review Required</strong>. 저는 폰에서 Approve만.</p>
          <div class="flow">${mkDemoRender(steps, highs, activeMap[idx])}</div>
        </div>
      </div>
    </div>
    <${CornerMark}/>
    <${CornerFoot} i=${12} total=${16} label="Demo 02 · Business Automation"/>
  </div>`;
}

/* ---------- Slide 10: Ask to OpenAI ---------- */
function SceneAsk() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="swarm"/></div>
    <div class="fg"><${Swarm} preset="starfield" count=${280} config=${{ cx: 0.55, cy: 0.5 }}/></div>
    <div class="tx ask">
      <div class="safe" style="padding-bottom:8px">
        <div class="eyebrow"><span class="dot"></span>04 · Ask to OpenAI</div>
        <div class="ask-thesis">
          <span class="label">Our Thesis</span>
          <p class="t">
            AI의 미래는 사용자와 직접 대화하는 챗봇 인터페이스를 넘어,
            백그라운드에서 시스템 간 웹훅과 API로 쉼 없이 소통하는
            <em>Headless Agent Swarm</em> — 보이지 않는 에이전트 군단으로 진화합니다.
          </p>
        </div>
        <h2 class="ask-title">두 가지 <em>질문</em>을 드립니다.</h2>
      </div>
      <div class="ask-grid">
        <div class="ask-card">
          <div class="num"><span class="q">?</span>Question 01 · Protocol</div>
          <h3>Agent-to-Agent<br/>Protocol.</h3>
          <p>모델이 <strong>다른 에이전트 시스템이나 외부 OS</strong> (Sprintable 같은)와 완벽히 동기화되기 위한 <strong>네이티브 웹훅 지원</strong>이나 <strong>MCP 같은 프로토콜 표준화</strong>를 향후 로드맵에서 어떻게 그리고 계신지 궁금합니다.</p>
          <div class="tags"><span class="tag">Native Webhooks</span><span class="tag">MCP</span><span class="tag">Interop</span></div>
        </div>
        <div class="ask-card">
          <div class="num"><span class="q">?</span>Question 02 · Context</div>
          <h3>Context<br/>Continuity.</h3>
          <p>여러 에이전트가 <strong>며칠에 걸쳐 티켓을 핑퐁</strong>하며 업무를 수행할 때, 장기 컨텍스트를 <strong>끊김 없이, 그리고 극도로 저렴하게</strong> 유지할 수 있는 아키텍처에 대해 OpenAI의 인사이트를 듣고 싶습니다.</p>
          <div class="tags"><span class="tag">Long-context</span><span class="tag">Cost curve</span><span class="tag">Persistence</span></div>
        </div>
      </div>
    </div>
    <${CornerMark}/>
    <${CornerFoot} i=${14} total=${16} label="Ask to OpenAI"/>
  </div>`;
}

/* ---------- Slide 16: Thanks · CTA ---------- */
function SceneThanks() {
  return html`<div class="scene">
    <div class="bg"><${ShaderBG} preset="bloom"/></div>
    <div class="fg"><${Swarm} preset="bloom" count=${240} config=${{}}/></div>
    <div class="tx thanks safe">
      <div class="thanks-kicker">End · Q&A · Contact</div>
      <h2 class="thanks-title">감사합니다.</h2>
      <div class="thanks-cta">
        <div class="thanks-cta-text">
          <p class="thanks-q">문의 해주세요.</p>
          <p class="thanks-sub">스파크랩 식구들에게 <strong>저렴하게</strong> 도와드려요.</p>
        </div>
        <div class="thanks-cta-row">
          <div class="thanks-contacts">
            <a class="contact-card" href="https://sprintable.ai">
              <div class="contact-label">PRODUCT</div>
              <div class="contact-value">sprintable.ai</div>
              <div class="contact-hint">제품 홈페이지</div>
            </a>
            <a class="contact-card" href="https://github.com/moonklabs/sprintable">
              <div class="contact-label">INSTALL</div>
              <div class="contact-value">github.com/moonklabs/sprintable</div>
              <div class="contact-hint">무료 설치 · Open Source</div>
            </a>
            <a class="contact-card" href="mailto:hello@moonklabs.com">
              <div class="contact-label">CONTACT</div>
              <div class="contact-value">hello@moonklabs.com</div>
              <div class="contact-hint">세일즈 · 파트너십 문의</div>
            </a>
          </div>
          <div class="thanks-qr">
            <img src="assets/qr-sprintable.png" alt="sprintable.ai QR"/>
            <span class="thanks-qr-label">sprintable.ai</span>
          </div>
        </div>
        <div class="thanks-lockup-row">
          <div class="thanks-lockup">
            <img class="mark" src="assets/sprintable-logo-square.png" alt="Sprintable"/>
            <div class="r">
              <span class="n">sprintable</span>
              <span>뭉클랩 · 윤도선</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <${CornerMark}/>
    <${CornerFoot} i=${15} total=${16} label="Thank you"/>
  </div>`;
}

/* =============================================================
   DECK — scene list + keyboard + HUD wiring
   ============================================================= */
const SCENES = [
  { id: "cover", label: "Cover", component: SceneCover },
  { id: "hook", label: "Opening Hook", component: SceneHook },
  { id: "div1", label: "§1 Divider", component: () => html`<${Divider} idx=${1} title='What we&rsquo;re <em>building.</em>' sub="현재 개발 중인 제품 — Sprintable." label="WHAT"/>` },
  { id: "what", label: "What we're building", component: SceneWhat },
  { id: "div2", label: "§2 Divider", component: () => html`<${Divider} idx=${2} title='How we <em>use AI.</em>' sub="에이전트는 챗봇이 아닙니다 — 독립적인 워크플로우의 주체입니다." label="HOW"/>` },
  { id: "how1", label: "How we use AI · 1", component: SceneHow1 },
  { id: "how2", label: "How we use AI · 2", component: SceneHow2 },
  { id: "how3", label: "How we use AI · 3", component: SceneHow3 },
  { id: "story", label: "Our Story", component: SceneStory },
  { id: "div3", label: "§3 Divider", component: () => html`<${Divider} idx=${3} title='Let&rsquo;s see it <em>in action.</em>' sub="백문이 불여일견 — 두 개의 데모." label="DEMO"/>` },
  { id: "agents", label: "Meet the Agents", component: SceneAgents },
  { id: "demo1", label: "Demo 01", component: SceneDemo1 },
  { id: "demo2", label: "Demo 02", component: SceneDemo2 },
  { id: "div4", label: "§4 Divider", component: () => html`<${Divider} idx=${4} title='Ask to <em>OpenAI.</em>' sub="오늘 이 방에서 얻고 싶은 두 가지 — 질문이자 피드백." label="ASK · The most important part"/>` },
  { id: "ask", label: "Ask to OpenAI", component: SceneAsk },
  { id: "thanks", label: "Thank you", component: SceneThanks },
];

const STORAGE_KEY = "sprintable-animated:idx";

function Deck() {
  const total = SCENES.length;
  const [i, setI] = useState(() => {
    const raw = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(raw) && raw >= 0 && raw < total ? raw : 0;
  });
  const goto = useCallback((n) => setI(Math.max(0, Math.min(total - 1, n))), [total]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(i)); } catch (e) { }
    const curr = document.getElementById("curr");
    const label = document.getElementById("label");
    const progress = document.getElementById("progress");
    if (curr) curr.textContent = String(i + 1).padStart(2, "0");
    if (label) label.textContent = SCENES[i].label;
    if (progress) progress.style.width = (((i + 1) / total) * 100) + "%";
  }, [i, total]);

  useEffect(() => {
    const total = SCENES.length;
    document.getElementById("total").textContent = String(total).padStart(2, "0");

    const onKey = (e) => {
      const t = e.target;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      let handled = true;
      if (k === "ArrowRight" || k === "PageDown" || k === " " || k === "Spacebar") goto(i + 1);
      else if (k === "ArrowLeft" || k === "PageUp") goto(i - 1);
      else if (k === "Home") goto(0);
      else if (k === "End") goto(total - 1);
      else if (k === "r" || k === "R") goto(0);
      else if (k === "f" || k === "F") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
      else if (/^[0-9]$/.test(k)) {
        const n = k === "0" ? 9 : parseInt(k) - 1;
        if (n < total) goto(n);
      }
      else handled = false;
      if (handled) e.preventDefault();
      if (handled) flashHUD();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goto, i]);

  useEffect(() => {
    const hud = document.getElementById("hud");
    const onClick = (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const a = btn.dataset.action;
      if (a === "prev") goto(i - 1);
      else if (a === "next") goto(i + 1);
      else if (a === "home") goto(0);
      else if (a === "end") goto(total - 1);
      else if (a === "full") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
      flashHUD();
    };
    hud.addEventListener("click", onClick);

    let hideT;
    const onMove = () => {
      flashHUD();
      clearTimeout(hideT);
      hideT = setTimeout(() => hud.removeAttribute("data-show"), 2400);
    };
    window.addEventListener("mousemove", onMove);
    onMove();
    return () => {
      hud.removeEventListener("click", onClick);
      window.removeEventListener("mousemove", onMove);
      clearTimeout(hideT);
    };
  }, [goto, i, total]);

  const Scene = SCENES[i].component;
  return html`<${Stage}><${Scene} key=${SCENES[i].id}/><//>`;
}

function flashHUD() {
  const hud = document.getElementById("hud");
  if (hud) hud.setAttribute("data-show", "");
}

render(html`<${Deck}/>`, document.getElementById("root"));
