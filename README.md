<h3 align="center">NG SRM Wrapper</h3>

<p align="center">
  Easily integrate SRM into your Angular application
</p>

<p align="center">
  <a href="https://badge.fury.io/js/%40robingoupil%2Fng-srm-wrapper"><img src="https://badge.fury.io/js/%40robingoupil%2Fng-srm-wrapper.svg" alt="npm version" ></a>
</p>

## Table of contents

- [Quick start](#quick-start)
- [API Reference](#api-reference)
  - [NgSRMWrapper](#ngsrmwrapper)

## Quick start

Install `@nicecactus/ng-srm-wrapper`:

- with [npm](https://www.npmjs.com/): `npm install -S @nicecactus/ng-srm-wrapper`
- with [yarn](https://yarnpkg.com/): `yarn add @nicecactus/ng-srm-wrapper`

Add the module to NgModule imports

#### **`AppModule`**
```ts
import { NgSRMWrapperModule } from '@nicecactus/ng-srm-wrapper';

@NgModule({
  ...
  modules: [ NgSRMWrapperModule, ... ],
  ...
})
```

Create a loader component for your SRM.  
We will assume that:
* the asset-manifest.json file url is stored in `environment.assetManifestUrl`  
* once loaded, the SRM `render()` function is exposed in `window.myOrg.myModule`
* the module will be served with the relative path `/my-module`


#### **`my-module-loader.component.ts`**
```ts
import { Component } from '@angular/core';

import { environment } from 'projects/my-project/src/environments/environment';

@Component({
  selector: 'app-my-modue-loader',
  templateUrl: './my-modue-loader.component.html',
})
export class MyModuleLoaderComponent {
  const assetManifestUrl = environment.assetManifestUrl;
}
```

#### **`my-module-loader.component.html`**
```html
<ng-srm-wrapper assetManifestUrl="{{assetManifestUrl}}" exportPath="myOrg.myModule" basename="/my-module"></ng-srm-wrapper>
```

Expose the loader in the app router

#### **`AppRoutingModule`**
```ts
const routes: Routes = [
  {
    path: 'my-module',
    children: [
        {
            path: '**',
            component: MyModuleLoaderComponent,
        },
    ],
  }
];
```

## API Reference

### [NgSRMWrapper](https://github.com/nicecactus/ng-srm-wrapper/blob/master/src/lib/ng-srm-wrapper.component.ts)

|||
|-|-|
| Selector | `ng-srm-wrapper` |

### Inputs
|||
|-|-|
| `assetManifestUrl` | Type: `string` <br /> URL to the `asset-manifest.json`. |
| `exportPath` | Type: `string` <br /> Path to the exported `render()` function once the module has been loaded. |
| `basename` | Type: `string` <br /> Default value: `/` <br /> Relative path the module is being served from. |
| `language` | Type: `string` <br /> Default value: `en` <br /> Language used for i18n. |
| `arguments` | Type: `object` <br /> Default value: `{}` <br /> Extra arguments to pass to the `render()` function. |
| `eventHandlers` | Type: `object` <br /> Default value: `{}` <br /> Custom events that can be called by the SRM. |

### Outputs
|||
|-|-|
| `loaded` | Type: `EventEmitter<HTMLElement>` <br /> Emits an event when the module has been loaded. |
| `rendered` | Type: `EventEmitter<any>` <br /> Emits an event when the module has been rendered. |
