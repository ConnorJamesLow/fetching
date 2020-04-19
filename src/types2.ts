type Q<T> = { [K in keyof T]?: T[K] }

type R<T> = RequestInit & {
    body?: T
    payload?: T
    query?: Q<T>
}

type P<T> = (init: R<T>) => Promise<RequestInit>
type I<T> = (response: any) => Promise<T>

interface O0<A, Z> {
    url?: URI
    prepare?: P<A>
    intercept?: I<Z>
}

type O<A, Z> = Limit<O0<A, Z>>

interface F<A, Z, T extends O<A, Z>> {
    (info: URI, init: R<A>): Promise<Z>
    create<A1 = A, Z1 = Z, U extends O<A1, Z1> = O<A1, Z1>>(configure?: (o: T) => U): F<A1, Z1, U>
}

const a = '' as unknown as F<any, Response, {}>
const b = a.create(() => {
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
const c = b.create(o => {
    return {
        url: `${o.url}/content`,
        async prepare(i) {
            const previous = await o.prepare(i);
            return {
                ...previous,
                ...i,
                payload: JSON.stringify(i.payload),
                headers: {
                    ...previous.headers,
                    'Content-Type': 'application/json'
                }
            }
        },
        async intercept(r: Response) {
            return r.json();
        }
    }
})