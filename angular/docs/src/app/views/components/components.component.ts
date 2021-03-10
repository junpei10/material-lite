import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ComponentsComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
