# @amplience/content-studio-sdk

> Official SDK for embedding Amplience Content Studio

This SDK is designed to help embed the Amplience Content Studio into business admin interfaces, allowing merchants, marketers and authors to generate content as part of their existing tools and workflow.


## Installation

Using npm:

```sh
npm install @amplience/content-studio-sdk --save
```

## Usage

ES6:

```js
import { AmplienceContentStudio } from '@amplience/content-studio-sdk';

const sdk = new AmplienceContentStudio();
```

CommonJS:

```js
const { AmplienceContentStudio } = require('@amplience/content-studio-sdk');

const sdk = new AmplienceContentStudio();
```

### Get Content

The SDK can be used to launch Content Studio, allowing the user to generate or select previously created content and return it to your application.

```js
sdk.getContent()
    .then((result) => {
        console.log('received content', result);
    })
    .catch((error) => {
        console.log('received error', error);
    });
```

This will return an object with a success indicator, the content itself, and information about the template that generated the content.

```json
{
    "success": true,
    "template": {
        "id": "Q29udGVudEdlbmVyYXRpb25CcmllZlRlbXBsYXRlOnByb2R1Y3QtZGVzY3JpcHRpb24=",
        "label": "Product description"
    },
    "content": {
        // Will vary by type of content
        "description": "Lorem ipsum dolor sit amet...",
    },
}
```

## License

This software is licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),

Copyright 2024 Amplience

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.