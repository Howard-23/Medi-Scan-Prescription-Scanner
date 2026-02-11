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
import { 
  ScanLine, 
  Upload, 
  Camera, 
  Pill, 
  AlertCircle, 
  Sparkles,
  Heart,
  Shield,
  Zap,
  CheckCircle2
} from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/20 bg-grid-pattern">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-violet-400/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-300/10 via-blue-300/10 to-violet-300/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 glass">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-500 text-white shadow-lg shadow-cyan-500/25 animate-pulse-glow">
              <Pill className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                MediScan
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Shield className="h-3 w-3 text-cyan-500" />
                Secure & Private
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="hidden sm:flex bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300 dark:border-amber-800">
              <Sparkles className="mr-1 h-3 w-3" />
              AI Powered
            </Badge>
            <Badge variant="outline" className="hidden sm:flex border-cyan-200 text-cyan-700 dark:border-cyan-800 dark:text-cyan-300">
              <Zap className="mr-1 h-3 w-3" />
              Free
            </Badge>
          </div>
        </div>
      </header>

      <div className="container relative py-8 md:py-12">
        {/* Hero Section */}
        <div className="mb-10 text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 text-cyan-800 dark:text-cyan-200 text-sm font-medium mb-6 border border-cyan-200 dark:border-cyan-800">
            <Heart className="h-4 w-4 text-rose-500" />
            Trusted by 10,000+ users
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
            Read Prescriptions{" "}
            <span className="gradient-text">Instantly</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload a prescription image or scan it using your camera. Our AI extracts and organizes medication details in seconds.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto animate-scale-in border-red-300 bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
          {/* Left Column - Input Methods */}
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                <TabsTrigger 
                  value="upload" 
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400 transition-all"
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">Upload File</span>
                  <span className="sm:hidden">Upload</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="camera" 
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400 transition-all"
                >
                  <Camera className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">Use Camera</span>
                  <span className="sm:hidden">Camera</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4">
                <Card className="border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-b border-cyan-100 dark:border-cyan-900">
                    <CardTitle className="flex items-center gap-2 text-cyan-900 dark:text-cyan-100">
                      <div className="p-2 rounded-lg bg-cyan-500 text-white">
                        <Upload className="h-5 w-5" />
                      </div>
                      Upload Prescription
                    </CardTitle>
                    <CardDescription className="text-cyan-700 dark:text-cyan-300">
                      Drag & drop or click to select your prescription image
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <FileUpload 
                      onImageCapture={handleImageCapture} 
                      isProcessing={isProcessing}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="camera" className="mt-4">
                <Card className="border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-b border-violet-100 dark:border-violet-900">
                    <CardTitle className="flex items-center gap-2 text-violet-900 dark:text-violet-100">
                      <div className="p-2 rounded-lg bg-violet-500 text-white">
                        <Camera className="h-5 w-5" />
                      </div>
                      Scan with Camera
                    </CardTitle>
                    <CardDescription className="text-violet-700 dark:text-violet-300">
                      Position the prescription within the frame and capture
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CameraScanner 
                      onImageCapture={handleImageCapture}
                      isProcessing={isProcessing}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Tips Card */}
            <Card className="mt-6 bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-cyan-950/20 dark:via-slate-900 dark:to-blue-950/20 border-cyan-200 dark:border-cyan-800 card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-cyan-800 dark:text-cyan-200 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Tips for Best Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-cyan-700 dark:text-cyan-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <ScanLine className="h-4 w-4 mt-0.5 shrink-0 text-cyan-500" />
                    Ensure good lighting and avoid shadows
                  </li>
                  <li className="flex items-start gap-2">
                    <ScanLine className="h-4 w-4 mt-0.5 shrink-0 text-cyan-500" />
                    Keep the prescription flat and fully visible
                  </li>
                  <li className="flex items-start gap-2">
                    <ScanLine className="h-4 w-4 mt-0.5 shrink-0 text-cyan-500" />
                    Use high resolution images when possible
                  </li>
                  <li className="flex items-start gap-2">
                    <ScanLine className="h-4 w-4 mt-0.5 shrink-0 text-cyan-500" />
                    Make sure text is clearly legible
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {prescription ? (
              <>
                <PrescriptionResult 
                  prescription={prescription} 
                  rawText={rawText}
                />
                <div className="mt-4 flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={handleReset}
                  >
                    Scan Another
                  </Button>
                  <Button 
                    className="flex-1 btn-gradient text-white border-0"
                    onClick={() => window.print()}
                  >
                    Print Results
                  </Button>
                </div>
              </>
            ) : (
              <Card className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-dashed border-2 border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-xl" />
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-violet-200/30 to-purple-200/30 rounded-full blur-xl" />
                
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 flex items-center justify-center mb-6 animate-float">
                    <ScanLine className="h-12 w-12 text-cyan-500 dark:text-cyan-400" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    AI
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  No Prescription Scanned Yet
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">
                  Upload an image or use your camera to scan a prescription. The extracted information will appear here.
                </p>
                
                {isProcessing && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-200 dark:border-cyan-900 border-t-cyan-500" />
                      <div className="absolute inset-0 animate-ping rounded-full h-10 w-10 border-2 border-cyan-400 opacity-20" />
                    </div>
                    <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                      Processing prescription...
                    </p>
                  </div>
                )}
                
                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Auto-detect medications
                  </Badge>
                  <Badge variant="secondary" className="bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Extract dosages
                  </Badge>
                </div>
              </Card>
            )}
          </div>
        </div>

        <Separator className="my-12 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />

        {/* Footer */}
        <footer className="text-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Pill className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">MediScan</span>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Prescription Reader &copy; {new Date().getFullYear()}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Powered by Tesseract.js OCR Engine
          </p>
          
          <div className="mt-6 p-4 max-w-2xl mx-auto rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900">
            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
              <strong className="flex items-center justify-center gap-1 mb-1">
                <AlertCircle className="h-3 w-3" />
                Medical Disclaimer
              </strong>
              This tool is for informational purposes only. Always consult with a healthcare professional or pharmacist before taking any medication. Verify all information with your doctor.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
