import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Assignment, Course, Person } from '../../models/app.models';
import { LearningManagementService } from '../../services/learning-management.service';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent {
  selectedCourse: Course | null = null;
  selectedPersonId: number | null = null;
  selectedCourseToDelete: Course | null = null;

  courseFormVisible = false;
  courseFormError = '';

  newCourseTitle = '';
  newCourseTargetGroup = '';
  newCourseDescription = '';
  newCourseModuleCount = 1;
  newCourseDuration = '';
  newCourseHasCertificate = false;

  constructor(
    private readonly learningManagement: LearningManagementService,
    private readonly router: Router,
  ) { }

  get courses(): Course[] {
    return this.learningManagement.courses;
  }

  get people(): Person[] {
    return this.learningManagement.people;
  }

  get assignments(): Assignment[] {
    return this.learningManagement.assignments;
  }

  openCourseForm(): void {
    this.closeAssignmentModal();
    this.closeDeleteModal();
    this.resetCourseForm();
    this.courseFormVisible = true;
  }

  closeCourseForm(): void {
    this.courseFormVisible = false;
    this.resetCourseForm();
  }

  createCourse(): void {
    const title = this.newCourseTitle.trim();
    const targetGroup = this.newCourseTargetGroup.trim();
    const description = this.newCourseDescription.trim();
    const duration = this.newCourseDuration.trim();
    const moduleCount = Number(this.newCourseModuleCount);

    if (
      !title ||
      !targetGroup ||
      !description ||
      !duration ||
      !Number.isInteger(moduleCount) ||
      moduleCount < 1 ||
      moduleCount > 100
    ) {
      return;
    }

    const created = this.learningManagement.createCourse({
      title,
      targetGroup,
      description,
      moduleCount,
      duration,
      hasCertificate: this.newCourseHasCertificate,
    });

    if (!created) {
      this.courseFormError = 'Ein Kurs mit diesem Titel ist bereits vorhanden.';
      return;
    }

    this.closeCourseForm();
  }

  openAssignmentModal(course: Course): void {
    this.closeCourseForm();
    this.closeDeleteModal();
    this.selectedCourse = course;
    this.selectedPersonId = null;
  }

  closeAssignmentModal(): void {
    this.selectedCourse = null;
    this.selectedPersonId = null;
  }

  isAlreadyAssigned(courseId: string, personId: number): boolean {
    return this.assignments.some(
      (assignment) =>
        assignment.courseId === courseId && assignment.personId === personId,
    );
  }

  createAssignment(): void {
    if (!this.selectedCourse || this.selectedPersonId === null) {
      return;
    }

    const assignment = this.learningManagement.createAssignment({
      courseId: this.selectedCourse.id,
      personId: this.selectedPersonId,
    });

    if (!assignment) {
      return;
    }

    this.closeAssignmentModal();
    void this.router.navigate(['/assignments']);
  }

  openDeleteModal(course: Course): void {
    this.closeCourseForm();
    this.closeAssignmentModal();
    this.selectedCourseToDelete = course;
  }

  closeDeleteModal(): void {
    this.selectedCourseToDelete = null;
  }

  confirmCourseDeletion(): void {
    if (!this.selectedCourseToDelete) {
      return;
    }

    this.learningManagement.deleteCourse(this.selectedCourseToDelete.id);
    this.closeDeleteModal();
  }

  getAssignmentCount(courseId: string): number {
    return this.assignments.filter(
      (assignment) => assignment.courseId === courseId,
    ).length;
  }

  clearCourseFormError(): void {
    this.courseFormError = '';
  }

  private resetCourseForm(): void {
    this.courseFormError = '';
    this.newCourseTitle = '';
    this.newCourseTargetGroup = '';
    this.newCourseDescription = '';
    this.newCourseModuleCount = 1;
    this.newCourseDuration = '';
    this.newCourseHasCertificate = false;
  }
}
