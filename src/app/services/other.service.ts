import { Injectable } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class OtherService {

  constructor() {

  }

  async statusBar(color:any,style:any = 1)
  {
    StatusBar.setBackgroundColor({ color: color });
    if(style == 2)
    {
      StatusBar.setStyle({ style: Style.Dark });
    }
    else
    {
      StatusBar.setStyle({ style: Style.Light });
    }
  }

  async checkDevicePlatform() {
    const info = await Device.getInfo();
    if (info.platform === 'android') {
      console.log('This is an Android device');
      return "android";
    } else if (info.platform === 'ios') {
      console.log('This is an iOS device');
      return "ios";
    } else if (info.manufacturer && info.manufacturer.toLowerCase() === 'huawei') {
      console.log('This is a Huawei device');
      return "huawei";
    } else {
      console.log('This is a different platform');
      return "other";
    }
  }

}
