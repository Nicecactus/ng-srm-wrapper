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

  public async loadSRM(assetManifestUrl: string): Promise<void> {
    const assetManifest = await this.loadManifest(assetManifestUrl);
    if (!assetManifest || !assetManifest.entrypoints) {
      return;
    }

    const origin = new URL(`${assetManifestUrl}/..`).href;
    await Promise.all(assetManifest.entrypoints.map(asset => {
      const [ext] = asset.match(/\.\w+$/);

      switch (ext) {
        case '.js':
          return this.loadScript(`${origin}${asset}`);
        case '.css':
          return this.loadStyle(`${origin}${asset}`);
      }
      return;
    }));
  }

  private async loadManifest(url: string): Promise<AssetManifest> {
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
