import { Component, inject, signal } from '@angular/core';
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

@Component({
  selector: 'app-landing-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSnackBarModule, FileInput],
  templateUrl: './landing-form.html',
  styleUrl: './landing-form.scss'
})
export class LandingForm {
  private notify = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(CandidateService);
  private readonly route = inject(ActivatedRoute);
  protected readonly imagePreview = signal<string | null>(null);
  protected readonly info = signal<string>('');
  protected readonly isEditMode = signal<boolean>(false);


  protected form = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    age: [null as number | null, [Validators.required, Validators.min(18), Validators.max(80)]],
    city: ['', [Validators.required]],
    hobbies: [''],
    why: [''],
    image: ['']
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const existing = this.service.getById(id);
      if (existing) {
        const editable = this.canEdit(existing.updatedAt ?? existing.submittedAt);
        console.log(editable);
        this.form.patchValue(existing as any);
        if (existing.image) this.imagePreview.set(existing.image);
        this.isEditMode.set(true);
        this.info.set(editable ? 'Editing candidate details' : 'Candidate details (view only, more than 3 days passed)');

        if (!editable) {
          this.form.disable();
        }
      }
    } else {
      this.isEditMode.set(false);
      this.info.set('Register a new candidate');
    }
  }

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value;
    const id = value.id || crypto.randomUUID();
    const now = Date.now();
    this.service.upsert({
      id: String(id),
      name: value.name!,
      email: value.email!,
      phone: value.phone || undefined,
      age: value.age ?? undefined,
      city: value.city || undefined,
      hobbies: value.hobbies || undefined,
      why: value.why || undefined,
      image: value.image || undefined,
      summary: value.why?.slice(0, 120) || value.hobbies?.slice(0, 120) || '',
      submittedAt: now
    });
    const isOk = true;

    if (isOk) {
      this.notify.success('Candidate details saved successfully!');
    } else {
      this.notify.error('Error saving candidate details.');
    }
  }

  private canEdit(timestamp?: number): boolean {
    if (!timestamp) return true;
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;  
    return Date.now() - timestamp < threeDaysMs;
  }
}
