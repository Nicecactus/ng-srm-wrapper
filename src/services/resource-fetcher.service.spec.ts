import { AssetManifest, ResourceFetcherService } from './resource-fetcher.service';

interface PartialLoadManifest {
  loadManifest(url: string): Promise<AssetManifest>;
}

interface PartialLoadScript {
  loadScript(url: string): Promise<void>;
}

interface PartialLoadStyle {
  loadStyle(url: string): Promise<void>;
}

describe('ResourceFetcherService', () => {
  const proto = ResourceFetcherService.prototype as any;
  let resourceFetcher: ResourceFetcherService;

  beforeEach(() => {
    resourceFetcher = new ResourceFetcherService();
  });

  it('should load an SRM from its manifest', async () => {
    const origin = 'https://bundle.nextcactus.gg';

    const loadManifestStub = spyOn<PartialLoadManifest>(proto, 'loadManifest')
      .and.returnValue(Promise.resolve<AssetManifest>({
        entrypoints: [
          'main.js',
          'script.js',
          'style.css',
        ],
      }));
    const loadScriptStub = spyOn<PartialLoadScript>(proto, 'loadScript')
      .and.returnValue(Promise.resolve());
    const loadStyleStub = spyOn<PartialLoadStyle>(proto, 'loadStyle')
      .and.returnValue(Promise.resolve());

    await resourceFetcher.loadSRM(`${origin}/test.json`);

    expect(loadManifestStub).toHaveBeenCalled();
    expect(loadScriptStub).toHaveBeenCalledWith(`${origin}/main.js`);
    expect(loadScriptStub).toHaveBeenCalledWith(`${origin}/script.js`);
    expect(loadStyleStub).toHaveBeenCalledWith(`${origin}/style.css`);
  });
});
