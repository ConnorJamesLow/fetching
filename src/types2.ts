type Query<T> = { [K in keyof T]?: T[K] }

type R<T> = RequestInit & {
    body?: T
    payload?: T
    query?: Query<T>
    method?: HttpMethod
}

type P<T> = (init: R<T | null>) => Promise<RequestInit>
type I<T> = (response: any) => Promise<T>

interface O0<A, Z> {
    url?: URI
    method?: HttpMethod
    prepare?: P<A | null>
    intercept?: I<Z>
}

type O<A, Z> = Limit<O0<A, Z>>

type C<T, U, A, Z> = (configure: (o?: T) => U) => F<A, Z, U>

interface F<A, Z, T extends O<A, Z>> {
    (info: URI, init: R<A>): Promise<Z>
    create<A1 = A, Z1 = Z, U extends O<A1, Z1> = O<A1, Z1>>(configure: (o?: T) => U): F<A1, Z1, U>
}

const a = '' as unknown as F<any, Response, {}>
a
    .create(() => {
        return {
            url: 'https://api.efinitytech.com',
            async prepare(i) {
                return {
                    ...i,
                    headers: {
                        'Authorization': 'whatever I want it to be'
                    },
                }
            },

        }
    })
    .create(o => {
        return {

        }
    })