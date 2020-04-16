import fetch from 'unfetch'

const methodShouldUseBody = (verb: HttpMethod) => verb === 'POST'
    || verb === 'PUT'
    || verb === 'PATCH'
    || verb === 'DELETE';

const createUrl = <T extends any = any>(ri: RequestInfo[], query?: T) => {
    const url = new URL(ri.join('/')
        .toString()
        .replace(/([^:])[\\/]+/g, '$1/'));
    if (query) {
        Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));
    }
    return url;
}


/**
 * Creates a function with default behavior to wrap the fetch api.
 *
 * @param rootURL A string to prepend to all requests made with this client.
 * @param init A function that returns initialization options for fetch(). Should be asynchronous.
 * @param middleware A function that runs on the response body every time the client is used to make a request. Should be asynchronous.
 */
const createFetchClient = <T = Response>(rootURL?: string, init?: RequestInitializerFactory, middleware?: ResponseMiddleware<T>) => {
    const r = rootURL || '';
    const i = init || (async <T>(body?: T): Promise<RequestInit> => ({ body: `${body}` }));
    const m = middleware || (async (res: Response) => res) as any;

    // Create the default request bindings.
    const request = async<TB = any, TR = any>(url: RequestInfo, method: HttpMethod, payload?: TB, options?: RequestInit): Promise<TR> => {
        const requestInfo = createUrl([r, url], methodShouldUseBody(method) ? {} : payload).href;
        const computedOptions = methodShouldUseBody(method)
            ? await i(requestInfo, payload)
            : await i(requestInfo);
        const requestInit: RequestInit = {
            ...computedOptions,
            ...options,
            headers: {
                ...computedOptions?.headers,
                ...options?.headers
            },
            method
        };
        if (!requestInit.body && payload) {
            requestInit.body = payload as any;
        }
        const result = await fetch(requestInfo, requestInit);
        return await m(result);
    }

    // Return all Type binding overloads
    return {
        async requestWithQuery<TReq extends RequestBodyOrPOJSO = any, TRes extends T | T[] = T>(url: RequestInfo, method: HttpMethod, payload?: TReq, options?: RequestInit): Promise<TRes> {
            return await request(url, method, payload, options);
        },
        async requestWithBody<TB extends T | T[] = any, TR = any>(url: RequestInfo, method: HttpMethod, payload?: TB, options?: RequestInit): Promise<TR> {
            return await request(url, method, payload, options);
        },
        request
    }
}
export default createFetchClient;
