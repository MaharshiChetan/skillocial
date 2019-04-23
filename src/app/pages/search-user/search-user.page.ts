import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.page.html',
  styleUrls: ['./search-user.page.scss']
})
export class SearchUserPage implements OnInit {
  username: string;
  users: any;
  constructor(private userService: UserService) {}

  ngOnInit() {}

  searchUser() {
    this.userService.checkUsername(this.username).subscribe(users => {
      this.users = users;
    });
  }

  onCancel(event: any) {
    this.username = '';
  }
}
