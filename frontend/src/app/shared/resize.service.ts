import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
  private resize: Subject<number>;

  constructor() {
    this.resize = new Subject<number>();
    window.addEventListener('resize', () => {
      this.resize.next(window.innerWidth);
    });
  }

  get onResize() {
    return this.resize.asObservable();
  }
}
