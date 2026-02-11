"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Camera, 
  SwitchCamera, 
  X, 
  Scan, 
  Loader2,
  AlertCircle,
  Smartphone,
  Zap,
  Aperture,
  Focus
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import dynamic from "next/dynamic";

// Dynamically import react-webcam to avoid SSR issues
const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

interface CameraScannerProps {
  onImageCapture: (imageData: string) => void;
  isProcessing: boolean;
}

export function CameraScanner({ onImageCapture, isProcessing }: CameraScannerProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const webcamRef = useRef<any>(null);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  const videoConstraints = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: facingMode,
  };

  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onImageCapture(imageSrc);
        setIsCameraOpen(false);
      }
    }
  }, [webcamRef, onImageCapture]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleUserMediaError = () => {
    setCameraError(
      "Unable to access camera. Please ensure you have granted camera permissions and are using a secure connection (HTTPS or localhost)."
    );
  };

  const handleUserMedia = () => {
    setCameraError(null);
  };

  if (!isCameraOpen) {
    return (
      <div className="space-y-4">
        <Card
          className="
            relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300
            flex flex-col items-center justify-center text-center
            min-h-[280px] cursor-pointer overflow-hidden
            hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50/30 dark:hover:bg-violet-950/20
            bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800
          "
          onClick={() => !isProcessing && setIsCameraOpen(true)}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-dot-pattern opacity-30" />
          
          {/* Icon */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center mb-5 shadow-lg shadow-violet-500/30">
            {isMobile ? (
              <Smartphone className="h-10 w-10 text-white" />
            ) : (
              <Camera className="h-10 w-10 text-white" />
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <Zap className="h-3 w-3 text-white" />
            </div>
          </div>
          
          {/* Text */}
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 relative z-10">
            {isMobile ? "Tap to Open Camera" : "Click to Open Camera"}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 relative z-10">
            Scan prescription using your {isMobile ? "phone camera" : "webcam"}
          </p>
          
          {/* Mobile Badge */}
          {isMobile && (
            <span className="mt-4 px-3 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 relative z-10">
              <Aperture className="h-3 w-3 inline mr-1" />
              Optimized for mobile
            </span>
          )}
        </Card>

        {/* Alternative option for mobile */}
        {isMobile && (
          <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Having trouble with the camera?
            </p>
            <label className="cursor-pointer inline-block">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      onImageCapture(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                disabled={isProcessing}
              />
              <Button 
                variant="outline" 
                type="button" 
                disabled={isProcessing}
                className="border-violet-300 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-900/30"
              >
                <Camera className="mr-2 h-4 w-4" />
                Take Photo Directly
              </Button>
            </label>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cameraError ? (
        <Alert variant="destructive" className="border-red-300 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{cameraError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={1}
          videoConstraints={videoConstraints}
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
          className="w-full aspect-[4/3] object-cover"
        />

        {/* Camera Overlay Frame */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          
          {/* Scanning Frame */}
          <div className="absolute inset-0 border-2 border-white/20 m-10 rounded-xl">
            {/* Corner markers */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-cyan-400 -mt-1 -ml-1 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-cyan-400 -mt-1 -mr-1 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-cyan-400 -mb-1 -ml-1 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-cyan-400 -mb-1 -mr-1 rounded-br-lg" />
            
            {/* Scanning line animation */}
            <div 
              className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{
                animation: "scanMove 2s linear infinite"
              }}
            />
          </div>
          
          {/* Focus helper */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50">
            <Focus className="h-16 w-16 text-white/30" />
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsCameraOpen(false)}
          disabled={isProcessing}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all disabled:opacity-50 hover:scale-110 backdrop-blur-sm"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Camera controls */}
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6">
          <button
            onClick={toggleCamera}
            disabled={isProcessing}
            className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all disabled:opacity-50 hover:scale-110 backdrop-blur-sm"
          >
            <SwitchCamera className="h-6 w-6" />
          </button>

          <button
            onClick={handleCapture}
            disabled={isProcessing}
            className="relative p-5 rounded-full bg-white text-black hover:bg-slate-100 transition-all disabled:opacity-50 shadow-2xl hover:scale-105"
          >
            {isProcessing ? (
              <Loader2 className="h-10 w-10 animate-spin" />
            ) : (
              <>
                <Scan className="h-10 w-10" />
                <div className="absolute inset-0 rounded-full border-4 border-cyan-400 animate-ping opacity-30" />
              </>
            )}
          </button>

          <div className="w-14" />
        </div>
        
        {/* Instruction text */}
        <div className="absolute top-4 left-0 right-0 text-center">
          <p className="text-white/80 text-sm font-medium bg-black/30 inline-block px-4 py-1.5 rounded-full backdrop-blur-sm">
            Position prescription within the frame
          </p>
        </div>
      </div>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
        <Aperture className="h-4 w-4 text-violet-500" />
        Make sure the text is clearly visible and well-lit
      </p>
      
      {/* Global styles for scan animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanMove {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(200px); opacity: 0; }
        }
      `}} />
    </div>
  );
}
