import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'raport';
  router:string = 'guru'
  _datas:any = "guru"
  login:boolean = false

  constructor(private _data:DataService) {
    this._datas = this._data
    if(this._data.sebagai == "siswa"){
      this._data.router = "hasil"  
    } else{
      this._data.router = "guru"
    }
     

    if(localStorage.getItem('login')){
      this.login = true
    }else{
      this.login = false
    }
  
    
    
  }
}
