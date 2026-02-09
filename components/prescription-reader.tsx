"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileUpload } from "@/components/file-upload";
import { CameraScanner } from "@/components/camera-scanner";
import { PrescriptionResult } from "@/components/prescription-result";
import { ScanLine, Upload, Camera, Pill, AlertCircle, Sparkles } from "lucide-react";
import { PrescriptionData, parsePrescription } from "@/lib/prescription-parser";

export default function PrescriptionReader() {
  const [activeTab, setActiveTab] = useState("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [prescription, setPrescription] = useState<PrescriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>("");

  const handleImageCapture = async (imageData: string) => {
    setIsProcessing(true);
    setError(null);
    setPrescription(null);
    
    try {
      const Tesseract = await import("tesseract.js");
      
      const result = await Tesseract.default.recognize(
        imageData,
        "eng",
        {
          logger: (m) => {
            console.log(m);
          },
        }
      );
      
      const text = result.data.text;
      setRawText(text);
      
      const parsed = parsePrescription(text);
      setPrescription(parsed);
      
    } catch (err) {
      console.error("OCR Error:", err);
      setError("Failed to process the image. Please try again with a clearer image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setPrescription(null);
    setError(null);
    setRawText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                MediScan
              </h1>
              <p className="text-xs text-muted-foreground">Prescription Reader</p>
            </div>
          </div>
          <Badge variant="secondary" className="hidden sm:flex">
            <Sparkles className="mr-1 h-3 w-3" />
            AI Powered
          </Badge>
        </div>
      </header>

      <div className="container py-8 md:py-12">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Read Prescriptions Instantly
          </h2>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Upload a prescription image or scan it using your camera. Our AI will extract and organize the medication details for you.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
          {/* Left Column - Input Methods */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Upload File</span>
                  <span className="sm:hidden">Upload</span>
                </TabsTrigger>
                <TabsTrigger value="camera" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <span className="hidden sm:inline">Scan with Camera</span>
                  <span className="sm:hidden">Scan</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-emerald-600" />
                      Upload Prescription
                    </CardTitle>
                    <CardDescription>
                      Supported formats: JPG, PNG, WEBP (max 10MB)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUpload 
                      onImageCapture={handleImageCapture} 
                      isProcessing={isProcessing}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="camera" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-emerald-600" />
                      Scan with Camera
                    </CardTitle>
                    <CardDescription>
                      Position the prescription within the frame and capture
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CameraScanner 
                      onImageCapture={handleImageCapture}
                      isProcessing={isProcessing}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Instructions Card */}
            <Card className="mt-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-100 dark:border-emerald-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  Tips for Best Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-emerald-700 dark:text-emerald-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <ScanLine className="h-4 w-4 mt-0.5 shrink-0" />
                    Ensure good lighting and avoid shadows
                  </li>
                  <li className="flex items-start gap-2">
                    <ScanLine className="h-4 w-4 mt-0.5 shrink-0" />
                    Keep the prescription flat and fully visible
                  </li>
                  <li className="flex items-start gap-2">
                    <ScanLine className="h-4 w-4 mt-0.5 shrink-0" />
                    Use high resolution images when possible
                  </li>
                  <li className="flex items-start gap-2">
                    <ScanLine className="h-4 w-4 mt-0.5 shrink-0" />
                    Make sure text is clearly legible
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div>
            {prescription ? (
              <>
                <PrescriptionResult 
                  prescription={prescription} 
                  rawText={rawText}
                />
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleReset}
                  >
                    Scan Another
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    onClick={() => window.print()}
                  >
                    Print Results
                  </Button>
                </div>
              </>
            ) : (
              <Card className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-dashed">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <ScanLine className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No Prescription Scanned
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                  Upload an image or use your camera to scan a prescription. The extracted information will appear here.
                </p>
                {isProcessing && (
                  <div className="mt-6 flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Processing prescription...
                    </p>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            MediScan Prescription Reader &copy; {new Date().getFullYear()}
          </p>
          <p className="mt-1">
            Powered by Tesseract.js OCR Engine
          </p>
          <p className="mt-4 text-xs max-w-xl mx-auto">
            <strong>Disclaimer:</strong> This tool is for informational purposes only. Always consult with a healthcare professional or pharmacist before taking any medication. Verify all information with your doctor.
          </p>
        </footer>
      </div>
    </div>
  );
}
