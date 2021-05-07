import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ResourceFetcherService } from '../services/resource-fetcher.service';
import { NgSRMWrapperComponent } from './ng-srm-wrapper.component';

describe('NgSRMWrapperComponent', () => {
  let component: NgSRMWrapperComponent;
  let fixture: ComponentFixture<NgSRMWrapperComponent>;
  let ResourceFetcherServiceStub: Partial<ResourceFetcherService>;

  it('should load a simple SRM', async () => {
    ResourceFetcherServiceStub = new ResourceFetcherService();
    const loadSRMStub = spyOn(ResourceFetcherServiceStub, 'loadSRM').and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ NgSRMWrapperComponent ],
      providers: [ { provide: ResourceFetcherService, useValue: ResourceFetcherServiceStub } ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgSRMWrapperComponent);
    component = fixture.componentInstance;
    component.exportPath = '';
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(loadSRMStub).toHaveBeenCalled();
  });

  it('should not reload when changing language', async () => {
    ResourceFetcherServiceStub = new ResourceFetcherService();
    const loadSRMStub = spyOn(ResourceFetcherServiceStub, 'loadSRM').and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ NgSRMWrapperComponent ],
      providers: [ { provide: ResourceFetcherService, useValue: ResourceFetcherServiceStub } ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgSRMWrapperComponent);
    component = fixture.componentInstance;
    component.exportPath = '';
    component.language = 'en';
    fixture.detectChanges();

    component.language = 'fr';
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(loadSRMStub).toHaveBeenCalledTimes(1);
  });
});
