import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-communitycomments',
  templateUrl: './communitycomments.page.html',
  styleUrls: ['./communitycomments.page.scss'],
})
export class CommunitycommentsPage implements OnInit {

  list:any[]=[];

    loading:any;
    data: any;
    errorMessage: string='';
    page = 1;
    perPage = 0;
    totalData = 0;
    totalPage = 0;
    nodataavailable:boolean = false;
    apiLoader:boolean = false;

    hasClick:any = false;

    PostData = { comment:'', questionId:'' };

    itemDetails:any;

  constructor(
    private navCtrl: NavController,
    private alertCtrl:AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private networkService: NetworkService
  ) { }

  ngOnInit() {
    // Retrieve the parameters from the route
    this.route.queryParams.subscribe(_p => {
      const navParams = this.router.getCurrentNavigation()?.extras.state;
      //console.log('Received parameters:', navParams); // Log received parameters
      if (navParams) {

        this.itemDetails = navParams['result'];
        //console.log('this.itemDetails----'+JSON.stringify(this.itemDetails));
        this.PostData.questionId = this.itemDetails.id;

        //this.loadList();

      }
    });
  }

  ionViewDidEnter() {
    this.loadList();
  }

  doRefresh(event: CustomEvent): void {
    this.page = 1;
    this.loadList();
    if (event) {
      event.detail.complete();
    }
  }

  loadList() {
      if(navigator.onLine !== true) {
        this.presentAlert('No Internet Connection!',"Please put Internet Connection ON and try again");
      }
      else {
        this.apiLoader = true;
    this.apiService.getCommentsList(this.page,this.PostData.questionId)
       .then(
         res => {
           this.apiLoader = false;
           this.data = res;
           //console.log("getBookings --"+JSON.stringify(this.data));
           this.list = this.data.result.data;
           this.perPage = this.data.result.per_page;
           this.totalData = this.data.result.total;
           this.totalPage = this.data.result.total_pages;
           if(this.data.result.total == 0) {
             this.nodataavailable = true;
           }
           else {
             this.nodataavailable = false;
           }
         }, error => {
          //console.log("Okay error while fetching data");
          this.apiLoader = false;
          this.errorMessage = <any>error
        });
  }
}

  doInfinite(infiniteScroll: any) {
  // Increment page number
  this.page++;

  // Simulate loading delay for better user experience
  setTimeout(() => {
      this.apiService.getCommentsList(this.page,this.PostData.questionId)
          .then(
              (res: any) => { // Explicitly type 'res' as 'any' or provide the correct type
                  // Concatenate new data to the existing list
                  this.list = this.list.concat(res.result.data);

                  // Update pagination variables
                  this.perPage = res.result.per_page;
                  this.totalData = res.result.total;
                  this.totalPage = res.result.total_pages;

                  // Complete infinite scroll
                  infiniteScroll.target.complete();

                  // Check if all data has been loaded
                  if (this.page >= this.totalPage) {
                      infiniteScroll.target.disabled = true;
                  }
              },
              error => {
                  console.error("Error while fetching data:", error);
                  // Handle error gracefully, optionally display an error message
                  // Hide loading indicator or show an error message
                  infiniteScroll.target.complete();
              }
          );
  }, 100); // Simulated loading delay
}

  postComment() {

  if(navigator.onLine !== true) {
    this.presentAlert('Internet Connection',"Please put data connection on and try again");
  }
  else if (this.PostData.comment === "") {
    this.presentAlert('',"Enter your comment");
  }
  else {

    this.hasClick = true;

    this.apiService.saveComment(this.PostData).then((result:any) => {
    this.hasClick = false;
    this.data = result;

    if(this.data.code == 1) {
      this.PostData.comment = "";
      this.loadList();
    }

    this.presentAlert('',this.data.message);

    }, (err:any) => {
      this.hasClick = false;
      this.presentAlert("","Request not sent. Please try again");
    });

  }

  }

  adjustTextarea(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
  }

  async presentAlert(header:any,message:any) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      cssClass: 'alertButtonCssAuto',
      buttons: ['OK']
    });

    await alert.present();
  }

}
