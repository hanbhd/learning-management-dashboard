import { Assignment, Course, Person } from '../models/app.models';

export const COURSES: Course[] = [
  {
    id: 'compliance',
    title: 'Compliance Training',
    targetGroup: 'Alle Mitarbeitenden',
    description:
      'Grundlagen zu Datenschutz, Informationssicherheit und verbindlichen Unternehmensrichtlinien.',
    moduleCount: 4,
    duration: '45 Min.',
    hasCertificate: true,
  },
  {
    id: 'product-argumentation',
    title: 'Sales Enablement Essentials',
    targetGroup: 'Marketing & Sales',
    description:
      'Argumentationshilfen, Nutzenbotschaften und Gesprächsleitfäden für Kundentermine.',
    moduleCount: 3,
    duration: '35 Min.',
    hasCertificate: false,
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    targetGroup: 'Neue Mitarbeitende',
    description:
      'Ein strukturierter Einstieg in Prozesse, Tools und die wichtigsten ersten Aufgaben.',
    moduleCount: 5,
    duration: '60 Min.',
    hasCertificate: true,
  },
  {
    id: 'leadership',
    title: 'Leadership Essentials',
    targetGroup: 'Führungskräfte',
    description:
      'Orientierung zu Feedback, Teamkommunikation und verantwortungsvoller Lernbegleitung.',
    moduleCount: 4,
    duration: '50 Min.',
    hasCertificate: true,
  },
  {
    id: 'lms-reporting',
    title: 'LMS Reporting & Lernanalysen',
    targetGroup: 'Lernmanagement',
    description:
      'Auswertung von Lernständen, Abschlussquoten, Zertifikaten und Statusverteilungen.',
    moduleCount: 2,
    duration: '30 Min.',
    hasCertificate: false,
  },
  {
    id: 'digital-learning-essentials',
    title: 'KI im Digital Learning',
    targetGroup: 'Learning & Development',
    description:
      'Grundlagen zur Gestaltung verständlicher, nutzerorientierter und wirksamer digitaler Lernangebote.',
    moduleCount: 4,
    duration: '45 Min.',
    hasCertificate: true,
  },
];

export const PEOPLE: Person[] = [
  {
    id: 1,
    personName: 'Anna Schneider',
    jobRole: 'Sales Specialist',
    department: 'Sales',
  },
  {
    id: 2,
    personName: 'Max Richter',
    jobRole: 'Software Developer',
    department: 'IT',
  },
  {
    id: 3,
    personName: 'Laura Becker',
    jobRole: 'HR Specialist',
    department: 'HR',
  },
  {
    id: 4,
    personName: 'Jana Weber',
    jobRole: 'Team Lead',
    department: 'Management',
  },
  {
    id: 5,
    personName: 'Nico Braun',
    jobRole: 'Learning Manager',
    department: 'HR',
  },
  {
    id: 6,
    personName: 'Marie Schulte',
    jobRole: 'Marketing Manager',
    department: 'Marketing',
  },
  {
    id: 7,
    personName: 'Lara Hoffmann',
    jobRole: 'HR Specialist',
    department: 'HR',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 1,
    personId: 1,
    courseId: 'compliance',
    progress: 62,
  },
  {
    id: 2,
    personId: 2,
    courseId: 'compliance',
    progress: 100,
  },
  {
    id: 3,
    personId: 3,
    courseId: 'onboarding',
    progress: 48,
  },
  {
    id: 4,
    personId: 4,
    courseId: 'leadership',
    progress: 100,
  },
  {
    id: 5,
    personId: 5,
    courseId: 'lms-reporting',
    progress: 35,
  },
  {
    id: 6,
    personId: 6,
    courseId: 'product-argumentation',
    progress: 0,
  },
  {
    id: 7,
    personId: 7,
    courseId: 'digital-learning-essentials',
    progress: 55,
  },
];
