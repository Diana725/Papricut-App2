import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private storage: Storage
  ) { }

  setAuthToken(token: string): Promise<void> {
      this.setAuthenticated();
      return this.storage.set('authToken', token);
    }

    getAuthToken(): Promise<string | null> {
      return this.storage.get('authToken');
    }

    async setAuthenticated() {
    await this.storage.set('isAuthenticated', true);
    this.isAuthenticatedSubject.next(true);
  }

  async clearAuthentication() {
    await this.storage.remove('authToken');
    await this.storage.set('isAuthenticated', false);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

}
