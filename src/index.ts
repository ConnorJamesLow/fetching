export * from './client';
export { default as tysonClientFactory } from './client'
import createFactory, { RequestInitializerFactory, ResponseMiddleware } from './client';

export default <T>(rootURL: string, init: RequestInitializerFactory, middleware: ResponseMiddleware<T>) => {
    const sendRequest = createFactory(rootURL, init, middleware);
    return {
        createGet: <T>(query: T, options?: RequestInit) => sendRequest(rootURL, 'GET', query, options),
    }
}