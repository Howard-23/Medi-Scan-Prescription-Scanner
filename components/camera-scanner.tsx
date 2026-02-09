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
  Smartphone
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
            relative border-2 border-dashed rounded-xl p-8 transition-all duration-200
            flex flex-col items-center justify-center text-center
            min-h-[250px] cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600
            bg-slate-50 dark:bg-slate-900/50
          "
          onClick={() => !isProcessing && setIsCameraOpen(true)}
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-4">
            {isMobile ? (
              <Smartphone className="h-8 w-8 text-emerald-600" />
            ) : (
              <Camera className="h-8 w-8 text-emerald-600" />
            )}
          </div>
          <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
            {isMobile ? "Tap to Open Camera" : "Click to Open Camera"}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Scan prescription using your {isMobile ? "phone" : "webcam"}
          </p>
          {isMobile && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
              Optimized for mobile scanning
            </p>
          )}
        </Card>

        {/* Alternative option for mobile */}
        {isMobile && (
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Having trouble with camera?
            </p>
            <label className="cursor-pointer">
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
              <Button variant="outline" type="button" disabled={isProcessing}>
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{cameraError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="relative rounded-xl overflow-hidden bg-black">
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
          <div className="absolute inset-0 border-2 border-white/30 m-8 rounded-lg">
            {/* Corner markers */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 -mt-1 -ml-1" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 -mt-1 -mr-1" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 -mb-1 -ml-1" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 -mb-1 -mr-1" />
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsCameraOpen(false)}
          disabled={isProcessing}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Camera controls */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
          <button
            onClick={toggleCamera}
            disabled={isProcessing}
            className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors disabled:opacity-50"
          >
            <SwitchCamera className="h-6 w-6" />
          </button>

          <button
            onClick={handleCapture}
            disabled={isProcessing}
            className="p-4 rounded-full bg-white text-black hover:bg-slate-100 transition-colors disabled:opacity-50 shadow-lg"
          >
            {isProcessing ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <Scan className="h-8 w-8" />
            )}
          </button>

          <div className="w-12" /> {/* Spacer for alignment */}
        </div>
      </div>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Position the prescription within the frame and tap the capture button
      </p>
    </div>
  );
}
