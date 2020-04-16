const methodShouldUseBody = (verb: HttpMethod) => verb === 'POST'
    || verb === 'PUT'
    || verb === 'PATCH'
    || verb === 'DELETE';

const createUrl = <T extends any = any>(ri: URI[], query?: T) => {
    const url = new URL(ri.join('/')
        .toString()
        .replace(/([^:])[\\/]+/g, '$1/'));
    if (query) {
        Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));
    }
    return url;
}

const create = (options: FetchInstanceOptions): Fetching<any, any> => {
    // Main request function
    const fetching: Fetching = (async (theirInfo: URI, theirInit: TypedRequestInit<any>) => {
        const { prepare, intercept, method: ourMethod, url: ourInfo } = options;
        const {
            method: theirMethod, body: theirBody, payload: theirPayload, query: theirQuery
        } = theirInit;

        // Get method
        const method = theirMethod || ourMethod || 'GET';

        // Get (pre-)BodyInit
        const body = theirBody || theirPayload || null;

        // Get pre-RequestInit
        const info = createUrl([ourInfo || '', theirInfo], methodShouldUseBody(method) ? {} : theirQuery || theirPayload).href;

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
    }) as Fetching;


    // HTTP Methods
    fetching.get = async (path: URI, query: any) => {
        return fetching(path, {
            method: 'GET',
            query
        })
    }
    fetching.post = async (path: URI, body: any) => {
        return fetching(path, {
            method: 'POST',
            body
        })
    }
    fetching.put = async (path: URI, body: any) => {
        return fetching(path, {
            method: 'PUT',
            body
        })
    }
    fetching.patch = async (path: URI, body: any) => {
        return fetching(path, {
            method: 'PATCH',
            body
        })
    }
    fetching.delete = async (path) => {
        return fetching(path, {
            method: 'DELETE'
        })
    }

    fetching.create = (theirs: FetchInstanceOptions) => {
        // Configure middlewares
        const {
            intercept: theirIntercept, prepare: theirPrepare
        } = theirs;
        const {
            intercept: ourIntercept, prepare: ourPrepare
        } = options;
        if (!!theirIntercept) {
            options.intercept = (res: any) => theirIntercept(res, ourIntercept);
        }
        if (!!theirPrepare) {
            options.prepare = (config: any) => theirPrepare(config, ourPrepare);
        }

        // Create instance
        return create({
            ...options,
            ...theirs
        });
    }

    return fetching;
}

const fetching = create({
    async prepare(init, prev) {
        return {
            
        }
    }
});
export default fetching;


