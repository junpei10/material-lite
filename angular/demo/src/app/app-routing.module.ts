import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CdkComponent } from './views/cdk/cdk.component';
import { ComponentsComponent } from './views/components/components.component';
import { HomeComponent } from './views/home/home.component';
import { ThemeComponent } from './views/theme/theme.component';

const routes: Routes = [
  {
    path: 'components', component: ComponentsComponent, children: [
      { path: '', loadChildren: () => import('./views/components/root').then(m => m.RootModule) },
      { path: 'button', loadChildren: () => import('./views/components/button').then(m => m.ButtonModule) },
      { path: 'ripple', loadChildren: () => import('./views/components/ripple').then(m => m.RippleModule) }
    ]
  },
  {
    path: 'cdk', component: CdkComponent, children: [
      { path: '', loadChildren: () => import('./views/cdk/root').then(m => m.RootModule) },
      { path: 'portal', loadChildren: () => import('./views/cdk/portal').then(m => m.PortalModule) },
      { path: 'popup', loadChildren: () => import('./views/cdk/popup').then(m => m.PopupModule) }
    ]
  },
  {
    path: 'changelog', loadChildren: () => import('./views/changelog').then(m => m.ChangelogModule)
  },
  { path: 'theme', component: ThemeComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
