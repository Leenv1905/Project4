import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { VerificationService, VerificationTask } from '../../../../core/services/verification.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIcon],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  private verificationService = inject(VerificationService);
  private router = inject(Router);

  tasks: VerificationTask[] = [];
  isLoading = false;

  get submittedTasks() {
    return this.tasks.filter((t) => t.status === 'SUBMITTED' || t.status === 'APPROVED');
  }
  get approvedCount() {
    return this.tasks.filter((t) => t.status === 'APPROVED').length;
  }
  get submittedCount() {
    return this.tasks.filter((t) => t.status === 'SUBMITTED').length;
  }

  ngOnInit() {
    this.isLoading = true;
    this.verificationService.getMyTasks().subscribe({
      next: (data) => {
        this.tasks = data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  goToDetail(task: VerificationTask) {
    this.router.navigate(['/operator/tasks/verify/detail', task.id], { state: { task } });
  }
}
