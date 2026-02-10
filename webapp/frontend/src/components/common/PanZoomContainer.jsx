import { useRef, useState, useLayoutEffect, useEffect, useCallback } from 'react';

export default function PanZoomContainer({
  children,
  minScale = 0.1,
  maxScale = 8,
  className = '',
  padding = 24,
  wheelSensitivity = 0.25,
  pinchSensitivity = 0.25,
  smoothness = 0.3,
  panSpeed = 3.0,
  wheelMode = 'auto',
  scrollPanSpeed = 3.0,
  buttonZoomFactor = 1.25,
  buttonZoomFactorFast = 1.5,
  // Souris
  mouseZoomDampen = 0.018,
  clampDeltaY = 50,
}) {
  const viewportRef = useRef(null);
  const measureRef = useRef(null);
  const isInControls = (el) => !!(el && el.closest && el.closest('.kd-controls'));

  // États affichés
  const [scale, _setScale] = useState(1);
  const [tx, _setTx] = useState(0);
  const [ty, _setTy] = useState(0);

  // Réfs calculs + animation
  const scaleRef = useRef(1);
  const txRef = useRef(0);
  const tyRef = useRef(0);

  // Cibles animées
  const targetScaleRef = useRef(1);
  const targetTxRef = useRef(0);
  const targetTyRef = useRef(0);

  const rafRef = useRef(0);

  const setScale = (v) => {
    scaleRef.current = v;
    _setScale(v);
  };
  const setTx = (v) => {
    txRef.current = v;
    _setTx(v);
  };
  const setTy = (v) => {
    tyRef.current = v;
    _setTy(v);
  };

  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [vpSize, setVpSize] = useState({ w: 0, h: 0 });

  // Mesures
  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const update = () => {
      const prev = el.style.transform;
      el.style.transform = 'none';
      const rect = el.getBoundingClientRect();
      el.style.transform = prev || '';
      setNaturalSize({ w: rect.width, h: rect.height });

      const vp = viewportRef.current;
      if (vp) setVpSize({ w: vp.clientWidth, h: vp.clientHeight });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    const ro2 = new ResizeObserver(update);
    if (viewportRef.current) ro2.observe(viewportRef.current);

    return () => {
      ro.disconnect();
      ro2.disconnect();
    };
  }, []);

  // Fit initial
  useEffect(() => {
    if (!naturalSize.w || !naturalSize.h || !vpSize.w || !vpSize.h) return;
    fit(true);
  }, [naturalSize.w, naturalSize.h, vpSize.w, vpSize.h]);

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // Anime position/zoom vers la cible
  const animate = useCallback(() => {
    const s = scaleRef.current;
    const tx = txRef.current;
    const ty = tyRef.current;

    const ts = targetScaleRef.current;
    const ttx = targetTxRef.current;
    const tty = targetTyRef.current;

    const α = smoothness; // 0..1
    const ns = s + (ts - s) * α;
    const nx = tx + (ttx - tx) * α;
    const ny = ty + (tty - ty) * α;

    setScale(ns);
    setTx(nx);
    setTy(ny);

    if (Math.abs(ns - ts) > 1e-4 || Math.abs(nx - ttx) > 0.05 || Math.abs(ny - tty) > 0.05) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      setScale(ts);
      setTx(ttx);
      setTy(tty);
      rafRef.current = 0;
    }
  }, [smoothness]);

  const ensureAnimating = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const zoomToScaleAtPoint = (newScale, cx, cy) => {
    const curScale = scaleRef.current;
    newScale = clamp(newScale, minScale, maxScale);
    const k = newScale / curScale;

    const curTx = txRef.current;
    const curTy = tyRef.current;

    const nTx = cx - k * (cx - curTx);
    const nTy = cy - k * (cy - curTy);

    targetScaleRef.current = newScale;
    targetTxRef.current = nTx;
    targetTyRef.current = nTy;

    ensureAnimating();
  };

  const isTrackpadWheel = (e) => e.deltaMode === 0 && Math.abs(e.deltaY) < 4;

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onWheel = (e) => {
      if (isInControls(e.target)) return;
      e.preventDefault();
      e.stopPropagation();

      const rect = vp.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      let dX = e.deltaX;
      let dY = e.deltaY;
      if (e.deltaMode === 1) {
        dX *= 16;
        dY *= 16;
      } else if (e.deltaMode === 2) {
        dX *= vp.clientWidth;
        dY *= vp.clientHeight;
      }

      // --- ZOOM (pinch/ctrl) : adoucir la souris, garder le trackpad tel quel
      if (e.ctrlKey) {
        const isTrackpad = isTrackpadWheel(e);
        const sens = isTrackpad ? pinchSensitivity : pinchSensitivity * mouseZoomDampen;
        const dYc = clamp(dY, -clampDeltaY, clampDeltaY);
        const factor = Math.exp(-dYc * sens);
        const target = scaleRef.current * factor;
        zoomToScaleAtPoint(target, cx, cy);
        return;
      }

      // --- Mode "zoom" à la molette : même adoucissement pour souris
      if (wheelMode === 'zoom') {
        const isTrackpad = isTrackpadWheel(e);
        const sens = isTrackpad ? wheelSensitivity : wheelSensitivity * mouseZoomDampen;
        const dYc = clamp(dY, -clampDeltaY, clampDeltaY);
        const factor = Math.exp(-dYc * sens);
        const target = scaleRef.current * factor;
        zoomToScaleAtPoint(target, cx, cy);
        return;
      }

      // --- Par défaut : PAN au wheel/trackpad (deux doigts)
      const k = scrollPanSpeed;
      targetTxRef.current = txRef.current - dX * k;
      targetTyRef.current = tyRef.current - dY * k;
      ensureAnimating();
    };

    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, [wheelSensitivity, pinchSensitivity, wheelMode, scrollPanSpeed, mouseZoomDampen, clampDeltaY]);

  // Drag pan
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const onPointerDown = (e) => {
    if (isInControls(e.target)) return;
    if (e.button !== 0) return;
    e.preventDefault();
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    viewportRef.current.setPointerCapture(e.pointerId);
    viewportRef.current.style.cursor = 'grabbing';
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    if (isInControls(e.target)) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };

    targetTxRef.current = txRef.current + dx * panSpeed;
    targetTyRef.current = tyRef.current + dy * panSpeed;
    ensureAnimating();
  };

  const onPointerUp = (e) => {
    if (!dragging.current) return;
    if (isInControls(e.target)) return;
    dragging.current = false;
    try {
      viewportRef.current.releasePointerCapture(e.pointerId);
    } catch {
      /* empty */
    }
    viewportRef.current.style.cursor = 'grab';
  };

  const reset = () => {
    targetScaleRef.current = 1;
    const cw = naturalSize.w * 1;
    const ch = naturalSize.h * 1;
    targetTxRef.current = (vpSize.w - cw) / 2;
    targetTyRef.current = (vpSize.h - ch) / 2;
    ensureAnimating();
  };

  const fit = (immediate = false) => {
    if (!naturalSize.w || !naturalSize.h || !vpSize.w || !vpSize.h) return;
    const sx = (vpSize.w - 2 * padding) / naturalSize.w;
    const sy = (vpSize.h - 2 * padding) / naturalSize.h;
    const s = clamp(Math.min(sx, sy), minScale, maxScale);
    const cw = naturalSize.w * s;
    const ch = naturalSize.h * s;
    const nx = (vpSize.w - cw) / 2;
    const ny = (vpSize.h - ch) / 2;

    if (immediate) {
      setScale(s);
      setTx(nx);
      setTy(ny);
      targetScaleRef.current = s;
      targetTxRef.current = nx;
      targetTyRef.current = ny;
    } else {
      targetScaleRef.current = s;
      targetTxRef.current = nx;
      targetTyRef.current = ny;
      ensureAnimating();
    }
  };

  const zoomByButton = (sign = +1, evt = null) => {
    const factor = evt && (evt.shiftKey || evt.altKey) ? buttonZoomFactorFast : buttonZoomFactor;

    const centerX = vpSize.w / 2;
    const centerY = vpSize.h / 2;

    const target = scaleRef.current * (sign > 0 ? factor : 1 / factor);
    zoomToScaleAtPoint(target, centerX, centerY);
  };

  const zoomIn = (e) => zoomByButton(+1, e);
  const zoomOut = (e) => zoomByButton(-1, e);

  return (
    <div
      ref={viewportRef}
      className={`kd-panzoom relative overflow-hidden select-none ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        cursor: 'grab',
        touchAction: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        overscrollBehavior: 'contain',
      }}
    >
      <div className="kd-controls absolute z-10 top-2 right-2 flex gap-2 pointer-events-auto">
        <button type="button" onClick={zoomOut} className="px-2 py-1 bg-white/80 rounded">
          −
        </button>
        <button type="button" onClick={zoomIn} className="px-2 py-1 bg-white/80 rounded">
          +
        </button>
        <button type="button" onClick={reset} className="px-2 py-1 bg-white/80 rounded">
          Reset
        </button>
        <button type="button" onClick={() => fit(false)} className="px-2 py-1 bg-white/80 rounded">
          Fit
        </button>
      </div>

      <div
        style={{
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
        className="absolute top-0 left-0"
      >
        <div ref={measureRef} className="inline-block">
          {children}
        </div>
      </div>
    </div>
  );
}
