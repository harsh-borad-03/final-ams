import React, { useRef, useState } from 'react';
import { Eraser, CheckCircle2, PenTool } from 'lucide-react';

interface SignaturePadProps {
  onSaveSignature: (signatureDataUrl: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSaveSignature }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#6366f1';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (hasSigned && canvasRef.current) {
      onSaveSignature(canvasRef.current.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSigned(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5 text-indigo-400" /> Digital NDA Agreement Signature *
        </label>
        {hasSigned && (
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Signature Captured
          </span>
        )}
      </div>

      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-1">
        <canvas
          ref={canvasRef}
          width={400}
          height={120}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-28 bg-slate-950 rounded-xl cursor-crosshair touch-none"
        />
        {!hasSigned && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-600 font-medium italic">
            Sign inside this box using mouse or touch screen
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <button
          type="button"
          onClick={clearCanvas}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center gap-1 font-semibold"
        >
          <Eraser className="w-3.5 h-3.5" /> Clear Signature
        </button>
        <span className="text-slate-500">Legally binding physical access NDA record</span>
      </div>
    </div>
  );
};
