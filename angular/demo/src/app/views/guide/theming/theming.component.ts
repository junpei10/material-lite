import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-theming',
  templateUrl: './theming.component.html'
})
export class ThemingComponent implements OnInit {
  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void { }

  fragmentScrollTo(fragment: string): void {
    this._router.navigate([], { fragment });
  }
}
