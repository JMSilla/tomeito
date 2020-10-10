import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntervalService {
  private interval: number

  startPeriodicExecution(func: () => any) {
    if (!this.isExecutionStarted())
      this.interval = setInterval(func, 1000)
  }

  isExecutionStarted() {
    return this.interval != undefined
  }

  stopPeriodicExecution() {
    if (this.isExecutionStarted()) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  }
}
