import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingComponent, ScssComponent } from './page';
import { ThemingComponent } from './theming.component';

const routes: Routes = [
  {
    path: '', component: ThemingComponent, children: [
      { path: 'settings', component: SettingComponent },
      { path: 'scss', component: ScssComponent },
      { path: '', redirectTo: 'settings', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemingRoutingModule { }
