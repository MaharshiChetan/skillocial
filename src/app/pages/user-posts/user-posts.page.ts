import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.page.html',
  styleUrls: ['./user-posts.page.scss'],
})
export class UserPostsPage implements OnInit {
  uid: string;
  posts: Post[];
  type: string = 'thumbnail';
  constructor(private route: ActivatedRoute, private postService: PostService) {}

  ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('id');
    this.getPosts();
  }

  getPosts(event?: any) {
    const subscription = this.postService.getPosts(this.uid).subscribe((posts: any) => {
      subscription.unsubscribe();
      this.posts = posts;
      console.log(this.posts);

      if (event) event.target.complete();
    });
  }
}
