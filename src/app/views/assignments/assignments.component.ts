import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  Assignment,
  AssignmentStatus,
  CertificateStatus,
  Course,
  Person,
} from '../../models/app.models';
import { LearningManagementService } from '../../services/learning-management.service';
import {
  ASSIGNMENT_STATUSES,
  getAssignmentStatus,
  getCertificateStatus,
} from '../../utils/assignment.utils';

@Component({
  selector: 'app-assignments',
  imports: [CommonModule, FormsModule],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.css',
})
export class AssignmentsComponent {
  readonly statusOptions = ASSIGNMENT_STATUSES;

  statusFilter: AssignmentStatus | 'Alle' = 'Alle';
  departmentFilter = 'Alle';
  jobRoleFilter = 'Alle';

  constructor(
    private readonly learningManagement: LearningManagementService,
    private readonly router: Router,
  ) { }

  get assignments(): Assignment[] {
    return this.learningManagement.assignments;
  }

  get courses(): Course[] {
    return this.learningManagement.courses;
  }

  get people(): Person[] {
    return this.learningManagement.people;
  }

  get departments(): string[] {
    const departments = this.assignments
      .map((assignment) => this.findPerson(assignment.personId)?.department)
      .filter((department): department is string => Boolean(department));

    return ['Alle', ...new Set(departments)];
  }

  get jobRoles(): string[] {
    const jobRoles = this.assignments
      .map((assignment) => this.findPerson(assignment.personId)?.jobRole)
      .filter((jobRole): jobRole is string => Boolean(jobRole));

    return ['Alle', ...new Set(jobRoles)];
  }

  get filteredAssignments(): Assignment[] {
    return this.assignments.filter((assignment) => {
      const person = this.findPerson(assignment.personId);

      if (!person) {
        return false;
      }

      if (
        this.statusFilter !== 'Alle' &&
        this.status(assignment) !== this.statusFilter
      ) {
        return false;
      }

      if (
        this.departmentFilter !== 'Alle' &&
        person.department !== this.departmentFilter
      ) {
        return false;
      }

      if (
        this.jobRoleFilter !== 'Alle' &&
        person.jobRole !== this.jobRoleFilter
      ) {
        return false;
      }

      return true;
    });
  }

  status(assignment: Assignment): AssignmentStatus {
    return getAssignmentStatus(assignment.progress);
  }

  certificate(assignment: Assignment): CertificateStatus {
    const course = this.findCourse(assignment.courseId);

    return course
      ? getCertificateStatus(course, this.status(assignment))
      : 'Nicht vorgesehen';
  }

  personName(personId: number): string {
    return this.findPerson(personId)?.personName ?? 'Unbekannte Person';
  }

  jobRole(personId: number): string {
    return this.findPerson(personId)?.jobRole ?? '–';
  }

  department(personId: number): string {
    return this.findPerson(personId)?.department ?? '–';
  }

  courseTitle(courseId: string): string {
    return this.findCourse(courseId)?.title ?? 'Unbekannter Kurs';
  }

  openAssignment(assignment: Assignment): void {
    void this.router.navigate(['/assignments', assignment.id]);
  }

  resetFilters(): void {
    this.statusFilter = 'Alle';
    this.departmentFilter = 'Alle';
    this.jobRoleFilter = 'Alle';
  }

  resetAll(): void {
    this.resetFilters();
    this.learningManagement.resetDemoData();
  }

  deleteAll(): void {
    this.resetFilters();
    this.learningManagement.deleteDemoData();
  }

  private findCourse(courseId: string): Course | undefined {
    return this.courses.find((course) => course.id === courseId);
  }

  private findPerson(personId: number): Person | undefined {
    return this.people.find((person) => person.id === personId);
  }
}
