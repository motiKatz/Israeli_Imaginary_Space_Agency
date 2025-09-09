import { Component, signal, computed, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CandidateService } from '../../../core/services/candidate.service';
import { CandidateCard } from '../candidate-card/candidate-card';
import { Candidate } from '../../../core/models/candidate.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-list',
  imports: [
    CommonModule,
    FormsModule,
    CandidateCard,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './dashboard-list.html',
  styleUrl: './dashboard-list.scss'
})
export class DashboardList implements OnInit {
  private readonly candidatesService = inject(CandidateService);
  protected readonly candidates = signal<Candidate[]>([]);
  protected readonly loading = signal(false);
  protected readonly nameQuery = signal('');
  protected readonly cityQuery = signal('');
  protected readonly ageQuery = signal(null);



  constructor() {
    effect(() => {
      // Keep candidates in sync with service (live updates + storage events)
      // const sub = this.candidatesService.observeAll().subscribe(list => this.candidates.set(list));
      // return () => sub.unsubscribe();

      // const sub = this.candidatesService.getCandidates().subscribe(list => {
      //   this.candidates.set(list);
      // });
      // return () => sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.loading.set(true);
    const sub = this.candidatesService.getCandidates().subscribe({
      next: (list) => {
        this.loading.set(false);
        this.candidates.set(list);
      },
      error: () => {
        console.log('Failed to load candidates');

      }
    })
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
