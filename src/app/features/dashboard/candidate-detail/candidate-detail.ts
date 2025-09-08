import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { map } from 'rxjs/operators';
import { CandidateService } from '../../../core/services/candidate.service';
import { Candidate } from '../../../core/models/candidate.model';
import { InitialsPipe } from '../../../shared/pipes/initials-pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-candidate-detail',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, InitialsPipe, MatIconModule, MatMenuModule],
  templateUrl: './candidate-detail.html',
  styleUrl: './candidate-detail.scss'
})
export class CandidateDetail {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly candidatesService = inject(CandidateService);
  private notify = inject(NotificationService);


  protected readonly candidates = signal<Candidate[]>(this.candidatesService.getAll());
  protected readonly currentId = signal<string>('');

  constructor() {
    effect(() => {
      const sub = this.candidatesService.observeAll().subscribe(list => this.candidates.set(list));
      return () => sub.unsubscribe();
    });

    this.route.paramMap
      .pipe(map(params => params.get('id') ?? ''))
      .subscribe(id => {
        console.log(id);
        this.currentId.set(id);
      })
  }

  protected readonly index = computed(() => this.candidates().findIndex(c => c.id === this.currentId()));
  protected readonly id = computed(() => this.currentId());
  protected readonly candidate = computed(() => {
    const i = this.index();
    return i >= 0 ? this.candidates()[i] : undefined;
  });
  protected readonly prevId = computed(() => {
    const i = this.index();
    return i > 0 ? this.candidates()[i - 1]?.id ?? null : null;
  });
  protected readonly nextId = computed(() => {
    const i = this.index();
    return i >= 0 && i < this.candidates().length - 1 ? this.candidates()[i + 1]?.id ?? null : null;
  });

  deleteCandidate(id: string) {
    this.notify.confirm('Are you sure you want to delete this candidate?', 'Delete Candidate')
      .subscribe(confirmed => {
        if (confirmed) {
          this.candidatesService.remove(id)
          this.notify.success('Candidate deleted successfully!');
          this.router.navigate(['/dashboard']);
        }
      });
  }
}
