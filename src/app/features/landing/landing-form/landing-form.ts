import { Component, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CandidateService } from '../../../core/services/candidate.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../../core/services/notification';
import { FileInput } from '../../../shared/components/file-input/file-input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';


@Component({
  selector: 'app-landing-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSnackBarModule, FileInput, MatProgressSpinnerModule],
  templateUrl: './landing-form.html',
  styleUrl: './landing-form.scss'
})
export class LandingForm {
  private readonly destroyRef = inject(DestroyRef);
  private notify = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(CandidateService);
  private readonly route = inject(ActivatedRoute);
  protected readonly imagePreview = signal<string | null>(null);
  protected readonly info = signal<string>('');
  protected readonly isEditMode = signal<boolean>(false);
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);



  protected form = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['',
      [
        Validators.required,
        // Validators.pattern(/^\+?\d{7,15}$/)
      ]
    ],
    age: [null as number | null, [Validators.required, Validators.min(18), Validators.max(80)]],
    city: ['', [Validators.required]],
    hobbies: [''],
    why: [''],
    image: ['']
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading.set(true);
      this.service.getCandidateById(id)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          map(existing => {
            if (!existing) {
              throw new Error('Candidate not found');
            }
            return existing;
          })
        )
        .subscribe({
          next: (existing) => {
            this.loading.set(false);
            const editable = this.canEdit(existing.updatedAt ?? existing.submittedAt);
            this.form.patchValue(existing as any);

            if (existing.image) this.imagePreview.set(existing.image);

            this.isEditMode.set(true);
            this.info.set(editable ? 'Editing candidate details' : 'Candidate details (view only, more than 3 days passed)');

            if (!editable) {
              this.form.disable();
            }
          },
          error: (error) => {
            this.loading.set(false);
            this.notify.error(error.message || 'Candidate not found.');
          }
        });
    } else {
      this.isEditMode.set(false);
      this.info.set('Register a new candidate');
    }
  }

  submit() {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const value = this.form.value;
    const now = Date.now();
    const isCreation = !this.isEditMode();

    const candidate = {
      id: value.id || crypto.randomUUID(),
      name: value.name!,
      email: value.email!,
      phone: value.phone!,
      age: value.age!,
      city: value.city!,
      hobbies: value.hobbies,
      why: value.why,
      image: value.image,
      summary: this.summaryBuilder(value.hobbies || undefined, value.why || undefined),
      submittedAt: now
    };

    const operation$ = isCreation
      ? this.service.addCandidate(candidate)
      : this.service.updateCandidate(candidate.id, candidate);

    operation$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const msg = isCreation
            ? 'Candidate details saved successfully!'
            : 'Candidate details updated successfully!';
          this.notify.success(msg);
          this.submitting.set(false);


          if (isCreation) {
            this.form.reset();
            this.form.markAsUntouched();
            this.form.markAsPristine();
            Object.keys(this.form.controls).forEach(key => {
              const control = this.form.get(key);
              control?.markAsUntouched();
              control?.markAsPristine();
              control?.setErrors(null);
            });
            this.imagePreview.set(null);
            this.info.set('Register a new candidate');
          } else {
            this.isEditMode.set(true);
            this.info.set('Editing candidate details');
          }
        },
        error: () => {
          const msg = isCreation
            ? 'Error saving candidate details.'
            : 'Error updating candidate details.';
          this.notify.error(msg);
          this.submitting.set(false);
        },
       
      });
  }



  summaryBuilder(hobbies?: string, why?: string): string {
    const parts = [];
    if (hobbies) parts.push(hobbies);
    if (why) parts.push(why);
    return parts.length ? parts.join(' ').slice(0, 120) : '';
  }

  private canEdit(timestamp?: number): boolean {
    if (!timestamp) return true;
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    return Date.now() - timestamp < threeDaysMs;
  }
}
