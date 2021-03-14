import { Component, OnInit } from '@angular/core';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-setting',
  templateUrl: 'setting.component.html'
})

export class SettingComponent {
  constructor(
    docs: DocsService
  ) {
    docs.setActiveRoute('settings', 0);
  }
}
