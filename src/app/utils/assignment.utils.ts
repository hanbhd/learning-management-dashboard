import {
  AssignmentStatus,
  CertificateStatus,
  Course,
} from '../models/app.models';

export const ASSIGNMENT_STATUSES: AssignmentStatus[] = [
  'Offen',
  'Gestartet',
  'Abgeschlossen',
];

export function getAssignmentStatus(progress: number): AssignmentStatus {
  if (progress <= 0) {
    return 'Offen';
  }

  if (progress >= 100) {
    return 'Abgeschlossen';
  }

  return 'Gestartet';
}

export function getCertificateStatus(
  course: Course,
  status: AssignmentStatus,
): CertificateStatus {
  if (!course.hasCertificate) {
    return 'Nicht vorgesehen';
  }

  return status === 'Abgeschlossen' ? 'Gültig' : 'Noch nicht verfügbar';
}
