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
                <TR, TB extends T | T[] = T>(url?: RequestInfo, options?: RequestInit) => (query: TR, path?: number | string) => requestWithQuery<TR, TB>(`${url || ''}/${path || ''}`, 'GET', query, options),
            delete:
                <TR, TB extends T | T[] = T>(url?: RequestInfo, options?: RequestInit) => (body: TR, path?: number | string) => requestWithQuery<TR, TB>(`${url || ''}/${path || ''}`, 'GET', body, options),
            post:
                <TR extends T | T[] = T, TB = Response>(url?: RequestInfo, options?: RequestInit) => (body: TR, path?: number | string) => requestWithBody<TR, TB>(`${url || ''}/${path || ''}`, 'POST', body, options),
            put:
                <TR extends T | T[] = T, TB = Response>(url?: RequestInfo, options?: RequestInit) => (body: TR, path?: number | string) => requestWithBody<TR, TB>(`${url || ''}/${path || ''}`, 'PUT', body, options),
            patch:
                <TR = any, TB = any>(url?: RequestInfo, options?: RequestInit) => (body: TR, path?: number | string) => request<TR, TB>(`${url || ''}/${path || ''}`, 'PATCH', body, options),
        }
    }
    init().then(r => result.config.init = r);
    return result;
}

export default createEndpoint;
