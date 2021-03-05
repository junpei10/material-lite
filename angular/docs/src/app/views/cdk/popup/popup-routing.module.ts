import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PopupComponent } from './popup.component';
import { OverviewComponent, ReferenceComponent } from './pages';

const routes: Routes = [
  {
    path: '', component: PopupComponent, children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'reference', component: ReferenceComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PopupRoutingModule { }
