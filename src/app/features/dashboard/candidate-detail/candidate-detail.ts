import { Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
export class CandidateDetail implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly candidatesService = inject(CandidateService);
  private notify = inject(NotificationService);
  protected readonly candidates = signal<Candidate[]>([]);
  protected readonly currentId = signal<string>('');
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

  private readonly destroyRef = inject(DestroyRef);

  constructor() { 
   this.route.paramMap
      .pipe(
        map(params => params.get('id') ?? ''),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(id => {
        this.currentId.set(id);
      })
  }
  ngOnInit(): void {
    this.candidatesService.getCandidates()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(list => {
        this.candidates.set(list);
      });
  }

  deleteCandidate(id: string) {
    this.notify.confirm('Are you sure you want to delete this candidate?', 'Delete Candidate')
      .subscribe(confirmed => {
        if (confirmed) {
          this.candidatesService.deleteCandidate(id).subscribe({
            next: () => {
              this.notify.success('Candidate deleted successfully!');
              this.router.navigate(['/dashboard']);
            },
            error: () => {
              this.notify.error('Candidate deleted failed!');
            }
          })

        }
      });
  }
}
