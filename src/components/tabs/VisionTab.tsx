import React, { useState, useRef } from 'react';
import {
  Eye,
  Camera,
  Upload,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Zap,
} from 'lucide-react';

export const VisionTab: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [promptInput, setPromptInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Webcam
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access denied or unequipped.');
      setCameraActive(false);
    }
  };

  // Capture Frame
  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setSelectedImage(dataUrl);
      setMimeType('image/jpeg');

      // Stop camera stream
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setCameraActive(false);
    }
  };

  // Send to Vision API
  const handleAnalyzeVision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage || loading) return;

    setLoading(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/friday/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType,
          prompt: promptInput || 'Analyze this image in detail as FRIDAY AI. Identify objects, extract text, and list key action items.',
        }),
      });

      const data = await res.json();
      setAnalysisResult(data.analysis || 'Vision analysis complete.');
    } catch (err: any) {
      setAnalysisResult(`[ERROR] Vision processing fault: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const presetVisionPrompts = [
    'Analyze object layout and visual aesthetics',
    'Extract and transcribe all text snippet (OCR)',
    'Identify potential code bugs or UI flaws',
    'Explain the technical flow or diagram',
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold font-mono text-white tracking-wide">
              FRIDAY VISION INTELLIGENCE
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Inspect screenshots, camera snapshots, technical diagrams, and documents using Gemini Vision AI.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Image Input & Camera Capture */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-sky-400">OPTICAL INPUT CANVAS</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-all border border-white/10"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
              <button
                type="button"
                onClick={startCamera}
                className="px-3 py-1.5 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono flex items-center gap-1.5 transition-all"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Camera</span>
              </button>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Camera Frame or Image Display Area */}
          <div className="relative w-full h-80 rounded-2xl bg-black/30 border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden">
            {cameraActive ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={captureCameraFrame}
                  className="absolute bottom-4 px-6 py-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-mono font-bold text-xs shadow-xl animate-pulse"
                >
                  CAPTURE SNAPSHOT
                </button>
              </div>
            ) : selectedImage ? (
              <img src={selectedImage} alt="Optical Input" className="w-full h-full object-contain p-2" />
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer text-center space-y-2 p-6"
              >
                <ImageIcon className="w-12 h-12 text-slate-500 mx-auto" />
                <p className="text-xs font-mono text-slate-300">
                  Click to upload screenshot/document or use Camera
                </p>
                <p className="text-[10px] font-mono text-slate-500">Supports PNG, JPG, WEBP</p>
              </div>
            )}
          </div>

          {/* Preset Prompts */}
          <div className="space-y-2">
            <p className="text-xs font-mono text-slate-400">Vision Analysis Tasks:</p>
            <div className="flex flex-wrap gap-2">
              {presetVisionPrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPromptInput(p)}
                  className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-sky-300 transition-all text-left backdrop-blur-md"
                >
                  + {p}
                </button>
              ))}
            </div>
          </div>

          {/* Form Submit */}
          <form onSubmit={handleAnalyzeVision} className="flex gap-2">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="What should FRIDAY look for in this image?..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 backdrop-blur-md"
            />
            <button
              type="submit"
              disabled={!selectedImage || loading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-40 text-white font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-lg shadow-sky-500/20"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>ANALYZE</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Vision Output Stream */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-sky-400">FRIDAY OPTICAL ANALYSIS REPORT</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center space-y-3 font-mono text-xs text-sky-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto" />
                <p>Processing visual vectors via Gemini 3.6 Flash...</p>
              </div>
            ) : analysisResult ? (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap backdrop-blur-md">
                {analysisResult}
              </div>
            ) : (
              <div className="p-12 text-center font-mono text-xs text-slate-500">
                Select or capture an image above and run vision analysis.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
