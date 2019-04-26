import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-battles-list',
  templateUrl: './battles-list.page.html',
  styleUrls: ['./battles-list.page.scss']
})
export class BattlesListPage implements OnInit {
  battleList: any = null;
  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.battleList = [1, 2, 3, 4, 5, 6, 7, 8];
    }, 1000);
  }
}
