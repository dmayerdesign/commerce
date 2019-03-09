import { HttpClient } from '@angular/common/http'
import { Component, Input, OnInit } from '@angular/core'
import { InstagramPost } from '@qb/common/models/ui/instagram-post'
import { Observable } from 'rxjs'

@Component({
    selector: 'qb:web:instagram-feed',
    template: `
        <h1>Instagram feed works!</h1>
        <div class="qb:web:instagram-feed">
            <div class="qb:web:instagram-feed-carousel">
                <ng-container *ngFor="let post of postsStream | async">
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
export class InstagramFeedComponent implements OnInit {
    @Input() public apiEndpoint: string
    public postsStream: Observable<InstagramPost[]>

    constructor(
        public http: HttpClient,
    ) { }

    public ngOnInit(): void {
        this.postsStream = this.http.get<InstagramPost[]>(this.apiEndpoint)
    }
}
