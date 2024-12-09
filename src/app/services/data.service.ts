import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataModel } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataSubject = new BehaviorSubject<DataModel | null>(null);

  data$ = this.dataSubject.asObservable();

  constructor() {

  }

  updateData(data: DataModel) {
  if (data !== undefined) {
    this.dataSubject.next(data);
  } else {
    // Handle the case where data is undefined
  }
}

}
