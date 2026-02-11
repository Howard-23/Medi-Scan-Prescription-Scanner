"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, X, FileImage, Loader2, ImagePlus, CheckCircle2, AlertTriangle } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onImageCapture: (imageData: string) => void;
  isProcessing: boolean;
}

export function FileUpload({ onImageCapture, isProcessing }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setPreview(result);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      },
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024, // 10MB
      disabled: isProcessing,
    });

  const handleClear = () => {
    setPreview(null);
  };

  const handleProcess = () => {
    if (preview) {
      onImageCapture(preview);
    }
  };

  const fileRejectionErrors = fileRejections.map(({ file, errors }) => (
    <div key={file.name} className="text-sm text-red-500 mt-2 flex items-center gap-1">
      <AlertTriangle className="h-4 w-4" />
      {errors.map((e) => (
        <span key={e.code}>{e.message}</span>
      ))}
    </div>
  ));

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300
            flex flex-col items-center justify-center text-center
            min-h-[280px] cursor-pointer overflow-hidden
            ${
              isDragActive
                ? "border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 scale-[1.02]"
                : "border-slate-300 dark:border-slate-600 hover:border-cyan-400 dark:hover:border-cyan-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
            }
            ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-dot-pattern opacity-50" />
          
          <input {...getInputProps()} />
          
          {/* Upload Icon */}
          <div
            className={`
              relative w-20 h-20 rounded-2xl flex items-center justify-center mb-5
              transition-all duration-300
              ${
                isDragActive
                  ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30 scale-110"
                  : "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-400"
              }
            `}
          >
            {isDragActive ? (
              <ImagePlus className="h-10 w-10" />
            ) : (
              <Upload className="h-10 w-10" />
            )}
            
            {/* Animated rings when dragging */}
            {isDragActive && (
              <>
                <div className="absolute inset-0 rounded-2xl border-2 border-white/50 animate-ping" />
                <div className="absolute -inset-2 rounded-3xl border border-cyan-400/30 animate-pulse" />
              </>
            )}
          </div>
          
          {/* Text Content */}
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 relative z-10">
            {isDragActive ? "Drop your file here" : "Drag & drop your prescription"}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 relative z-10">
            or click to browse from your device
          </p>
          
          {/* File Info Badge */}
          <div className="flex items-center gap-2 mt-4 relative z-10">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              JPG
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              PNG
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              WEBP
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">
              Max 10MB
            </span>
          </div>
          
          {fileRejectionErrors}
        </div>
      ) : (
        <div className="space-y-4 animate-scale-in">
          {/* Image Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 shadow-lg">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={preview}
                alt="Prescription preview"
                fill
                className="object-contain p-4"
              />
            </div>
            
            {/* Success Badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-medium flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Image ready
            </div>
            
            {/* Clear Button */}
            <button
              onClick={handleClear}
              disabled={isProcessing}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-all disabled:opacity-50 hover:scale-110 shadow-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 h-12"
              onClick={handleClear}
              disabled={isProcessing}
            >
              <X className="mr-2 h-4 w-4" />
              Change Image
            </Button>
            <Button
              className="flex-1 btn-gradient text-white border-0 h-12 font-semibold"
              onClick={handleProcess}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileImage className="mr-2 h-4 w-4" />
                  Read Prescription
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
