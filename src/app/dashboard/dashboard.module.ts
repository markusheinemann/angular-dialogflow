import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { HoldableDirective } from "../holdable.directive";
import { AccessTokenSerivce } from "../shared/services/acccessToken.service";
import { AudioRecordingService } from '../shared/services/audioRecording.service';
import { ThemeConstantService } from '../shared/services/theme-constant.service';
import { SharedModule } from '../shared/shared.module';
import { ChatComponent } from './chat/chat.component';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DefaultDashboardComponent } from './default/default-dashboard.component';
import { WithBreadcrumbDashboardComponent } from './with-breadcrumb/with-breadcrumb-dashboard.component';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
  ],
  declarations: [
    DefaultDashboardComponent,
    WithBreadcrumbDashboardComponent,
    ChatComponent,
    HoldableDirective
  ],
  exports: [
    HoldableDirective
  ],
  providers: [
    ThemeConstantService,
    AudioRecordingService,
    AccessTokenSerivce,
  ],
})
export class DashboardModule { }
