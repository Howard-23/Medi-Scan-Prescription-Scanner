"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Pill,
  Calendar,
  User,
  Stethoscope,
  Clock,
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Sparkles,
  Package,
  Info,
  CheckCircle2,
  AlertTriangle,
  ClipboardList
} from "lucide-react";
import { PrescriptionData, Medication } from "@/lib/prescription-parser";

interface PrescriptionResultProps {
  prescription: PrescriptionData;
  rawText: string;
}

export function PrescriptionResult({ prescription, rawText }: PrescriptionResultProps) {
  const [showRawText, setShowRawText] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = formatPrescriptionText(prescription);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrescriptionText = (data: PrescriptionData) => {
    let text = "📋 PRESCRIPTION DETAILS\n";
    text += "=" .repeat(30) + "\n\n";
    if (data.doctorName) text += `👨‍⚕️ Doctor: ${data.doctorName}\n`;
    if (data.patientName) text += `👤 Patient: ${data.patientName}\n`;
    if (data.date) text += `📅 Date: ${data.date}\n`;
    text += "\n💊 MEDICATIONS:\n";
    text += "-" .repeat(20) + "\n";
    data.medications.forEach((med, i) => {
      text += `${i + 1}. ${med.name}\n`;
      if (med.dosage) text += `   Dosage: ${med.dosage}\n`;
      if (med.frequency) text += `   Frequency: ${med.frequency}\n`;
      if (med.duration) text += `   Duration: ${med.duration}\n`;
      if (med.instructions) text += `   Instructions: ${med.instructions}\n`;
      text += "\n";
    });
    if (data.notes) text += `\n📝 Notes: ${data.notes}\n`;
    return text;
  };

  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 animate-scale-in">
      <CardHeader className="bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-white border-b-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                Prescription Details
              </CardTitle>
              <p className="text-sm text-white/80 mt-0.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                AI Extracted Information
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="shrink-0 text-white hover:bg-white/20 hover:text-white"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="parsed" className="w-full">
          <TabsList className="w-full grid grid-cols-2 rounded-none bg-slate-50 dark:bg-slate-800/50 p-1 h-12">
            <TabsTrigger 
              value="parsed"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400 font-medium"
            >
              <Package className="h-4 w-4 mr-2" />
              Parsed Data
            </TabsTrigger>
            <TabsTrigger 
              value="raw"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm data-[state=active]:text-slate-600 dark:data-[state=active]:text-slate-300 font-medium"
            >
              <FileText className="h-4 w-4 mr-2" />
              Raw Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parsed" className="m-0">
            <div className="p-5 space-y-5">
              {/* Patient & Doctor Info */}
              {(prescription.doctorName || prescription.patientName || prescription.date) && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {prescription.doctorName && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-100 dark:border-violet-900">
                      <div className="p-2 rounded-lg bg-violet-500 text-white">
                        <Stethoscope className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider">Doctor</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{prescription.doctorName}</p>
                      </div>
                    </div>
                  )}
                  {prescription.patientName && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border border-cyan-100 dark:border-cyan-900">
                      <div className="p-2 rounded-lg bg-cyan-500 text-white">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Patient</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{prescription.patientName}</p>
                      </div>
                    </div>
                  )}
                  {prescription.date && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-100 dark:border-amber-900 sm:col-span-2">
                      <div className="p-2 rounded-lg bg-amber-500 text-white">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">Date</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{prescription.date}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Separator className="bg-slate-200 dark:bg-slate-700" />

              {/* Medications */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-gradient-to-br from-cyan-500 to-blue-500">
                    <Pill className="h-4 w-4 text-white" />
                  </div>
                  Medications
                  <Badge variant="secondary" className="ml-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {prescription.medications.length}
                  </Badge>
                </h4>
                
                {prescription.medications.length > 0 ? (
                  <div className="space-y-3">
                    {prescription.medications.map((med, index) => (
                      <MedicationCard key={index} medication={med} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      No medications detected
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      Check the raw text tab to see what was detected
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {prescription.notes && (
                <>
                  <Separator className="bg-slate-200 dark:bg-slate-700" />
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-900">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0">
                        <Info className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wider">
                          Additional Notes
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1.5 leading-relaxed">
                          {prescription.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="raw" className="m-0">
            <div className="p-5">
              <div className="bg-slate-900 rounded-xl p-4 overflow-auto max-h-[500px] border border-slate-800">
                <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {rawText || "No text detected"}
                </pre>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 text-center">
                This is the raw text extracted from your prescription image
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function MedicationCard({ medication, index }: { medication: Medication; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const hasDetails = medication.dosage || medication.frequency || medication.duration || medication.instructions;

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-950 card-hover">
      <div 
        className={`p-4 flex items-start justify-between cursor-pointer transition-colors ${
          hasDetails ? "hover:bg-slate-50 dark:hover:bg-slate-900" : ""
        }`}
        onClick={() => hasDetails && setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md shadow-cyan-500/20">
            {index + 1}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {medication.name}
            </p>
            {medication.dosage && (
              <p className="text-sm text-cyan-600 dark:text-cyan-400 mt-0.5 font-medium">
                {medication.dosage}
              </p>
            )}
          </div>
        </div>
        {hasDetails && (
          <Button variant="ghost" size="sm" className="shrink-0 h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {expanded && hasDetails && (
        <div className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="pt-4 space-y-3">
            {medication.dosage && (
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Pill className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dosage</p>
                  <p className="text-sm text-slate-800 dark:text-slate-200 mt-0.5">{medication.dosage}</p>
                </div>
              </div>
            )}
            {medication.frequency && (
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Frequency</p>
                  <p className="text-sm text-slate-800 dark:text-slate-200 mt-0.5">{medication.frequency}</p>
                </div>
              </div>
            )}
            {medication.duration && (
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Duration</p>
                  <p className="text-sm text-slate-800 dark:text-slate-200 mt-0.5">{medication.duration}</p>
                </div>
              </div>
            )}
            {medication.instructions && (
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Instructions</p>
                  <p className="text-sm text-slate-800 dark:text-slate-200 mt-0.5">{medication.instructions}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
