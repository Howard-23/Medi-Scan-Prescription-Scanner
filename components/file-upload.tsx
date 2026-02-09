"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, X, FileImage, Loader2 } from "lucide-react";
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
    <div key={file.name} className="text-sm text-red-500 mt-2">
      {errors.map((e) => (
        <p key={e.code}>{e.message}</p>
      ))}
    </div>
  ));

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 transition-all duration-200
            flex flex-col items-center justify-center text-center
            min-h-[250px] cursor-pointer
            ${
              isDragActive
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                : "border-slate-300 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600"
            }
            ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input {...getInputProps()} />
          <div
            className={`
            w-16 h-16 rounded-full flex items-center justify-center mb-4
            ${
              isDragActive
                ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400"
            }
          `}
          >
            <Upload className="h-8 w-8" />
          </div>
          <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
            {isDragActive ? "Drop the file here" : "Drag & drop your file"}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            or click to browse from your device
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Supports: JPG, PNG, WEBP (max 10MB)
          </p>
          {fileRejectionErrors}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border bg-slate-50 dark:bg-slate-900">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={preview}
                alt="Prescription preview"
                fill
                className="object-contain"
              />
            </div>
            <button
              onClick={handleClear}
              disabled={isProcessing}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClear}
              disabled={isProcessing}
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              onClick={handleProcess}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
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
