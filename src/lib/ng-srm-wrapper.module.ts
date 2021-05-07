import { NgModule } from '@angular/core';
import { ResourceFetcherService } from '../services/resource-fetcher.service';
import { NgSRMWrapperComponent } from './ng-srm-wrapper.component';

@NgModule({
  declarations: [NgSRMWrapperComponent],
  exports: [NgSRMWrapperComponent],
  providers: [ResourceFetcherService],
})
export class NgSRMWrapperModule { }
