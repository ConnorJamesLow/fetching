export * from './client';
export { default as tysonClientFactory } from './client'
import createFactory, { RequestInitializerFactory, ResponseMiddleware } from './client';

const createEndpoint = <T>(rootURL: string, init: RequestInitializerFactory, middleware: ResponseMiddleware<T>) => {
    const sendRequest = createFactory(rootURL, init, middleware);
    const result = {
        config: {
            rootURL,
            middleware,
            init: {}
        },
        create: {
            get:
                <TR, TB extends T>(url: RequestInfo, options?: RequestInit) => (query: TR) => sendRequest<TR, TB>(url, 'GET', query, options),
            pathedGet:
                <TR, TB extends T>(url: RequestInfo, options?: RequestInit) => (id: number | string) => sendRequest<TR, TB>(`${url}/${id}`, 'GET', undefined, options),
            delete:
                <TR, TB extends T>(url: RequestInfo, options?: RequestInit) => (body: TR) => sendRequest<TR, TB>(url, 'GET', body, options),
            pathedDelete:
                <TR, TB extends T>(url: RequestInfo, options?: RequestInit) => (id: number | string, body?: TR) => sendRequest<TR, TB>(`${url}/${id}`, 'DELETE', body, options),
            post:
                <TR, TB extends T>(url: RequestInfo, options?: RequestInit) => (body: TR) => sendRequest<TR, TB>(url, 'POST', body, options),
            put:
                <TR, TB extends T>(url: RequestInfo, options?: RequestInit) => (body: TR) => sendRequest<TR, TB>(url, 'PUT', body, options),
            patch:
                <TR, TB extends T>(url: RequestInfo, options?: RequestInit) => (body: TR) => sendRequest<TR, TB>(url, 'PATCH', body, options),
        }
    }
    init().then(r => result.config.init = r);
    return result;
}

export default createEndpoint;
