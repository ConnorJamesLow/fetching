type Query<T> = { [k in (keyof T)]?: T[k] }
type Override<T, R> = Omit<T, keyof R> & R

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'
type URI = RequestInfo | number | Array<number | RequestInfo>
type RequestMiddleware<T = any, PRM extends RequestMiddleware = null> = (
    (config: TypedRequestInit<T>, parentRequestMiddleware?: PRM) => Promise<RequestInit>
) | null
type ResponseMiddleware<T = any, PRM extends ResponseMiddleware = null> = (
    (res: Response, parentResponseMiddleware?: PRM) => Promise<T>
) | null

let t: RequestMiddleware = null;

interface TypedRequestInit<T> extends Override<RequestInit, {
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

interface FetchInstanceOptions<TReq = any, TRes = any, TReqM extends RequestMiddleware = any, TResM extends ResponseMiddleware = any> {
    url?: URI
    method?: HttpMethod
    prepare?: RequestMiddleware<TReq, TReqM>
    intercept?: ResponseMiddleware<TRes, TResM>
}

interface Fetching<TReq = any, TRes = any, TPrep extends RequestMiddleware = null, TInter extends ResponseMiddleware = null> {
    <TReq2 = TReq, TRes2 = Response>(url?: URI, init?: TypedRequestInit<TReq2>): Promise<TRes2>
    get<TReq2 = TReq, TRes2 = TRes>(path?: URI, query?: TReq2): Promise<TRes2>
    post<TReq2 = TReq, TRes2 = TRes>(path?: URI, body?: TReq2): Promise<TRes2>
    put<TReq2 = TReq, TRes2 = TRes>(path?: URI, body?: TReq2): Promise<TRes2>
    patch<TReq2 = TReq, TRes2 = TRes>(path?: URI, body?: TReq2): Promise<TRes2>
    delete<TRes2 = TRes>(path?: URI): Promise<TRes2>
    create<TReqN = TReq, TResN = TRes, TReqM extends RequestMiddleware = TPrep, TResM extends ResponseMiddleware = TInter>(options: FetchInstanceOptions<TReq, TRes, TReqM, TResM>): Fetching<TReqN, TResN>
}

const combine = <T, T2 = T>(base: T, extend: T2): T & T2 => ({ ...base, ...extend })

const a = combine({}, {
    method: 'get'
})

a.method;
const b = combine({
    body: ''
}, a)
b.method

interface Test<T> {
    options: T,
    update<T2>(o: T2): Test<T & T2>
}

type TestMaker<T> = (o: T) => Test<T>

const create = (fn: (o: RequestInit) => RequestInit) => {
    return ({
        create
    })
}


// Deprecate
type RequestBodyOrPOJSO = ({} | BodyInit);
type RequestInitializerFactory = <T>(url?: RequestInfo, body?: T) => Promise<RequestInit>;
