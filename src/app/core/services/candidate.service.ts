import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Candidate } from '../models/candidate.model';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';

const STORAGE_KEY = 'iisa:candidates';

@Injectable({ providedIn: 'root' })
export class CandidateService {
  private fireStore = inject(Firestore);
  private candidatesCollection;

  constructor() {
    this.candidatesCollection = collection(this.fireStore, 'candidates');
  }

  getCandidates(): Observable<Candidate[]> {
    return collectionData(this.candidatesCollection, {
      idField: 'id',
    }) as Observable<Candidate[]>;
  }

  getCandidateById(id: string): Observable<Candidate> {
    const candidateDoc = doc(this.fireStore, `candidates/${id}`);
    return docData(candidateDoc, { idField: 'id' }) as Observable<Candidate>;
  }

  addCandidate(candidate: Candidate): Observable<void> {
    return from(
      addDoc(this.candidatesCollection, candidate).then(() => void 0)
    );
  }

  updateCandidate(id: string, data: Partial<Candidate>): Observable<void> {
    const candidateDoc = doc(this.fireStore, `candidates/${id}`);
    return from(updateDoc(candidateDoc, data));
  }

  deleteCandidate(id: string): Observable<void> {
    const candidateDoc = doc(this.fireStore, `candidates/${id}`);
    return from(deleteDoc(candidateDoc));
  }
}


