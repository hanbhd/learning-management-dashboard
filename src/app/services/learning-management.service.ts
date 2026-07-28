import { Injectable } from '@angular/core';

import { COURSES, INITIAL_ASSIGNMENTS, PEOPLE } from '../data/demo-data';
import { Assignment, Course, Person } from '../models/app.models';
import { getAssignmentStatus } from '../utils/assignment.utils';

type CourseCreateData = Omit<Course, 'id'>;
type PersonCreateData = Omit<Person, 'id'>;

interface CourseAssignmentData {
  courseId: string;
  personId: number;
}

interface PersonUpdateData {
  id: number;
  personName: string;
  jobRole: string;
  department: string;
}

@Injectable({
  providedIn: 'root',
})
export class LearningManagementService {
  courses: Course[] = this.copyInitialCourses();
  people: Person[] = this.copyInitialPeople();
  assignments: Assignment[] = this.copyInitialAssignments();

  createCourse(request: CourseCreateData): boolean {
    const title = request.title.trim();

    const courseAlreadyExists = this.courses.some(
      (course) =>
        this.normalizeText(course.title) === this.normalizeText(title),
    );

    if (courseAlreadyExists) {
      return false;
    }

    const newCourse: Course = {
      id: this.createUniqueCourseId(title),
      title,
      targetGroup: request.targetGroup.trim(),
      description: request.description.trim(),
      moduleCount: request.moduleCount,
      duration: request.duration.trim(),
      hasCertificate: request.hasCertificate,
    };

    this.courses = [...this.courses, newCourse];

    return true;
  }

  deleteCourse(courseId: string): void {
    this.courses = this.courses.filter((course) => course.id !== courseId);

    this.assignments = this.assignments.filter(
      (assignment) => assignment.courseId !== courseId,
    );
  }

  createPerson(request: PersonCreateData): boolean {
    const personName = request.personName.trim();

    const personAlreadyExists = this.people.some(
      (person) =>
        this.normalizeText(person.personName) ===
        this.normalizeText(personName),
    );

    if (personAlreadyExists) {
      return false;
    }

    const newPerson: Person = {
      id: this.createNextPersonId(),
      personName,
      jobRole: request.jobRole.trim(),
      department: request.department.trim(),
    };

    this.people = [...this.people, newPerson];

    return true;
  }

  updatePerson(request: PersonUpdateData): boolean {
    const personName = request.personName.trim();
    const jobRole = request.jobRole.trim();
    const department = request.department.trim();

    const nameAlreadyExists = this.people.some(
      (person) =>
        person.id !== request.id &&
        this.normalizeText(person.personName) ===
        this.normalizeText(personName),
    );

    if (nameAlreadyExists) {
      return false;
    }

    this.people = this.people.map((person) =>
      person.id === request.id
        ? {
          ...person,
          personName,
          jobRole,
          department,
        }
        : person,
    );

    return true;
  }

  deletePerson(person: Person): void {
    this.people = this.people.filter((item) => item.id !== person.id);

    this.assignments = this.assignments.filter(
      (assignment) => assignment.personId !== person.id,
    );
  }

  createAssignment(request: CourseAssignmentData): Assignment | null {
    const personExists = this.people.some(
      (person) => person.id === request.personId,
    );

    const courseExists = this.courses.some(
      (course) => course.id === request.courseId,
    );

    const alreadyAssigned = this.assignments.some(
      (assignment) =>
        assignment.personId === request.personId &&
        assignment.courseId === request.courseId,
    );

    if (!personExists || !courseExists || alreadyAssigned) {
      return null;
    }

    const newAssignment: Assignment = {
      id: this.createNextAssignmentId(),
      personId: request.personId,
      courseId: request.courseId,
      progress: 0,
    };

    this.assignments = [...this.assignments, newAssignment];

    return newAssignment;
  }

  startAssignment(assignmentId: number): Assignment | null {
    const assignment = this.assignments.find(
      (item) => item.id === assignmentId,
    );

    if (!assignment || getAssignmentStatus(assignment.progress) !== 'Offen') {
      return null;
    }

    return this.updateAssignmentProgress(assignmentId, 1);
  }

  completeAssignment(assignmentId: number): Assignment | null {
    const assignment = this.assignments.find(
      (item) => item.id === assignmentId,
    );

    if (
      !assignment ||
      getAssignmentStatus(assignment.progress) === 'Abgeschlossen'
    ) {
      return null;
    }

    return this.updateAssignmentProgress(assignmentId, 100);
  }

  deleteAssignment(assignmentId: number): void {
    this.assignments = this.assignments.filter(
      (assignment) => assignment.id !== assignmentId,
    );
  }

  resetDemoData(): void {
    this.courses = this.copyInitialCourses();
    this.people = this.copyInitialPeople();
    this.assignments = this.copyInitialAssignments();
  }

  deleteDemoData(): void {
    this.courses = [];
    this.people = [];
    this.assignments = [];
  }

  private updateAssignmentProgress(
    assignmentId: number,
    progress: number,
  ): Assignment | null {
    let updatedAssignment: Assignment | null = null;

    this.assignments = this.assignments.map((assignment) => {
      if (assignment.id !== assignmentId) {
        return assignment;
      }

      updatedAssignment = {
        ...assignment,
        progress,
      };

      return updatedAssignment;
    });

    return updatedAssignment;
  }

  private createNextPersonId(): number {
    const highestId = Math.max(0, ...this.people.map((person) => person.id));

    return highestId + 1;
  }

  private createNextAssignmentId(): number {
    const highestId = Math.max(
      0,
      ...this.assignments.map((assignment) => assignment.id),
    );

    return highestId + 1;
  }

  private createUniqueCourseId(title: string): string {
    const normalizedTitle = title
      .toLocaleLowerCase('de-DE')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const baseId = normalizedTitle || 'kurs';

    let courseId = baseId;
    let suffix = 2;

    while (this.courses.some((course) => course.id === courseId)) {
      courseId = `${baseId}-${suffix}`;
      suffix += 1;
    }

    return courseId;
  }

  private normalizeText(value: string): string {
    return value.trim().toLocaleLowerCase('de-DE');
  }

  private copyInitialCourses(): Course[] {
    return COURSES.map((course) => ({
      ...course,
    }));
  }

  private copyInitialPeople(): Person[] {
    return PEOPLE.map((person) => ({
      ...person,
    }));
  }

  private copyInitialAssignments(): Assignment[] {
    return INITIAL_ASSIGNMENTS.map((assignment) => ({
      ...assignment,
    }));
  }
}
