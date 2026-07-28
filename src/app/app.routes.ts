import { Routes } from '@angular/router';

import { AssignmentDetailsComponent } from './views/assignment-details/assignment-details.component';
import { AssignmentsComponent } from './views/assignments/assignments.component';
import { CoursesComponent } from './views/courses/courses.component';
import { HomeComponent } from './views/home/home.component';
import { ParticipantsComponent } from './views/participants/participants.component';
import { ReportingComponent } from './views/reporting/reporting.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'courses',
    component: CoursesComponent,
  },
  {
    path: 'participants',
    component: ParticipantsComponent,
  },
  {
    path: 'assignments',
    component: AssignmentsComponent,
  },
  {
    path: 'assignments/:id',
    component: AssignmentDetailsComponent,
  },
  {
    path: 'reporting',
    component: ReportingComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
