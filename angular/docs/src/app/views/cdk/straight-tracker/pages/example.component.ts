import { Component } from '@angular/core';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  selectedIndex: number = 0;

  itemWrapperClassList: string[] = [];

  constructor(
    docs: DocsService
  ) {
    docs.setActiveRoute('example');
  }

  toggleItemSize(): void {
    this._toggleItemWrapperClass('full-width');
  }

  toggleItemBorder(): void {
    this._toggleItemWrapperClass('bold-border');
  }

  private _toggleItemWrapperClass(className: string): void {
    const classList = [...this.itemWrapperClassList];

    const index = classList.indexOf(className);

    index === -1
      ? classList.push(className)
      : classList.splice(index, 1);

    this.itemWrapperClassList = classList;
  }
}
