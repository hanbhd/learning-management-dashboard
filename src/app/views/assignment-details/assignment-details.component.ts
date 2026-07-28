import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  Assignment,
  AssignmentStatus,
  CertificateStatus,
  Course,
  Person,
} from '../../models/app.models';
import { LearningManagementService } from '../../services/learning-management.service';
import {
  getAssignmentStatus,
  getCertificateStatus,
} from '../../utils/assignment.utils';

interface AssignmentDetails {
  assignment: Assignment;
  course: Course;
  person: Person;
}

@Component({
  selector: 'app-assignment-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './assignment-details.component.html',
  styleUrl: './assignment-details.component.css',
})
export class AssignmentDetailsComponent {
  private readonly assignmentId: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly learningManagement: LearningManagementService,
  ) {
    this.assignmentId = Number(this.route.snapshot.paramMap.get('id'));
  }

  get assignment(): Assignment | undefined {
    return this.learningManagement.assignments.find(
      (assignment) => assignment.id === this.assignmentId,
    );
  }

  get course(): Course | undefined {
    const assignment = this.assignment;

    return assignment
      ? this.learningManagement.courses.find(
          (course) => course.id === assignment.courseId,
        )
      : undefined;
  }

  get person(): Person | undefined {
    const assignment = this.assignment;

    return assignment
      ? this.learningManagement.people.find(
          (person) => person.id === assignment.personId,
        )
      : undefined;
  }

  get details(): AssignmentDetails | null {
    const assignment = this.assignment;
    const course = this.course;
    const person = this.person;

    return assignment && course && person
      ? {
          assignment,
          course,
          person,
        }
      : null;
  }

  get status(): AssignmentStatus {
    return getAssignmentStatus(this.assignment?.progress ?? 0);
  }

  get certificate(): CertificateStatus {
    const course = this.course;

    return course
      ? getCertificateStatus(course, this.status)
      : 'Nicht vorgesehen';
  }

  get certificateMessage(): string {
    if (this.certificate === 'Nicht vorgesehen') {
      return 'Für diesen Kurs ist kein Zertifikat vorgesehen.';
    }

    return this.certificate === 'Gültig'
      ? 'Das Zertifikat ist gültig.'
      : 'Das Zertifikat wird nach dem Kursabschluss verfügbar.';
  }

  get actionLabel(): string {
    if (this.status === 'Offen') {
      return 'Kurs starten';
    }

    if (this.status === 'Gestartet') {
      return 'Kurs abschließen';
    }

    return 'Kurs abgeschlossen';
  }

  handleCourseAction(): void {
    if (!this.assignment) {
      return;
    }

    if (this.status === 'Offen') {
      this.learningManagement.startAssignment(this.assignmentId);
      return;
    }

    if (this.status === 'Gestartet') {
      this.learningManagement.completeAssignment(this.assignmentId);
    }
  }

  deleteAssignment(): void {
    if (!this.assignment) {
      return;
    }

    this.learningManagement.deleteAssignment(this.assignmentId);
    void this.router.navigate(['/assignments']);
  }
}
