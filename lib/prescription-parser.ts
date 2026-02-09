export interface Medication {
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface PrescriptionData {
  doctorName?: string;
  patientName?: string;
  date?: string;
  medications: Medication[];
  notes?: string;
}

/**
 * Parse prescription text extracted from OCR
 * This uses pattern matching to extract structured data from raw text
 */
export function parsePrescription(text: string): PrescriptionData {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const result: PrescriptionData = {
    medications: [],
  };

  // Common patterns for prescription parsing
  const patterns = {
    // Doctor name patterns
    doctor: [
      /(?:dr\.?|doctor)\s*[:\-]?\s*([a-z\s\.]+)/i,
      /(?:prescribed\s*by|physician)\s*[:\-]?\s*([a-z\s\.]+)/i,
      /([a-z]+\s*,?\s*(?:md|m\.d\.?|do|d\.o\.?))/i,
    ],

    // Patient name patterns
    patient: [
      /(?:patient|name)\s*[:\-]?\s*([a-z\s]+)/i,
      /(?:for|to)\s*[:\-]?\s*([a-z\s]+)/i,
    ],

    // Date patterns
    date: [
      /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,
      /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/,
      /(\w+\s+\d{1,2},?\s+\d{4})/i,
    ],

    // Dosage patterns (e.g., 500mg, 10ml, 2 tablets)
    dosage: /(\d+\s*(?:mg|ml|mcg|g|tablet|tab|capsule|cap|pill|drop|ml|units?))/i,

    // Frequency patterns
    frequency:
      /(\d+\s*(?:x|times?)\s*(?:daily|a\s*day|per\s*day)|(?:once|twice|thrice)\s*(?:daily|a\s*day)|(?:morning|evening|night|bedtime)|(?:before|after)\s*(?:meals?|food)|q\.?\d+[dh]?|b\.?i\.?d\.?|t\.?i\.?d\.?|q\.?i\.?d\.?)/i,

    // Duration patterns
    duration: /(\d+\s*(?:day|days|week|weeks|month|months|year|years?))/i,

    // Medication name indicators
    medicationIndicators: [
      /^\d+[\.\)]\s*/, // Numbered list
      /^[\*\-\•]\s*/, // Bullet points
    ],
  };

  // Extract doctor name
  for (const pattern of patterns.doctor) {
    const match = text.match(pattern);
    if (match) {
      result.doctorName = cleanName(match[1]);
      break;
    }
  }

  // Extract patient name
  for (const pattern of patterns.patient) {
    const match = text.match(pattern);
    if (match) {
      const potentialName = cleanName(match[1]);
      // Avoid picking up doctor name as patient name
      if (potentialName !== result.doctorName) {
        result.patientName = potentialName;
        break;
      }
    }
  }

  // Extract date
  for (const pattern of patterns.date) {
    const match = text.match(pattern);
    if (match) {
      result.date = match[1];
      break;
    }
  }

  // Extract medications
  const medications: Medication[] = [];
  let currentMed: Partial<Medication> = {};
  let isCollectingMedInfo = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // Skip lines that are likely headers or metadata
    if (
      lowerLine.includes("prescription") ||
      lowerLine.includes("rx") ||
      lowerLine.includes("date") ||
      lowerLine.includes("doctor") ||
      lowerLine.includes("patient") ||
      lowerLine.includes("name") ||
      lowerLine.includes("address") ||
      lowerLine.includes("phone") ||
      lowerLine.includes("license")
    ) {
      continue;
    }

    // Check if this line starts a new medication
    const isMedStart =
      patterns.medicationIndicators.some((p) => p.test(line)) ||
      (line.length > 2 &&
       line.length < 50 &&
       !line.match(patterns.dosage) &&
       !line.match(patterns.frequency) &&
       !line.match(patterns.duration) &&
       !isCollectingMedInfo);

    if (isMedStart && !isCollectingMedInfo) {
      // Save previous medication if exists
      if (currentMed.name) {
        medications.push(currentMed as Medication);
      }
      // Start new medication
      currentMed = {
        name: cleanMedicationName(line),
      };
      isCollectingMedInfo = true;
    } else if (isCollectingMedInfo) {
      // Try to extract additional info
      const dosageMatch = line.match(patterns.dosage);
      const frequencyMatch = line.match(patterns.frequency);
      const durationMatch = line.match(patterns.duration);

      if (dosageMatch && !currentMed.dosage) {
        currentMed.dosage = dosageMatch[1];
      } else if (frequencyMatch && !currentMed.frequency) {
        currentMed.frequency = frequencyMatch[1];
      } else if (durationMatch && !currentMed.duration) {
        currentMed.duration = durationMatch[1];
      } else if (
        line.length > 0 &&
        line.length < 100 &&
        !line.match(/^\d+[\.\)]/) &&
        !patterns.medicationIndicators.some((p) => p.test(line))
      ) {
        // Could be instructions or continuation of name
        if (!currentMed.instructions) {
          currentMed.instructions = line;
        } else {
          currentMed.instructions += " " + line;
        }
      }

      // Check if next line starts a new medication
      const nextLine = lines[i + 1];
      if (
        nextLine &&
        (patterns.medicationIndicators.some((p) => p.test(nextLine)) ||
          (nextLine.length > 2 &&
           nextLine.length < 50 &&
           !nextLine.match(patterns.dosage) &&
           !nextLine.match(patterns.frequency)))
      ) {
        isCollectingMedInfo = false;
        if (currentMed.name) {
          medications.push(currentMed as Medication);
          currentMed = {};
        }
      }
    }
  }

  // Don't forget the last medication
  if (currentMed.name) {
    medications.push(currentMed as Medication);
  }

  // If no medications found through structured parsing, try to extract any medicine-like words
  if (medications.length === 0) {
    const commonMeds = extractMedicationNames(text);
    for (const med of commonMeds) {
      medications.push({ name: med });
    }
  }

  result.medications = medications;

  // Extract any notes (lines after "notes" or "instructions")
  const notesMatch = text.match(/(?:notes?|instructions?|sig|directions?)[:\-]?\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
  if (notesMatch) {
    result.notes = notesMatch[1].trim();
  }

  return result;
}

function cleanName(name: string): string {
  return name
    .replace(/\s+/g, " ")
    .replace(/[,\.\-]+$/, "")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function cleanMedicationName(line: string): string {
  // Remove numbering and bullets
  return line
    .replace(/^\d+[\.\)]\s*/, "")
    .replace(/^[\*\-\•]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract potential medication names from text
 * This is a fallback when structured parsing fails
 */
function extractMedicationNames(text: string): string[] {
  const medications: string[] = [];
  const words = text.split(/[\s\n]+/);

  // Common medication name patterns
  const medPatterns = [
    /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/, // Capitalized words
    /\w*(?:cillin|mycin|zole|pram|pine|pril|sartan|statin|profen|azole|idine|olol)\w*/i, // Common suffixes
  ];

  for (let i = 0; i < words.length; i++) {
    const word = words[i].trim();
    if (
      word.length > 3 &&
      word.length < 30 &&
      !word.match(/^(the|and|for|with|from|take|daily|twice|once|every)$/i)
    ) {
      for (const pattern of medPatterns) {
        if (pattern.test(word) && !medications.includes(word)) {
          medications.push(word);
          break;
        }
      }
    }
  }

  return medications.slice(0, 10); // Limit to first 10 matches
}

/**
 * Validate if extracted prescription data seems reasonable
 */
export function validatePrescription(data: PrescriptionData): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (!data.medications || data.medications.length === 0) {
    warnings.push("No medications detected in the prescription");
  }

  if (!data.doctorName) {
    warnings.push("Doctor name not detected");
  }

  if (!data.patientName) {
    warnings.push("Patient name not detected");
  }

  return {
    isValid: warnings.length === 0,
    warnings,
  };
}
