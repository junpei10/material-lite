import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsComponent } from './views/components/components.component';

const routes: Routes = [
  {
    path: 'components', component: ComponentsComponent, children: [
      { path: 'button', loadChildren: () => import('./views/components/button/button.module').then(m => m.ButtonModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
