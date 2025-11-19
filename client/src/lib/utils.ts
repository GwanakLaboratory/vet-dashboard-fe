import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Patient, Visit, TestResult } from "@shared/schema"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculate patient age from birth date
export function getPatientAge(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Calculate patient statistics
export function getPatientStats(patient: Patient, visits: Visit[], testResults: TestResult[]) {
  const patientVisits = visits.filter(v => v.animalNumber === patient.animalNumber);
  const patientTests = testResults.filter(t => t.animalNumber === patient.animalNumber);
  
  const lastVisit = patientVisits.sort((a, b) => 
    new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
  )[0];
  
  const abnormalResults = patientTests.filter(t => t.status === "H" || t.status === "L").length;
  
  return {
    totalVisits: patientVisits.length,
    lastVisitDate: lastVisit?.visitDate || null,
    totalTests: patientTests.length,
    abnormalTests: abnormalResults,
    age: getPatientAge(patient.birthDate)
  };
}

// Get breed distribution
export function getBreedDistribution(patients: Patient[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  patients.forEach(patient => {
    const breed = patient.breed || "알 수 없음";
    distribution[breed] = (distribution[breed] || 0) + 1;
  });
  
  return distribution;
}

// Get gender distribution
export function getGenderDistribution(patients: Patient[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  patients.forEach(patient => {
    const gender = patient.gender || "알 수 없음";
    distribution[gender] = (distribution[gender] || 0) + 1;
  });
  
  return distribution;
}
