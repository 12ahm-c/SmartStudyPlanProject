import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleDataService } from '../services/schedule-data.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ScheduleComponent implements OnInit {
  isLoading = true;
  days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  formattedSchedule: { [day: string]: { [time: string]: string } } = {};

  constructor(private scheduleDataService: ScheduleDataService) {}

  ngOnInit() {
    this.simulateLoading();

    const data = this.scheduleDataService.getPlan();
    if (data) {
      this.formattedSchedule = data;
      console.log('📥 Studyplan loaded from service:', this.formattedSchedule);
    } else {
      console.log('⛔ No schedule data available.');
    }
  }

  simulateLoading() { setTimeout(() => this.isLoading = false, 2000); }

  getTimes(day: string): string[] {
    return this.formattedSchedule[day] ? Object.keys(this.formattedSchedule[day]) : [];
  }

  getActivity(day: string, time: string): string {
    return this.formattedSchedule[day]?.[time] || '';
  }

  // ✅ الدالة المطلوبة للتحقق إذا كان الجدول فارغ
  isScheduleEmpty(): boolean {
    return !this.formattedSchedule || Object.keys(this.formattedSchedule).length === 0;
  }
}