/* =========================
   Canvas Setup
========================= */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* =========================
   Basic Vector Math
========================= */
class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) { return new Vec2(this.x + v.x, this.y + v.y); }
    sub(v) { return new Vec2(this.x - v.x, this.y - v.y); }
    mul(s) { return new Vec2(this.x * s, this.y * s); }
    length() { return Math.hypot(this.x, this.y); }
    normalize() {
        const l = this.length() || 1;
        return new Vec2(this.x / l, this.y / l);
    }
}

/* =========================
   Control Points
========================= */
// Fixed endpoints
const P0 = new Vec2(120, canvas.height / 2);
const P3 = new Vec2(canvas.width - 120, canvas.height / 2);

// Dynamic middle points
let P1 = new Vec2(canvas.width / 2 - 180, canvas.height / 2);
let P2 = new Vec2(canvas.width / 2 + 180, canvas.height / 2);

// Spring targets
let targetP1 = new Vec2(P1.x, P1.y);
let targetP2 = new Vec2(P2.x, P2.y);

// Velocities
let v1 = new Vec2(0, 0);
let v2 = new Vec2(0, 0);

/* =========================
   Spring Physics
========================= */
const SPRING_K = 0.06;
const DAMPING = 0.88;

function applySpring(pos, vel, target) {
    const force = target.sub(pos).mul(SPRING_K);
    vel = vel.add(force).mul(DAMPING);
    pos = pos.add(vel);
    return { pos, vel };
}

/* =========================
   User Interaction
========================= */
canvas.addEventListener("mousemove", e => {
    const mx = e.clientX;
    const my = e.clientY;

    targetP1 = new Vec2((P0.x + mx) / 2, (P0.y + my) / 2);
    targetP2 = new Vec2((P3.x + mx) / 2, (P3.y + my) / 2);
});

/* =========================
   Bézier Math (Manual)
========================= */
function bezierPoint(t, p0, p1, p2, p3) {
    const u = 1 - t;
    return p0.mul(u*u*u)
        .add(p1.mul(3*u*u*t))
        .add(p2.mul(3*u*t*t))
        .add(p3.mul(t*t*t));
}

function bezierTangent(t, p0, p1, p2, p3) {
    const u = 1 - t;
    return p1.sub(p0).mul(3*u*u)
        .add(p2.sub(p1).mul(6*u*t))
        .add(p3.sub(p2).mul(3*t*t));
}

/* =========================
   Drawing Helpers
========================= */
function drawPoint(p, label, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#cbd5f5";
    ctx.font = "12px monospace";
    ctx.fillText(label, p.x + 8, p.y - 8);
}

function drawLine(a, b) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = "rgba(148,163,184,0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawTangent(p, t) {
    const d = t.normalize().mul(22);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + d.x, p.y + d.y);
    ctx.strokeStyle = "#38bdf8";
    ctx.stroke();
}

/* =========================
   Animation Loop
========================= */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update physics
    ({ pos: P1, vel: v1 } = applySpring(P1, v1, targetP1));
    ({ pos: P2, vel: v2 } = applySpring(P2, v2, targetP2));

    // Control lines
    drawLine(P0, P1);
    drawLine(P2, P3);

    // Draw Bézier curve
    ctx.beginPath();
    for (let t = 0; t <= 1; t += 0.01) {
        const p = bezierPoint(t, P0, P1, P2, P3);
        t === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = "#f8fafc";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Tangents
    for (let t = 0; t <= 1; t += 0.15) {
        drawTangent(
            bezierPoint(t, P0, P1, P2, P3),
            bezierTangent(t, P0, P1, P2, P3)
        );
    }

    // Points with labels
    drawPoint(P0, "P₀ (fixed)", "#22c55e");
    drawPoint(P1, "P₁", "#eab308");
    drawPoint(P2, "P₂", "#eab308");
    drawPoint(P3, "P₃ (fixed)", "#22c55e");

    requestAnimationFrame(animate);
}

animate();

