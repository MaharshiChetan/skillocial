import { Component, OnInit } from '@angular/core';
import { Title } from 'src/app/models/title';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from 'src/app/services/title/title.service';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-titles',
  templateUrl: './titles.page.html',
  styleUrls: ['./titles.page.scss'],
})
export class TitlesPage implements OnInit {
  uid: string;
  titles: Title[];
  type: string = 'thumbnail';
  currentUserProfile: User;
  constructor(
    private route: ActivatedRoute,
    private titleservice: TitleService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('id');
    this.getTitles();
    this.currentUserProfile = await this.userService.getCurrentUser();
  }

  getTitles(event?: any) {
    const subscription = this.titleservice.getTitles(this.uid).subscribe((titles: any) => {
      subscription.unsubscribe();
      this.titles = titles;
      if (event) event.target.complete();
    });
  }
}
