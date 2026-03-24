import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {

  @Input() mensaje: string = 'Cargando...';
  @Input() color: string = 'primary';

  constructor() { }

  ngOnInit(): void { }
}