import {
  Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component,
  Input, OnInit, SkipSelf, ViewEncapsulation
} from '@angular/core';
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

  selectedCode: string;
  selectedCodeKey: string;
  selectedCodeKeyIndex: number;

  @Input() codeData?: DocsCodeData;

  @Input('showCodeblock') hasShownCodeblock: boolean;
  @Input('disableActions') actionsIsDisabled: boolean;

  constructor(
    @Attribute('codeblockName') public codeblockName: string,
    @SkipSelf() private _docs: DocsService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (!this.selectedCodeKey) {
      this.selectedCodeKey = this.codeKeys[0];
      this.selectedCodeKeyIndex = 0;
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
    this.selectedCodeKeyIndex = codeKeyIndex || this.codeKeys.indexOf(codeKey);

    this.hasShownCodeblock = true;

    this.setCode();
  }
}
