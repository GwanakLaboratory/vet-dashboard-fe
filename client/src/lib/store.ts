import { create } from 'zustand';
import type { Patient, Visit, TestResult, ExamMaster, QuestionnaireResponse, UserFilter, ClusterAnalysis } from '@shared/schema';

// ========================================
// Zustand Store for EMR Dashboard
// ========================================

interface EMRState {
  // Data States
  patients: Patient[];
  selectedPatient: Patient | null;
  visits: Visit[];
  testResults: TestResult[];
  examMaster: ExamMaster[];
  questionnaireResponses: QuestionnaireResponse[];
  userFilters: UserFilter[];
  clusterAnalysis: ClusterAnalysis[];
  
  // UI States
  sidebarCollapsed: boolean;
  selectedBodyPart: string | null;
  activeTab: string;
  filterCriteria: {
    breed?: string;
    ageMin?: number;
    ageMax?: number;
    examCategory?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  
  // Actions - Data
  setPatients: (patients: Patient[]) => void;
  setSelectedPatient: (patient: Patient | null) => void;
  setVisits: (visits: Visit[]) => void;
  setTestResults: (results: TestResult[]) => void;
  setExamMaster: (exams: ExamMaster[]) => void;
  setQuestionnaireResponses: (responses: QuestionnaireResponse[]) => void;
  setUserFilters: (filters: UserFilter[]) => void;
  setClusterAnalysis: (clusters: ClusterAnalysis[]) => void;
  
  // Actions - UI
  toggleSidebar: () => void;
  setSelectedBodyPart: (part: string | null) => void;
  setActiveTab: (tab: string) => void;
  setFilterCriteria: (criteria: Partial<EMRState['filterCriteria']>) => void;
  clearFilterCriteria: () => void;
  
  // Computed/Helper Actions
  getPatientAge: (patient: Patient) => number | null;
  getPatientTestResults: (animalNumber: string) => TestResult[];
  getPatientVisits: (animalNumber: string) => Visit[];
  getAbnormalTestCount: (animalNumber: string) => number;
}

export const useEMRStore = create<EMRState>((set, get) => ({
  // Initial States
  patients: [],
  selectedPatient: null,
  visits: [],
  testResults: [],
  examMaster: [],
  questionnaireResponses: [],
  userFilters: [],
  clusterAnalysis: [],
  
  sidebarCollapsed: false,
  selectedBodyPart: null,
  activeTab: 'home',
  filterCriteria: {},
  
  // Data Actions
  setPatients: (patients) => set({ patients }),
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  setVisits: (visits) => set({ visits }),
  setTestResults: (results) => set({ testResults: results }),
  setExamMaster: (exams) => set({ examMaster: exams }),
  setQuestionnaireResponses: (responses) => set({ questionnaireResponses: responses }),
  setUserFilters: (filters) => set({ userFilters: filters }),
  setClusterAnalysis: (clusters) => set({ clusterAnalysis: clusters }),
  
  // UI Actions
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSelectedBodyPart: (part) => set({ selectedBodyPart: part }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setFilterCriteria: (criteria) => set((state) => ({
    filterCriteria: { ...state.filterCriteria, ...criteria }
  })),
  clearFilterCriteria: () => set({ filterCriteria: {} }),
  
  // Helper Functions
  getPatientAge: (patient) => {
    if (!patient.birthDate) return null;
    const birth = new Date(patient.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  },
  
  getPatientTestResults: (animalNumber) => {
    return get().testResults.filter(result => result.animalNumber === animalNumber);
  },
  
  getPatientVisits: (animalNumber) => {
    return get().visits.filter(visit => visit.animalNumber === animalNumber);
  },
  
  getAbnormalTestCount: (animalNumber) => {
    return get().testResults.filter(
      result => result.animalNumber === animalNumber && (result.status === 'H' || result.status === 'L')
    ).length;
  },
}));
