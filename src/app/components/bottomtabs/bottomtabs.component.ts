import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottomtabs',
  templateUrl: './bottomtabs.component.html',
  styleUrls: ['./bottomtabs.component.scss'],
})
export class BottomtabsComponent  implements OnInit {

  @Input() pageName!: string;

  activeTab: string = 'home';

  constructor(
    private router: Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.activeTab = this.pageName;
  }

  openHome() {
    //this.activeTab = "home";
    this.navCtrl.navigateRoot('/home');
  }

  openBookings() {
    //this.activeTab = "tags";
    this.router.navigate(['/bookings']);
  }

  openMyaccount() {
    this.router.navigate(['/myaccount']);
  }

}
