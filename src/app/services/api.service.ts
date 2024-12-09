import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private loading: any;

  API_URL = environment.API_URL;
  hashedKey = environment.hashedKey;
  currentVersion = environment.currentVersion;

  browseroptions:any;

  constructor(
    private iab: InAppBrowser,
    public storage: Storage,
    private http:HttpClient
  ) {
    this.browseroptions = {
    location : 'no',//Or 'no'
    hidden : 'no', //Or 'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'no',//Android only ,shows browser zoom controls
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only
    //closebuttoncaption : 'Close', //iOS only
    //toolbar : 'yes', //iOS only
    //fullscreen : 'yes',//Windows only
    hidenavigationbuttons:'yes',
    toolbarposition:'bottom',
    toolbarcolor: '#F7C860',
    navigationbuttoncolor: '#4c5494',
    hideurlbar: 'yes',
  };
  }

  openLink(url:any) {
      const browser = this.iab.create(url, '_system');
  }

  login(email:any,password:any) {
  let accessToken = localStorage.getItem("PapricutAccessToken");
  let localinfo = {
    accessToken:accessToken,
    email:email,
    password:password,
    hashedKey:this.hashedKey
  };
  //console.log("login--"+JSON.stringify(localinfo), httpOptions);
  let httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      })
    };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'login', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => {
        resolve(res);
      }, (err:any) => {
        reject(err);
      });
  });
}

register(credentials:any) {
  let accessToken = localStorage.getItem("PapricutAccessToken");
  let referralCode = credentials.referralCode;
  let mobileNo = credentials.mobileNo;
  let email = credentials.email;
  let password = credentials.password;
  let firstName = credentials.firstName;
  let lastName = credentials.lastName;
  let accountType = credentials.accountType;
  let localinfo = {
	  accessToken:accessToken,
	  email:email,
	  password:password,
	  mobileNo:mobileNo,
	  firstName:firstName,
	  lastName:lastName,
    accountType:accountType,
	  referralCode:referralCode,
	  hashedKey:this.hashedKey
  };
  //console.log("register--"+JSON.stringify(localinfo), httpOptions);
  let httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      })
    };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'register', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => { //console.log("sucee--"+JSON.stringify(res));
        resolve(res);
      }, (err) => { //console.log("err--"+JSON.stringify(err));
        reject(err);
      });
  });
}

bookNow(
  credentials:any,
  outputFormat:any,
  filmingLocationsDetails:any,
  filmingLocations:any,
  nature:any,
  equipment:any,
  skills:any
) {
  let accessToken = localStorage.getItem("PapricutAccessToken");
  let localinfo = {
	  accessToken:accessToken,
	  email:credentials.email,
	  details:credentials.details,
	  phone_number:credentials.phone_number,
	  first_name:credentials.first_name,
	  last_name:credentials.last_name,
    country:credentials.country,
    city:credentials.city,
    start_date:credentials.start_date,
    end_date:credentials.end_date,
    company:credentials.company,
	  company_designation:credentials.company_designation,
    outputFormat:outputFormat,
    filmingLocationsDetails:filmingLocationsDetails,
    filmingLocations:filmingLocations,
    nature:nature,
    equipment:equipment,
    skills:skills,
	  hashedKey:this.hashedKey
  };
  //console.log("register--"+JSON.stringify(localinfo), httpOptions);
  let httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      })
    };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'bookNow', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
  });
}

loadCountries() {
  let localinfo = {
    accessToken:localStorage.getItem("PapricutAccessToken"),
    hashedKey:this.hashedKey
  };
  let httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    })
  };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'getCountries', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
  });
}

loadCities(countryId:any) {
  let localinfo = {
    countryId:countryId,
    accessToken:localStorage.getItem("PapricutAccessToken"),
    hashedKey:this.hashedKey
  };
  let httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    })
  };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'getCities', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
  });
}

getCategories() {
  let localinfo = {
    accessToken:localStorage.getItem("PapricutAccessToken"),
    hashedKey:this.hashedKey
  };
  let httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    })
  };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'getCategories', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
  });
}

getDashboard() {
  let localinfo = {
    accessToken:localStorage.getItem("PapricutAccessToken"),
    hashedKey:this.hashedKey
  };
  let httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    })
  };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'getDashboard', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
  });
}

getPhotographerProfile() {
  let localinfo = {
    accessToken:localStorage.getItem("PapricutAccessToken"),
    hashedKey:this.hashedKey
  };
  let httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    })
  };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'getPhotographerProfile', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
  });
}

updatePhotographerProfile(credentials:any) {
  let localinfo = {
    accessToken:localStorage.getItem("PapricutAccessToken"),
    hashedKey:this.hashedKey,
    first_name:credentials.first_name,
    last_name:credentials.last_name,
    country_id:credentials.country_id,
    city_id:credentials.city_id,
    phone_number:credentials.phone_number,
    whatsapp_number:credentials.whatsapp_number,
    bio:credentials.bio,
    category:credentials.category
  };
  let httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    })
  };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'updatePhotographerProfile', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
  });
}


changePassword(credentials:any) {
let accessToken = localStorage.getItem("PapricutAccessToken");
let cpassword = credentials.cpassword;
let oldpassword = credentials.oldpassword;
let password = credentials.password;
let localinfo = { accessToken:accessToken, cpassword:cpassword, currentPassword:oldpassword, newPassword:password, hashedKey:this.hashedKey };
//console.log("changePassword--"+JSON.stringify(localinfo), httpOptions);
let httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    })
  };
return new Promise((resolve, reject) => {
  this.http.post(this.API_URL+'changePassword', JSON.stringify(localinfo), httpOptions)
    .subscribe(res => {
      resolve(res);
    }, (err:any) => {
      reject(err);
    });
});
}

deleteAccount() {
let accessToken = localStorage.getItem("PapricutAccessToken");
let localinfo = {
  accessToken:accessToken,
  //description:credentials.description,
  hashedKey:this.hashedKey };
//console.log("deleteAccount--"+JSON.stringify(localinfo), httpOptions);
let httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    })
  };
return new Promise((resolve, reject) => {
  this.http.post(this.API_URL+'deleteAccount', JSON.stringify(localinfo), httpOptions)
    .subscribe(res => {
      resolve(res);
    }, (err:any) => {
      reject(err);
    });
});
}

forgotpass(credentials:any) {
let accessToken = localStorage.getItem("PapricutAccessToken");
  let email = credentials.email;
  let localinfo = {
    accessToken:accessToken,
    email:email,
    hashedKey:this.hashedKey
  };
  //console.log("forgotpass--"+JSON.stringify(localinfo), httpOptions);
  let httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      })
    };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'forgotPass', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => {
        resolve(res);
      }, (err:any) => {
        reject(err);
      });
  });
}

getCommunityList(pageNumber:any,isMine:any) {
let accessToken = localStorage.getItem("PapricutAccessToken");
  let localinfo = {
    accessToken:accessToken,
    hashedKey:this.hashedKey,
    pageNumber: pageNumber,
    isMine: isMine
  };
  //console.log("getCommunityList--"+JSON.stringify(localinfo), httpOptions);
  let httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      })
    };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'getCommunityList', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => {
        resolve(res);
      }, (err:any) => {
        reject(err);
      });
  });
}

saveCommunityItem(credentials:any) {
  let accessToken = localStorage.getItem("PapricutAccessToken");
  let localinfo = {
    id:credentials.id,
    question:credentials.question,
    accessToken:accessToken,
    hashedKey:this.hashedKey
  };
  //console.log("updateCommunityItem--"+JSON.stringify(localinfo), httpOptions);
  let httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      })
    };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'saveCommunityItem', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => {
        resolve(res);
      }, (err:any) => {
        reject(err);
      });
  });
}

deleteCommunityItem(id:any) {
  let accessToken = localStorage.getItem("PapricutAccessToken");
  let localinfo = {
    id:id,
    accessToken:accessToken,
    hashedKey:this.hashedKey
  };
  //console.log("updateCommunityItem--"+JSON.stringify(localinfo), httpOptions);
  let httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      })
    };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'deleteCommunityItem', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => {
        resolve(res);
      }, (err:any) => {
        reject(err);
      });
  });
}

getCommentsList(pageNumber:any,questionId:any) {
let accessToken = localStorage.getItem("PapricutAccessToken");
  let localinfo = {
    accessToken:accessToken,
    hashedKey:this.hashedKey,
    pageNumber: pageNumber,
    questionId: questionId
  };
  //console.log("getCommentsList--"+JSON.stringify(localinfo), httpOptions);
  let httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      })
    };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'getCommentsList', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => {
        resolve(res);
      }, (err:any) => {
        reject(err);
      });
  });
}

saveComment(credentials:any) {
  let accessToken = localStorage.getItem("PapricutAccessToken");
  let localinfo = {
    questionId:credentials.questionId,
    comment:credentials.comment,
    accessToken:accessToken,
    hashedKey:this.hashedKey
  };
  //console.log("updateCommunityItem--"+JSON.stringify(localinfo), httpOptions);
  let httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      })
    };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'saveComment', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => {
        resolve(res);
      }, (err:any) => {
        reject(err);
      });
  });
}

getBookings(pageNumber:any,status:any,year:any,city_id:any,country_id:any) {
let accessToken = localStorage.getItem("PapricutAccessToken");
  let localinfo = {
    accessToken:accessToken,
    hashedKey:this.hashedKey,
    pageNumber:pageNumber,
    status:status,
    year:year,
    city_id:city_id,
    country_id:country_id
  };
  //console.log("getBookings--"+JSON.stringify(localinfo), httpOptions);
  let httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      })
    };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'getBookings', JSON.stringify(localinfo), httpOptions)
      .subscribe(res => {
        resolve(res);
      }, (err:any) => {
        reject(err);
      });
  });
}

logout() {
let accessToken = localStorage.getItem("KikashaAccessToken");
let localinfo = { accessToken:accessToken, hashedKey:this.hashedKey };
//console.log("logout--"+JSON.stringify(localinfo), httpOptions);
let httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    })
  };

  this.storage.set('KikashaUphasLoggedIn', false);
  //this.storage.set('KikashaUphasSeenTutorial', 'false');
  localStorage.removeItem("Papricutcustomeremail");

  localStorage.removeItem("PapricutAccessToken");
  localStorage.removeItem("PapricutRightsGroup");
  localStorage.removeItem("Papricutcustomerfirstname");
  localStorage.removeItem("Papricutcustomerlastname");
  localStorage.removeItem("PapricutcustomermobileNo");
  localStorage.removeItem("PapricutisSuper");

return new Promise((resolve, reject) => {
  this.http.post(this.API_URL+'logout', JSON.stringify(localinfo), httpOptions)
    .subscribe(res => {
      resolve(res);
    }, (err:any) => {
      reject(err);
    });
});
}

checkVersion(platform:any) {
  let accessToken = localStorage.getItem("PapricutAccessToken");
  let localinfo = { platform: platform, accessToken:accessToken, version:this.currentVersion, url:this.API_URL, hashedKey:this.hashedKey };
  return new Promise((resolve, reject) => {
    this.http.post(this.API_URL+'checkVersion', JSON.stringify(localinfo))
      .subscribe(res => {
        resolve(res);
      }, (err:any) => {
        reject(err);
      });
  });
}

}
