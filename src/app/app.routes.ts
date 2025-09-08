import { Routes } from '@angular/router';
import { DashboardList } from './features/dashboard/dashboard-list/dashboard-list';
import { CandidateDetail } from './features/dashboard/candidate-detail/candidate-detail';
import { LandingForm } from './features/landing/landing-form/landing-form';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'landing' },
  { path: 'landing', component: LandingForm },
  { path: 'landing/:id', component: LandingForm }, 
  { path: 'dashboard', component: DashboardList },
  { path: 'candidate/:id', component: CandidateDetail },
  { path: '**', redirectTo: 'dashboard' }
];
