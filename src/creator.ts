const methodShouldUseBody = (verb: HttpMethod) => verb === 'POST'
    || verb === 'PUT'
    || verb === 'PATCH'
    || verb === 'DELETE';

const createUrl = <T extends any = any>(uri: URI, query?: T) => {
    const getPart = (s: string | number | Request) => (typeof s === 'string' || typeof s === 'number') ? s.toString() : s.url;

    // Convert the URI type parameter into a URL object
    let formatted = (uri instanceof Array) ? uri.map(i => getPart(i)).join('/') : getPart(uri);
    const url = new URL(formatted.replace(/([^:])[\\/]+/g, '$1/'));

    // if a query is included, add as URL seachParams.
    if (query) {
        Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));
    }
    return url;
}

const create = <A, Z, U>(options: O<A, Z>): F<A, Z, U> => {
    // Main request function
    const fetching: F<A, Z, U> = (async (theirInfo, theirInit) => {
        const { prepare, intercept, method: ourMethod, url: ourInfo } = options;
        const {
            method: theirMethod, body: theirBody, payload: theirPayload, query: theirQuery
        } = theirInit;

        // Get method
        const method = theirMethod || ourMethod || 'GET';

        // Get (pre-)BodyInit
        const body = theirBody || theirPayload || null;

        // Get pre-RequestInit
        const info = createUrl([
            createUrl(ourInfo || '').toString(),
            createUrl(theirInfo).toString()
        ], methodShouldUseBody(method) ? {} : theirQuery || theirPayload).href;

        // Create RequestInit
        const init = prepare
            ? await prepare({
                ...theirInit,
                body
            }) : {
                ...theirInit,
                body
            };

        // Execute request
        const res = await fetch(info, init);

        // Middleware
        if (intercept) {
            return await intercept(res);
        }
        return res;
    }) as F<A, Z, U>;


    // HTTP Methods
    // fetching.get = async (path: URI, query: any) => {
    //     return fetching(path, {
    //         method: 'GET',
    //         query
    //     })
    // }
    // fetching.post = async (path: URI, body: any) => {
    //     return fetching(path, {
    //         method: 'POST',
    //         body
    //     })
    // }
    // fetching.put = async (path: URI, body: any) => {
    //     return fetching(path, {
    //         method: 'PUT',
    //         body
    //     })
    // }
    // fetching.patch = async (path: URI, body: any) => {
    //     return fetching(path, {
    //         method: 'PATCH',
    //         body
    //     })
    // }
    // fetching.delete = async (path) => {
    //     return fetching(path, {
    //         method: 'DELETE'
    //     })
    // }

    fetching.create = (configure) => {
        const next = configure(options as any);

        // Create instance
        return create(next);
    }

    return fetching;
}

interface Test {
    a: number
    b: string[]
}

const fetching = create({
    async prepare(init, prev) {
        return init
    }
});
export default fetching;

const f2 = fetching.create<string, Test>({
    async prepare(init, prev) {
        return init;
    }
})

