import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-thumbnail-posts',
  templateUrl: './thumbnail-posts.component.html',
  styleUrls: ['./thumbnail-posts.component.scss'],
})
export class ThumbnailPostsComponent implements OnInit {
  @Input('posts') posts: Post[];

  constructor() {}

  ngOnInit() {}
}
