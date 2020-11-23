import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-components',
  template: '<router-outlet></router-outlet>'
})

export class ComponentsComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
