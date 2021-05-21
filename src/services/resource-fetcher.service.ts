import { Injectable } from '@angular/core';

export interface AssetManifest {
  entrypoints: Array<string>;
}

interface ResourceCache {
  assetManifests: Cache<Promise<any>>;
  scripts: Cache<Promise<void>>;
  styles: Cache<Promise<void>>;
}

interface Cache<T> {
  [key: string]: T;
}

@Injectable({
  providedIn: 'root',
})
export class ResourceFetcherService {
  private resourceCache: ResourceCache = {
    assetManifests: {},
    scripts: {},
    styles: {},
  };

  public async loadSRM(originUrl: string): Promise<void> {
    const assetManifest = await this.loadManifest(originUrl);
    if (!assetManifest || !assetManifest.entrypoints) {
      return;
    }

    await Promise.all(assetManifest.entrypoints.map(asset => {
      const [ext] = asset.match(/\.\w+$/);

      switch (ext) {
        case '.js':
          return this.loadScript(new URL(asset, originUrl).href);
        case '.css':
          return this.loadStyle(new URL(asset, originUrl).href);
      }
      return;
    }));
  }

  private async loadManifest(originUrl: string): Promise<AssetManifest> {
    const url = new URL('asset-manifest.json', originUrl).href;
    if (!this.resourceCache.assetManifests[url]) {
      this.resourceCache.assetManifests[url] = fetch(url).then(r => r.json());
    }

    return this.resourceCache.assetManifests[url];
  }

  private async loadScript(src: string): Promise<void> {
    if (!this.resourceCache.scripts[src]) {
      const script = document.createElement('script') as HTMLScriptElement;
      script.async = true;
      script.src = src;
      const promise = new Promise<void>(res => script.onload = () => res());
      document.head.appendChild(script);

      this.resourceCache.scripts[src] = promise;
    }

    return this.resourceCache.scripts[src];
  }

  private async loadStyle(src: string): Promise<void> {
    if (!this.resourceCache.styles[src]) {
      const link = document.createElement('link') as HTMLLinkElement;
      link.rel = 'stylesheet';
      link.href = src;
      const promise = new Promise<void>(res => link.onload = () => res());
      document.head.appendChild(link);

      this.resourceCache.styles[src] = promise;
    }

    return this.resourceCache.styles[src];
  }
}
