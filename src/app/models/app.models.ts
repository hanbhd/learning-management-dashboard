export type AssignmentStatus = 'Offen' | 'Gestartet' | 'Abgeschlossen';

export type CertificateStatus =
  'Nicht vorgesehen' | 'Noch nicht verfügbar' | 'Gültig';

export interface Course {
  id: string;
  title: string;
  targetGroup: string;
  description: string;
  moduleCount: number;
  duration: string;
  hasCertificate: boolean;
}

export interface Person {
  id: number;
  personName: string;
  jobRole: string;
  department: string;
}

export interface Assignment {
  id: number;
  personId: number;
  courseId: string;
  progress: number;
}

export interface StatusStatistic {
  label: AssignmentStatus;
  count: number;
  percent: number;
}

export interface DepartmentStatistic {
  label: string;
  completed: number;
  total: number;
  percent: number;
}
