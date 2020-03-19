import fetch from 'unfetch'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
export type RequestBody = string | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null | undefined;
export type RequestInitializerFactory = <T>(body?: T) => Promise<RequestInit>;
export type ResponseMiddleware<T> = (res: Response) => Promise<T>;
export type RequestBodyOrPOJSO = ({} | RequestBody);
export type Query<T> = { [key in (keyof T)]: any };

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
    return {
        async requestWithQuery<TB extends RequestBodyOrPOJSO = any, TR extends T | T[] = T>(url: RequestInfo, method: HttpMethod, payload?: TB, options?: RequestInit): Promise<TR> {
            const computedOptions = methodShouldUseBody(method) ? await i(payload) : await i();
            const requestInfo = createUrl([r, url], methodShouldUseBody(method) ? {} : payload).href;
            const requestInit: RequestInit = {
                ...computedOptions,
                ...options,
                headers: {
                    ...computedOptions?.headers,
                    ...options?.headers
                },
                method
            };
            const result = await fetch(requestInfo, requestInit);
            return await m(result);
        },
        async requestWithBody<TB extends T | T[] = any, TR = any>(url: RequestInfo, method: HttpMethod, payload?: TB, options?: RequestInit): Promise<TR> {
            const computedOptions = methodShouldUseBody(method) ? await i(payload) : await i();
            const requestInfo = createUrl([r, url], methodShouldUseBody(method) ? {} : payload).href;
            const requestInit: RequestInit = {
                ...computedOptions,
                ...options,
                headers: {
                    ...computedOptions?.headers,
                    ...options?.headers
                },
                method
            };
            const result = await fetch(requestInfo, requestInit);
            return await m(result);
        },
        async request<TB = any, TR = any>(url: RequestInfo, method: HttpMethod, payload?: TB, options?: RequestInit): Promise<TR> {
            const computedOptions = methodShouldUseBody(method) ? await i(payload) : await i();
            const requestInfo = createUrl([r, url], methodShouldUseBody(method) ? {} : payload).href;
            const requestInit: RequestInit = {
                ...computedOptions,
                ...options,
                headers: {
                    ...computedOptions?.headers,
                    ...options?.headers
                },
                method
            };
            const result = await fetch(requestInfo, requestInit);
            return await m(result);
        }
    }
}
export default createFetchClient;
