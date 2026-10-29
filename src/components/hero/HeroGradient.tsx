import { useEffect, useRef } from "react";

// Animated brand gradient for the home hero: navy, teal, sky and the gold of
// the CTA buttons, drawn by one WebGL fragment shader (no video, no images).
// Rendered at reduced resolution — the picture is soft anyway — and paused
// while the hero is off screen or the tab is hidden. It drifts slightly toward
// the pointer. With prefers-reduced-motion it draws a single still frame;
// without WebGL the CSS gradient on the wrapper shows instead.

const VERTEX = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const FRAGMENT = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.)*1.6;
 float tt=t*.06;vec2 q=vec2(fbm(p+tt),fbm(p+vec2(5.2,1.3)-tt));
 float f=fbm(p+2.2*q+(m-uv)*.35+tt*.5);
 vec3 navy=vec3(.02,.04,.11),teal=vec3(.03,.36,.42),sky=vec3(.22,.55,.9),gold=vec3(.96,.70,.22);
 vec3 c=mix(navy,teal,smoothstep(.2,.7,f));
 c=mix(c,sky,smoothstep(.55,.85,q.y)*.55);
 c=mix(c,gold,smoothstep(.62,.95,f*q.x*1.6)*.75);
 c*=1.-.55*smoothstep(.3,1.,1.15-uv.y)*smoothstep(0.,.6,1.-uv.x);
 gl_FragColor=vec4(c,1.);
}`;

const RESOLUTION = 0.6;

const HeroGradient = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.style.display = "none";
      return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(program, "r");
    const uT = gl.getUniformLocation(program, "t");
    const uM = gl.getUniformLocation(program, "m");

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * RESOLUTION;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const target = { x: 0.5, y: 0.5 };
    const mouse = { x: 0.5, y: 0.5 };
    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = 1 - (e.clientY - rect.top) / rect.height;
    };

    const draw = (seconds: number) => {
      mouse.x += (target.x - mouse.x) * 0.04;
      mouse.y += (target.y - mouse.y) * 0.04;
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, seconds + 20);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    ro.observe(canvas);
    if (reduced) {
      draw(0);
      return () => ro.disconnect();
    }

    let raf = 0;
    let visible = true;
    const t0 = performance.now();
    const tick = (now: number) => {
      draw((now - t0) / 1000);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{ background: "radial-gradient(120% 90% at 75% 20%, #0b5560 0%, #071a33 45%, #03060f 100%)" }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default HeroGradient;
