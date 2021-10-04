import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ResourceFetcherService } from '../services/resource-fetcher.service';
import { getObjectFromPath } from '../utils/getObjectFromPath';

export interface SRMEvent {
  [value: string]: any;
}

interface SRMMethods {
  setBasename: (basename: string) => string;
  setLanguage: (language: string) => string;
  setEvent: (data: SRMEvent) => SRMEvent;
}

@Component({
  selector: 'ng-srm-wrapper',
  templateUrl: './ng-srm-wrapper.component.html',
})
export class NgSRMWrapperComponent implements OnInit, AfterViewInit {
  @ViewChild('anchor') anchorEl?: ElementRef;

  @Input() originUrl!: string;

  @Input() exportPath!: string;

  private mBasename: string;
  get basename(): string {
    return this.mBasename;
  }
  @Input() set basename(value: string) {
    this.mBasename = value;
    this.srmMethods?.setBasename(value);
  }

  private mLanguage: string;
  get language(): string {
    return this.mLanguage;
  }
  @Input() set language(value: string) {
    this.mLanguage = value;
    this.srmMethods?.setLanguage(value);
  }

  @Input() arguments?: any = {};

  @Input() eventHandlers?: { [id: string]: (...args: Array<any>) => Promise<any> } = {};

  @Output() loaded = new EventEmitter<HTMLElement>();

  @Output() rendered = new EventEmitter<any>();

  private mEvent: SRMEvent;
  get event(): SRMEvent {
    return this.mEvent;
  }
  @Input() set event(value: SRMEvent) {
    this.mEvent = value;
    this.srmMethods?.setEvent(value);
  }

  private initialized = false;
  private executed = false;
  private srmMethods?: SRMMethods;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly resourceFetcher: ResourceFetcherService,
  ) { }

  async ngOnInit(): Promise<void> {
    if (this.originUrl && !this.originUrl.endsWith('/')) {
      this.originUrl += '/';
    }
    await this.resourceFetcher.loadSRM(this.originUrl);
    this.initialized = true;

    this.loaded.emit(this.anchorEl.nativeElement);

    this.execute();
  }

  ngAfterViewInit(): void {
    this.execute();
  }

  private execute(): void {
    if (this.executed || !this.anchorEl || !this.initialized) {
      return;
    }

    this.executed = true;
    const obj = getObjectFromPath(this.exportPath);
    if (!obj || !obj.render) {
      return;
    }

    this.srmMethods = obj.render({
      element: this.anchorEl.nativeElement,
      basename: this.basename,
      language: this.language,
      event: this.event,
      navigate: (commands: any[], options: NavigationExtras) => this.router.navigate(commands, { relativeTo: this.route, ...options }),
      sendEvent: (id: string, ...args: Array<any>) => this.eventHandlers?.[id]?.(...args),
      ...this.arguments,
    });

    this.rendered.emit(this.srmMethods);
  }
}
