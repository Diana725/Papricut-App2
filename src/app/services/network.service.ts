import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor() { }

  checkInternetConnection() {
    return 1;
  }

}
