import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayService } from '../play/play.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    
  }
  ngOnDestroy(): void {
    
  }

  constructor(
    private play: PlayService,
  ) { }
}
