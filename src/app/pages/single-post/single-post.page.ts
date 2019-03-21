import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.page.html',
  styleUrls: ['./single-post.page.scss'],
})
export class SinglePostPage implements OnInit {
  posts: Post[];
  postId: string;

  constructor(private route: ActivatedRoute, private postService: PostService) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.getPosts();
  }

  getPosts(event?: any) {
    const subscription = this.postService.getPostById(this.postId).subscribe((post: Post) => {
      subscription.unsubscribe();
      this.posts = [post];
      this.posts[0].id = this.postId;
      if (event) event.target.complete();
    });
  }
}
