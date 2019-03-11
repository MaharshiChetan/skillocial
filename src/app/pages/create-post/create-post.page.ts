import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { NavController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { CameraService } from 'src/app/services/camera/camera.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post/post.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Post } from 'src/app/models/post';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit, OnDestroy {
  currentUserProfile: User;
  postId: any;
  post: Post;
  postForm: FormGroup;

  constructor(
    public cameraService: CameraService,
    private loadingService: LoadingService,
    private afStorage: AngularFireStorage,
    private userService: UserService,
    private route: ActivatedRoute,
    private postService: PostService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private afStore: AngularFirestore,
    private toastService: ToastService
  ) {
    this.buildForm();
  }

  async ngOnInit() {
    this.currentUserProfile = await this.userService.getCurrentUser();
    this.postId = this.route.snapshot.paramMap.get('id');
    console.log(this.postId);
    if (this.postId) this.getPost();
  }

  ngOnDestroy() {
    this.cameraService.chosenPicture = null;
  }

  getPost() {
    const subscription = this.postService.getPostById(this.postId).subscribe((post: any) => {
      this.post = post;
      this.buildForm();
      subscription.unsubscribe();
    });
  }

  buildForm(): any {
    if (this.postId) {
    } else {
      this.postForm = this.formBuilder.group({
        textualContent: [null],
      });
    }
  }

  async addPost() {
    if (!this.cameraService.chosenPicture) {
      await this.toastService.showToast('Please select photo for your post!', 'top');
      return;
    }
    await this.loadingService.show('Creating post...');
    let imageId = this.post ? this.post.imageId : this.afStore.createId();

    const imageStore = this.afStorage.storage
      .ref('/userPostImages')
      .child(`${this.currentUserProfile.uid}/${imageId}`);
    if (this.cameraService.chosenPicture) {
      await imageStore.putString(this.cameraService.chosenPicture, 'data_url');
      const imageUrl = await imageStore.getDownloadURL();
      this.updatePostDetails(imageUrl, imageId);
    } else {
      this.updatePostDetails();
    }

    if (this.postId) this.updatePost();
    else this.postService.addPost(this.post);
    await this.loadingService.hide();
    await this.navCtrl.pop();
    this.postForm.reset();
  }

  updatePostDetails(imageUrl?: string, imageId?: string) {
    if (!imageUrl && this.post) {
      imageUrl = this.post.imageUrl;
    }
    this.post = this.postForm.value;
    this.post.imageUrl = imageUrl;
    this.post.imageId = this.postId ? this.post.imageId || null : imageId;
    this.post.uid = this.currentUserProfile.uid;
    if (this.postId) {
      this.post.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      this.post.createdAt = this.post.updatedAt || firebase.firestore.FieldValue.serverTimestamp();
    } else {
      this.post.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      this.post.updatedAt = this.post.createdAt;
    }
  }

  async updatePost() {
    await this.postService.updatePost(this.post, this.postId);
  }
}
