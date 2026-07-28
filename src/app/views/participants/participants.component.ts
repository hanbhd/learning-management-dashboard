import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Person } from '../../models/app.models';
import { LearningManagementService } from '../../services/learning-management.service';

@Component({
  selector: 'app-participants',
  imports: [CommonModule, FormsModule],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.css',
})
export class ParticipantsComponent {
  formVisible = false;
  formError = '';

  editingPersonId: number | null = null;
  personPendingDeletion: Person | null = null;

  personName = '';
  jobRole = '';
  department = '';

  constructor(
    private readonly learningManagement: LearningManagementService,
  ) { }

  get people(): Person[] {
    return this.learningManagement.people;
  }

  get isEditing(): boolean {
    return this.editingPersonId !== null;
  }

  toggleForm(): void {
    if (this.formVisible) {
      this.closeForm();
      return;
    }

    this.formVisible = true;
    this.formError = '';
  }

  clearFormError(): void {
    this.formError = '';
  }

  startEditing(person: Person): void {
    this.formVisible = true;
    this.formError = '';
    this.editingPersonId = person.id;
    this.personName = person.personName;
    this.jobRole = person.jobRole;
    this.department = person.department;

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  savePerson(): void {
    const personName = this.personName.trim();
    const jobRole = this.jobRole.trim();
    const department = this.department.trim();

    this.formError = '';

    if (!personName || !jobRole || !department) {
      this.formError = 'Bitte füllen Sie alle Felder vollständig aus.';
      return;
    }

    const saved =
      this.editingPersonId !== null
        ? this.learningManagement.updatePerson({
          id: this.editingPersonId,
          personName,
          jobRole,
          department,
        })
        : this.learningManagement.createPerson({
          personName,
          jobRole,
          department,
        });

    if (!saved) {
      this.formError = 'Eine Person mit diesem Namen ist bereits vorhanden.';
      return;
    }

    this.closeForm();
  }

  requestDeletePerson(person: Person): void {
    this.personPendingDeletion = person;
  }

  cancelDeletePerson(): void {
    this.personPendingDeletion = null;
  }

  confirmDeletePerson(): void {
    if (!this.personPendingDeletion) {
      return;
    }

    this.learningManagement.deletePerson(this.personPendingDeletion);
    this.personPendingDeletion = null;
  }

  closeForm(): void {
    this.formVisible = false;
    this.resetForm();
  }

  private resetForm(): void {
    this.formError = '';
    this.editingPersonId = null;
    this.personName = '';
    this.jobRole = '';
    this.department = '';
  }
}
