import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Candidate } from '../../../core/models/candidate.model';
import { InitialsPipe } from '../../../shared/pipes/initials-pipe';

@Component({
  selector: 'app-candidate-card',
  imports: [CommonModule,
    InitialsPipe,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterLink],
  templateUrl: './candidate-card.html',
  styleUrl: './candidate-card.scss'
})
export class CandidateCard {
  candidate = input.required<Candidate>()
}
