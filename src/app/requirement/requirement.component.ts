import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScheduleService, InputData } from '../services/schedule.service';
import { ScheduleDataService } from '../services/schedule-data.service';

@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule]
})
export class RequirementComponent {
  currentStep = 0;
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  states = ['full', 'partial', 'free'];

  schedule: any = {};
  dailyWorkSchedule = { start: '', end: '' };

  subjectsForm: FormGroup;
  activitiesForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private scheduleService: ScheduleService,
    private scheduleDataService: ScheduleDataService
  ) {
    this.weekDays.forEach(day => this.schedule[day] = { status: '' });
    this.subjectsForm = this.fb.group({ subjects: this.fb.array([this.createSubject()]) });
    this.activitiesForm = this.fb.group({ activities: this.fb.array([this.createActivity()]) });
  }

  nextStep() { this.currentStep++; }

  get subjects() { return this.subjectsForm.get('subjects') as FormArray; }
  createSubject(): FormGroup { return this.fb.group({ name: ['', Validators.required], coefficient: [1, Validators.required] }); }
  addSubject() { this.subjects.push(this.createSubject()); }

  get activities() { return this.activitiesForm.get('activities') as FormArray; }
  createActivity(): FormGroup {
    return this.fb.group({ name: ['', Validators.required], priority: [1, Validators.required], startTime: ['', Validators.required], endTime: ['', Validators.required] });
  }
  addActivity() { this.activities.push(this.createActivity()); }

  generateSchedule() {
    const userData: InputData = {
      dailyWork: this.dailyWorkSchedule,
      schedule: this.schedule,
      subjects: this.subjectsForm.value.subjects,
      activities: this.activitiesForm.value.activities
    };

    this.isLoading = true;

    this.scheduleService.sendSchedule(userData).subscribe({
      next: (res) => {
        console.log('📤 Backend response:', res);
        const studyplan = res.studyplan ?? {};
        this.isLoading = false;

        // حفظ الجدول في الخدمة
        this.scheduleDataService.setPlan(studyplan);

        // الانتقال إلى صفحة الجدول
        this.router.navigate(['/schedule']);
      },
      error: (err) => { console.error('❌ Error sending data', err); this.isLoading = false; }
    });
  }
}