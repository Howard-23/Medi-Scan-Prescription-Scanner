"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Check
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
    let text = "";
    if (data.doctorName) text += `Doctor: ${data.doctorName}\n`;
    if (data.patientName) text += `Patient: ${data.patientName}\n`;
    if (data.date) text += `Date: ${data.date}\n`;
    text += "\nMedications:\n";
    data.medications.forEach((med, i) => {
      text += `${i + 1}. ${med.name}\n`;
      if (med.dosage) text += `   Dosage: ${med.dosage}\n`;
      if (med.frequency) text += `   Frequency: ${med.frequency}\n`;
      if (med.duration) text += `   Duration: ${med.duration}\n`;
      if (med.instructions) text += `   Instructions: ${med.instructions}\n`;
      text += "\n";
    });
    if (data.notes) text += `\nNotes: ${data.notes}\n`;
    return text;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-b">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Pill className="h-5 w-5 text-emerald-600" />
              Prescription Details
            </CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Extracted from your prescription image
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="parsed" className="w-full">
          <TabsList className="w-full grid grid-cols-2 rounded-none">
            <TabsTrigger value="parsed">Parsed Data</TabsTrigger>
            <TabsTrigger value="raw">Raw Text</TabsTrigger>
          </TabsList>

          <TabsContent value="parsed" className="m-0">
            <div className="p-4 space-y-4">
              {/* Patient & Doctor Info */}
              {(prescription.doctorName || prescription.patientName || prescription.date) && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {prescription.doctorName && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                      <Stethoscope className="h-5 w-5 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Doctor</p>
                        <p className="text-sm font-medium">{prescription.doctorName}</p>
                      </div>
                    </div>
                  )}
                  {prescription.patientName && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                      <User className="h-5 w-5 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Patient</p>
                        <p className="text-sm font-medium">{prescription.patientName}</p>
                      </div>
                    </div>
                  )}
                  {prescription.date && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 sm:col-span-2">
                      <Calendar className="h-5 w-5 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Date</p>
                        <p className="text-sm font-medium">{prescription.date}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Separator />

              {/* Medications */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Pill className="h-4 w-4" />
                  Medications ({prescription.medications.length})
                </h4>
                
                {prescription.medications.length > 0 ? (
                  <div className="space-y-3">
                    {prescription.medications.map((med, index) => (
                      <MedicationCard key={index} medication={med} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
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
                  <Separator />
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                          Additional Notes
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
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
            <div className="p-4">
              <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 overflow-auto max-h-[500px]">
                <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mospace">
                  {rawText || "No text detected"}
                </pre>
              </div>
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
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
      <div 
        className="p-3 flex items-start justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
        onClick={() => hasDetails && setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <Badge variant="secondary" className="mt-0.5 shrink-0">
            {index + 1}
          </Badge>
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {medication.name}
            </p>
            {medication.dosage && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {medication.dosage}
              </p>
            )}
          </div>
        </div>
        {hasDetails && (
          <Button variant="ghost" size="sm" className="shrink-0 h-8 w-8 p-0">
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {expanded && hasDetails && (
        <div className="px-3 pb-3 pt-0 border-t bg-slate-50 dark:bg-slate-900">
          <div className="pt-3 space-y-2">
            {medication.dosage && (
              <div className="flex items-start gap-2">
                <Pill className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Dosage</p>
                  <p className="text-sm">{medication.dosage}</p>
                </div>
              </div>
            )}
            {medication.frequency && (
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Frequency</p>
                  <p className="text-sm">{medication.frequency}</p>
                </div>
              </div>
            )}
            {medication.duration && (
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Duration</p>
                  <p className="text-sm">{medication.duration}</p>
                </div>
              </div>
            )}
            {medication.instructions && (
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Instructions</p>
                  <p className="text-sm">{medication.instructions}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
