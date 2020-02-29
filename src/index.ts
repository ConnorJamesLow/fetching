export * from './client';
export { default as tysonClientFactory } from './client'
import createFactory, { RequestInitializerFactory, ResponseMiddleware } from './client';

const createEndpoint = <T>(rootURL: string, init: RequestInitializerFactory, middleware: ResponseMiddleware<T>) => {
    const sendRequest = createFactory(rootURL, init, middleware);
    return {
        create: {
            get:
                <TR, TB extends T>(options?: RequestInit) => (query: TR) => sendRequest<TR, TB>(rootURL, 'GET', query, options),
            pathedGet:
                <TR, TB extends T>(options?: RequestInit) => (id: number | string) => sendRequest<TR, TB>(`${rootURL}/${id}`, 'GET', undefined, options),
            delete:
                <TR, TB extends T>(options?: RequestInit) => (body: TR) => sendRequest<TR, TB>(rootURL, 'GET', body, options),
            pathedDelete:
                <TR, TB extends T>(options?: RequestInit) => (id: number | string, body?: TR) => sendRequest<TR, TB>(`${rootURL}/${id}`, 'DELETE', body, options),
            post:
                <TR, TB extends T>(options?: RequestInit) => (body: TR) => sendRequest<TR, TB>(rootURL, 'POST', body, options),
            put:
                <TR, TB extends T>(options?: RequestInit) => (body: TR) => sendRequest<TR, TB>(rootURL, 'PUT', body, options),
            patch:
                <TR, TB extends T>(options?: RequestInit) => (body: TR) => sendRequest<TR, TB>(rootURL, 'PATCH', body, options),
        }
    }
}

export default createEndpoint;
