import { HttpClient } from '@angular/common/http'
import { Component, Input, OnInit } from '@angular/core'
import { InstagramPost } from '@mte/common/models/ui/instagram-post'
import { Observable } from 'rxjs'

@Component({
    selector: 'mte-instagram-feed',
    template: `
        <h1>Instagram feed works!</h1>
        <div class="mte-instagram-feed">
            <div class="mte-instagram-feed-carousel">
                <ng-container *ngFor="let post of postss | async">
                    <ng-container *ngIf="!!post.images">
                        <div>
                            <img [src]="post.images.low_resolution?.url">
                        </div>
                    </ng-container>
                </ng-container>
            </div>
        </div>
    `
})
export class MteInstagramFeedComponent implements OnInit {
    @Input() public apiEndpoint: string
    public postss: Observable<InstagramPost[]>

    constructor(
        public http: HttpClient,
    ) { }

    public ngOnInit(): void {
        this.postss = this.http.get<InstagramPost[]>(this.apiEndpoint)
    }
}
