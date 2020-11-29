import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ButtonComponent } from './button.component';
import { ExampleComponent, OverviewComponent, ReferenceComponent } from './pages';

const routes: Routes = [
  {
    path: '', component: ButtonComponent, children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'reference', component: ReferenceComponent },
      { path: 'example', component: ExampleComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ButtonRoutingModule { }
