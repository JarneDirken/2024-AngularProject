import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent implements OnChanges{
  progressChange: number = -1;
  @Input() progressValue: number = 0;
  @Input() progressSpeed: number = 0;
  intervalId: (string | number | NodeJS.Timeout | undefined);

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['progressValue']) this.startProgress();
  }

  startProgress(): void {
    this.progressChange = -1;
    this.intervalId = setInterval(() => {
      this.progressChange += 1;
      if (this.progressChange > 100) {
        this.progressChange = 0;
      }

      if (this.progressChange === Math.floor(this.progressValue) || this.progressChange === 100) {
        this.stopProgress();
      }
    }, 1);
  }

  stopProgress(): void {
    clearInterval(this.intervalId);
  }
}
