# Fetching
💪 Strongly-typed REST API client for browsers!

## Usage
**Fetching** is built on TypeScript. It adds some useful wrappers over the [unfetch](https://www.npmjs.com/package/unfetch) package.

### JavaScript
```js
import createEndpoint from 'fetching';

// Create an endpoint schema
const endpoint = createEndpoint(
    // Define the root url for the endpoint
    'https://api.example.com/', 

    // Dynamically create options to use with every request created with this endpoint.
    async () => ({ 
        headers: {
            'Content-Type': 'application/json'
        }
    }), 

    // Create middleware to run on every response from an endpoint.
    async (res) => await res.json
);

// Create reusable request functions:
const getTrees = endpoint.create.get('');
const createTree = endpoint.create.post('');

// Middleware defined for the endpoint schema runs when the request function runs
const promise = getTrees({ location: 'WA' });
promise.then(response => console.log(response)); // -> some JSON
```

### TypeScript
```ts
import createEndpoint from 'fetching';

interface Tree {
    name: string
}

interface TreeInfo extends Tree {
    location: string
};

// Create an endpoint schema
const endpoint = createEndpoint<Tree>(
    // Define the root url for the endpoint
    'https://api.example.com/trees',

    // Dynamically create options to use with every request created with this endpoint.
    async () => ({
        headers: {
            'Content-Type': 'application/json'
        }
    }),

    // Create middleware to run on every response from an endpoint.
    async (res) => await res.json()
);

// Create reusable request functions:
const getTrees = endpoint.create.get<any, TreeInfo[]>('');
const createTree = endpoint.create.post<TreeInfo, number>('');
const patchTree = endpoint.create.patch<{ [prop: string]: any }, boolean>('')

// Middleware defined for the endpoint schema runs when the request function runs
const promise = getTrees({ location: 'WA' });
promise.then(response => console.log(response)); // -> TreeInfo[]
```
