// src/app/services/schedule-data.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScheduleDataService {
  private studyPlan: any = null;

  setPlan(plan: any) {
    this.studyPlan = plan;
  }

  getPlan(): any {
    return this.studyPlan;
  }

  clearPlan() {
    this.studyPlan = null;
  }
}