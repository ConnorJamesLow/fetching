export * from './client';
export { default as tysonClientFactory } from './client'
import createFactory, { RequestInitializerFactory, ResponseMiddleware } from './client';

const createEndpoint = <T = Response>(rootURL: string, init: RequestInitializerFactory, middleware: ResponseMiddleware<T>) => {
    const { requestWithQuery, requestWithBody, request } = createFactory(rootURL, init, middleware);
    const result = {
        config: {
            rootURL,
            middleware,
            init: {}
        },
        create: {
            get:
                <TRes, TReq extends T | T[] = T>(url?: RequestInfo, options?: RequestInit) => (query: TRes, path?: number | string) => requestWithQuery<TRes, TReq>(`${url || ''}/${path || ''}`, 'GET', query, options),
            delete:
                <TRes, TReq extends T | T[] = T>(url?: RequestInfo, options?: RequestInit) => (path?: number | string) => request<TRes, TReq>(`${url || ''}/${path || ''}`, 'DELETE', undefined, options),
            post:
                <TReq extends T | T[] = T, TRes = Response>(url?: RequestInfo, options?: RequestInit) => (body: TReq, path?: number | string) => requestWithBody<TReq, TRes>(`${url || ''}/${path || ''}`, 'POST', body, options),
            put:
                <TReq extends T | T[] = T, TRes = Response>(url?: RequestInfo, options?: RequestInit) => (body: TReq, path?: number | string) => requestWithBody<TReq, TRes>(`${url || ''}/${path || ''}`, 'PUT', body, options),
            patch:
                <TReq = any, TRes = any>(url?: RequestInfo, options?: RequestInit) => (body: TReq, path?: number | string) => request<TReq, TRes>(`${url || ''}/${path || ''}`, 'PATCH', body, options),
        }
    }
    init().then(r => result.config.init = r);
    return result;
}

export default createEndpoint;
