// this is basically just Partial
// type Query<T> = { [k in (keyof T)]?: T[k] }
type Limit<T, U extends T = T> = {
    [K in keyof U]?: U[K]
} & {
        [P in Exclude<keyof U, keyof T>]: never
    };
type Override<T, R> = Omit<T, keyof R> & R
type Maybe<T> = T | undefined | null
/**
 * Defines a type that includes a `create` method that constructs a new instance of the same type.
 * The `create` method takes a function with shape `(T) => U` where `T` represents the previous instance's `U`.
 */
type Extendable<T, TP> = T & {
    create<TN>(i: (o: TP) => TN): Extendable<T, TN>
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'
type URI = RequestInfo | number | Array<number | RequestInfo>
// Prepare middleware
type Prepare<TInit = any> = <T extends Prepare>(init: Ri<TInit>, parentRequestMiddleware?: T) => Promise<RequestInit>
// Intercept middleware
type Intercept<TRes = any> = <T extends Intercept>(res: Response, parentResponseMiddleware?: T) => Promise<TRes>

interface Ri<T = any> extends Override<RequestInit, {
    body?: BodyInit | T | null,
    method?: HttpMethod
}> {
    /**
     * Converted into a querystring
     */
    query?: {} | null
    /**
     * Will be used for either the request body or the query, depending on the request.
     */
    payload?: BodyInit | T | null
}

interface FetchInstanceOptions<TReq = any, TRes = any> {
    url?: URI
    method?: HttpMethod
    prepare?: Prepare<TReq>
    intercept?: Intercept<TRes>
}

interface Fetching<TRequest, TResponse> {
    <TRequestOverride = TRequest, TResultOverride = Response>(url?: URI, init?: Ri<TRequestOverride>): Promise<TResultOverride>
    get<TRequestOverride = TRequest, TResultOverride = TResponse>(path?: URI, query?: TRequestOverride): Promise<TResultOverride>
    post<TRequestOverride = TRequest, TResultOverride = TResponse>(path?: URI, body?: TRequestOverride): Promise<TResultOverride>
    put<TRequestOverride = TRequest, TResultOverride = TResponse>(path?: URI, body?: TRequestOverride): Promise<TResultOverride>
    patch<TRequestOverride = TRequest, TResultOverride = TResponse>(path?: URI, body?: TRequestOverride): Promise<TResultOverride>
    delete<TResultOverride = TResponse>(path?: URI): Promise<TResultOverride>
    create<TReqN = TRequest, TResN = TResponse>(options: FetchInstanceOptions<TReqN, TResN>): Fetching<TReqN, TResN>
}

type Pr<T> = (o: Ri<T>) => Promise<RequestInit>
type In<T> = (r: Response) => Promise<T>

interface Op<A, B> {
    url?: URI
    method?: HttpMethod
    prepare?: Pr<A>
    intercept?: In<B>
}

type Fe<T, U, O extends Op<P, I>, P = undefined, I = Response> = Extendable<{
    <A = T, B = U>(info?: URI, init?: Ri<A>): Promise<B>
}, O>

const f = {} as Fe<any, Response, {}>
f.create(o => {
    return {}
})



// Deprecate
type RequestBodyOrPOJSO = ({} | BodyInit);
type RequestInitializerFactory = <T>(url?: RequestInfo, body?: T) => Promise<RequestInit>;
