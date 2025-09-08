import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CandidateService } from '../../../core/services/candidate.service';
import { CandidateCard } from '../candidate-card/candidate-card';
import { Candidate } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-dashboard-list',
  imports: [
    CommonModule,
    FormsModule,
    CandidateCard,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './dashboard-list.html',
  styleUrl: './dashboard-list.scss'
})
export class DashboardList {
  private readonly candidatesService = inject(CandidateService);
  protected readonly candidates = signal<Candidate[]>(this.candidatesService.getAll());

  protected readonly nameQuery = signal('');
  protected readonly cityQuery = signal('');
  protected readonly ageQuery = signal(null);



  constructor() {
    effect(() => {
      // Keep candidates in sync with service (live updates + storage events)
      const sub = this.candidatesService.observeAll().subscribe(list => this.candidates.set(list));
      return () => sub.unsubscribe();
    });
  }

   protected readonly filtered = computed(() => {
    const name = this.nameQuery().toLowerCase().trim();
    const city = this.cityQuery().toLowerCase().trim();
    const age = this.ageQuery();

    

    return this.candidates().filter(c =>
      (!name || c.name.toLowerCase().includes(name)) &&
      (!city || (c.city ?? '').toLowerCase().includes(city)) &&
      (!age || c.age === age)
    );
  });
}
