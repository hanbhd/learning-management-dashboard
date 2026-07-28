import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {
  Assignment,
  Course,
  DepartmentStatistic,
  Person,
  StatusStatistic,
} from '../../models/app.models';
import { LearningManagementService } from '../../services/learning-management.service';
import {
  ASSIGNMENT_STATUSES,
  getAssignmentStatus,
} from '../../utils/assignment.utils';

interface CourseStatistic {
  label: string;
  count: number;
  percent: number;
}

@Component({
  selector: 'app-reporting',
  imports: [CommonModule],
  templateUrl: './reporting.component.html',
  styleUrl: './reporting.component.css',
})
export class ReportingComponent {
  constructor(
    private readonly learningManagement: LearningManagementService,
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

  get statusStatistics(): StatusStatistic[] {
    return ASSIGNMENT_STATUSES.map((status) => {
      const count = this.assignments.filter(
        (assignment) => getAssignmentStatus(assignment.progress) === status,
      ).length;

      return {
        label: status,
        count,
        percent: this.percent(count, this.assignments.length),
      };
    });
  }

  get departmentStatistics(): DepartmentStatistic[] {
    const departments: string[] = [];

    this.assignments.forEach((assignment) => {
      const person = this.findPerson(assignment.personId);

      if (!person) {
        return;
      }

      if (!departments.includes(person.department)) {
        departments.push(person.department);
      }
    });

    departments.sort((firstDepartment, secondDepartment) =>
      firstDepartment.localeCompare(secondDepartment, 'de'),
    );

    return departments.map((department) => {
      const departmentAssignments = this.assignments.filter((assignment) => {
        const person = this.findPerson(assignment.personId);

        return person?.department === department;
      });

      const completed = departmentAssignments.filter(
        (assignment) =>
          getAssignmentStatus(assignment.progress) === 'Abgeschlossen',
      ).length;

      return {
        label: department,
        completed,
        total: departmentAssignments.length,
        percent: this.percent(completed, departmentAssignments.length),
      };
    });
  }

  get courseStatistics(): CourseStatistic[] {
    const sortedCourses = [...this.courses];

    sortedCourses.sort((firstCourse, secondCourse) =>
      firstCourse.title.localeCompare(secondCourse.title, 'de'),
    );

    return sortedCourses.map((course) => {
      const count = this.assignments.filter(
        (assignment) => assignment.courseId === course.id,
      ).length;

      return {
        label: course.title,
        count,
        percent: this.percent(count, this.assignments.length),
      };
    });
  }

  private findPerson(personId: number): Person | undefined {
    return this.people.find((person) => person.id === personId);
  }

  private percent(value: number, total: number): number {
    if (total === 0) {
      return 0;
    }

    return Math.round((value / total) * 100);
  }
}
