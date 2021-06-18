import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import {Routes, RouterModule} from '@angular/router';



// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { TextFieldComponent } from '../assets/ui/text-field/text-field.component';
import { ButtonComponent } from '../assets/ui/button/button.component';
import { SquareButtonComponent } from '../assets/ui/square-button/square-button.component';
import {CommonModule} from "@angular/common";
import { StartDisplayComponent } from './start-display/start-display.component';
import {DataService} from "./data.service";
import { AddTextComponent } from './add-text/add-text.component';
import { VoidComponent } from './void/void.component';
import { TextComponent } from './text/text.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthComponent } from './auth/auth.component';
import { FriendsComponent } from './friends/friends.component';
import { MessageComponent } from './message/message.component';
import { DotsComponent } from './dots/dots.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const appRoutes: Routes =[
  { path: 'start', component: StartDisplayComponent},
  { path: 'addText', component: AddTextComponent},
  { path: '', component: VoidComponent},
  { path: 'text/:id', component: TextComponent},
  { path: 'statistics', component: StatisticsComponent},
  { path: 'settings/:tab', component: SettingsComponent},
  { path: 'auth/:type', component: AuthComponent}
];

@NgModule({
  declarations: [AppComponent, TextFieldComponent, ButtonComponent, SquareButtonComponent, StartDisplayComponent, AddTextComponent, VoidComponent, TextComponent, StatisticsComponent, SettingsComponent, AuthComponent, FriendsComponent, MessageComponent, DotsComponent],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    RouterModule.forRoot(appRoutes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
