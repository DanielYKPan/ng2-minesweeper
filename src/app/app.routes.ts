import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { SelectivePreloadingStrategy } from "./selective-preloading-strategy";

const ROUTES: Routes = [
    {path: '', redirectTo: 'game', pathMatch: 'full'},
    {path: 'game', loadChildren: './+game#GameModule', data: {preload: true}}
];
@NgModule({
    imports: [
        RouterModule.forRoot(
            ROUTES,
            {preloadingStrategy: SelectivePreloadingStrategy}
        )
    ],
    exports: [
        RouterModule
    ],
    providers: [
        SelectivePreloadingStrategy
    ]
})
export class AppRoutingModule {
}
