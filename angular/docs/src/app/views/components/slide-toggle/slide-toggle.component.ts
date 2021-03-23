import { Component, OnInit } from '@angular/core';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  providers: [DocsService]
})
export class SlideToggleComponent implements OnInit {

  constructor(
    docs: DocsService
  ) {
    docs.init('components', 'slide-toggle');
  }

  ngOnInit(): void {
  }

}
