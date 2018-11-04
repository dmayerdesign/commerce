import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { ListFromIdsRequest, ListRequest } from '../../../api/requests/list.request'
import { SimpleError } from './http.models'

export abstract class RestService<T> {
    public abstract endpoint: string
    public getRequestType? = ListRequest
    public getSomeRequestType? = ListFromIdsRequest

    public documents: T[]
    protected getPump = new Subject<T[]>()
    public getStream: Observable<T[]>
    protected getErrorPump = new Subject<SimpleError>()
    public getErrorStream: Observable<SimpleError>

    constructor(protected httpClient: HttpClient) {
        this.getStream = this.getPump.asObservable()
        this.getErrorStream = this.getErrorPump.asObservable()

        this.getStream.subscribe((documents) => {
            this.documents = documents
        })
    }

    public async get(request?: ListRequest): Promise<void> {
        try {
            const docs = await this.getOnce(request)
            this.getPump.next(docs)
        }
        catch (error) {
            this.getErrorPump.next(error as SimpleError)
        }
    }

    public getOnce(request?: ListRequest): Promise<T[]> {
        let params = new HttpParams()
        if (request) params = params.set('request', JSON.stringify(request))
        return this.httpClient.get<T[]>(this.endpoint, { params }).toPromise()
    }

    public getSome(ids: string[]): Observable<T[]> {
        const request = new this.getSomeRequestType()
        request.ids = ids

        const params = new HttpParams().set('request', JSON.stringify(request))

        return this.httpClient.get<T[]>(this.endpoint, { params })
    }

    public getSomeOnce(ids: string[]): Promise<T[]> {
        return this.getSome(ids).toPromise()
    }

    public getOne(id: string): Observable<T> {
        return this.httpClient.get<T>(`${this.endpoint}/${id}`)
    }

    // public create?(doc: T): void
    // public update?(id: string, update: object): void
    // public delete?(id: string): void
}
