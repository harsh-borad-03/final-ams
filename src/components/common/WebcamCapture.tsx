import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertCircle, Upload, VideoOff } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  currentPhoto: string;
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, currentPhoto }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && window.location.protocol !== 'https:') {
          throw new Error(`Camera is disabled on IP addresses (${window.location.hostname}). Please open http://localhost:3000 in your browser instead.`);
        }
        throw new Error('Camera API requires localhost or HTTPS connection.');
      }

      // Stop any existing stream before starting a new one
      stopCamera();

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
      } catch {
        // Fallback to basic generic video constraint
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;
      setIsStreaming(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => console.log('play autoplay error:', e));
        };
      }
    } catch (err: any) {
      console.warn('Webcam permission not granted or device unavailable:', err);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setCameraError('Permission Denied: Camera access is blocked by browser settings or site permissions.');
      } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
        setCameraError('No webcam hardware found. You can use "Simulate Snap" or "Upload File".');
      } else if (err?.name === 'NotReadableError' || err?.name === 'TrackStartError') {
        setCameraError('Camera is currently in use by another app (e.g. Zoom, Teams, Skype).');
      } else {
        setCameraError(err?.message || 'Webcam unavailable. You can use "Simulate Snap" or "Upload File".');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  // Ensure stream attaches whenever videoRef is mounted and isStreaming becomes true
  useEffect(() => {
    if (isStreaming && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((e) => console.log('stream attach play err:', e));
    }
  }, [isStreaming]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isStreaming) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const width = video.videoWidth || 300;
      const height = video.videoHeight || 300;
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (context) {
        // Mirror the captured image so it matches what the user saw on screen
        context.translate(width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
        stopCamera();
      }
    } else {
      // Demo simulated camera snapshot
      const samplePhotos = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      ];
      const randomPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
      onCapture(randomPhoto);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onCapture(ev.target.result as string);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
      <div className="relative w-48 h-48 rounded-2xl overflow-hidden bg-slate-900 border-2 border-indigo-500/40 shadow-xl flex items-center justify-center">
        {/* Video element is ALWAYS mounted to prevent React ref-attachment race condition */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 ${isStreaming ? 'block' : 'hidden'}`}
        />

        {/* Snapshot / Current Photo Image */}
        <img
          src={currentPhoto}
          alt="Visitor Snapshot"
          className={`w-full h-full object-cover ${!isStreaming ? 'block' : 'hidden'}`}
        />

        <canvas ref={canvasRef} className="hidden" />

        {isStreaming && (
          <span className="absolute top-2 right-2 px-2.5 py-1 text-[10px] font-bold bg-rose-500 text-white rounded-full animate-pulse flex items-center gap-1.5 shadow-lg shadow-rose-500/40 z-20">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" /> LIVE CAMERA
          </span>
        )}
      </div>

      {cameraError && (
        <div className="bg-amber-950/80 border border-amber-500/40 p-2.5 rounded-xl text-[11px] text-amber-200 flex flex-col gap-1 max-w-sm">
          <p className="font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {cameraError}
          </p>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="text-[10px] text-indigo-300 underline text-left hover:text-indigo-200"
          >
            {showHelp ? 'Hide permission guide' : '👉 How to allow camera in Chrome / Edge?'}
          </button>
          {showHelp && (
            <div className="mt-1 p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg text-[10px] text-slate-300 space-y-1.5 leading-relaxed">
              <p><strong>Option 1 (Microsoft Edge):</strong> Click the <strong>"View site information" icon (🎚️ sliders / tune or "Not secure")</strong> at the left of the address bar ➔ Set <strong>Camera</strong> to <strong>Allow</strong>.</p>
              <p><strong>Option 2 (Edge Direct Settings):</strong> Open a new tab, navigate to <code>edge://settings/content/camera</code> and make sure <code>http://localhost:3000</code> is allowed.</p>
              <p><strong>Option 3 (URL Check):</strong> Make sure you are visiting <code>http://localhost:3000</code> and NOT a network IP (e.g. <code>192.168.x.x</code>).</p>
              <p className="text-emerald-400">💡 <em>Tip: You can also simply click <strong>"Simulate Snap"</strong> or <strong>"Upload File"</strong> below to proceed without a camera!</em></p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {!isStreaming ? (
          <button
            type="button"
            onClick={startCamera}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/40 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Camera className="w-4 h-4" /> Start Live Camera
          </button>
        ) : (
          <button
            type="button"
            onClick={stopCamera}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <VideoOff className="w-4 h-4" /> Close Camera
          </button>
        )}

        <button
          type="button"
          onClick={capturePhoto}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" /> {isStreaming ? 'Snap Photo' : 'Simulate Snap'}
        </button>

        {/* Upload File Option */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <Upload className="w-4 h-4" /> Upload File
        </button>
      </div>
    </div>
  );
};
