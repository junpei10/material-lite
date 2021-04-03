import {
  Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component,
  Input, OnInit, SkipSelf, ViewEncapsulation
} from '@angular/core';
import { Falsy } from '@material-lite/angular-cdk/utils';
import { DocsCodeData, DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-docs-viewer',
  templateUrl: './docs-viewer.component.html',
  styleUrls: ['./docs-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsViewerComponent implements OnInit {
  // ex) ['html', 'ts', 'css']
  @Input() codeKeys: string[] = [];
  @Input() codeNames: string[] = [];
  @Input() codeClasses: (string | null)[] = [];

  selectedCode: string;
  selectedCodeKey: string;
  selectedCodeClass: string;
  selectedCodeKeyIndex: number;

  @Input() codeData?: DocsCodeData;

  @Input('showCodeblock') hasShownCodeblock: true | Falsy;
  @Input('disableActions') actionsIsDisabled: true | Falsy;

  constructor(
    @Attribute('codeblockName') public codeblockName: string,
    @Attribute('firstCodeKey') firstCodeKey: string,
    @SkipSelf() private _docs: DocsService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    if (firstCodeKey) {
      this.selectCode(firstCodeKey);
    }
  }

  ngOnInit(): void {
    let codeKey = this.selectedCodeKey;
    if (!codeKey) {
      codeKey = this.selectedCodeKey = this.codeKeys[0];
      this.selectedCodeKeyIndex = 0;
      this.selectedCodeClass = this.codeClasses[0] || codeKey;
    }

    if (this.hasShownCodeblock) {
      this.setCode();
    }
  }

  setCode(): void {
    if (!this.codeData) {
      this._docs.getCode(this.codeblockName)
        .then(codeData => {
          this.codeData = codeData;
          this.selectedCode = codeData[this.selectedCodeKey];
          this._changeDetectorRef.markForCheck();
        });

    } else {
      this.selectedCode = this.codeData[this.selectedCodeKey];
    }
  }

  toggleCodeState(): void {
    this.hasShownCodeblock = !this.hasShownCodeblock;

    this.setCode();
  }

  selectCode(codeKey: string, codeKeyIndex?: number): void {
    if (this.hasShownCodeblock && this.selectedCodeKey === codeKey) { return; }

    this.selectedCodeKey = codeKey;

    this.selectedCodeKeyIndex = codeKeyIndex
      = codeKeyIndex || this.codeKeys.indexOf(codeKey);

    this.selectedCodeClass = this.codeClasses[codeKeyIndex] || codeKey;

    this.hasShownCodeblock = true;

    this.setCode();
  }
}
