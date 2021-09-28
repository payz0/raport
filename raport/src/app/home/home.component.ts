import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  login:any = {}

  constructor(private _data:DataService) { }

  ngOnInit() {
    this.login.sebagai = ""
  }

  getLogin(){
    if(this.login.sebagai == "guru"){
      this.getDatabase('guru',this.login.user,this.login.pass)
    }else if(this.login.sebagai == "siswa"){
      this.getDatabase('siswa',this.login.user,this.login.pass)
    }else{
      this.getDatabase('admin',this.login.user,this.login.pass)
    }
  }

  getDatabase(tabel,iden,iden2){
    this._data.getDataLogin(tabel,iden,iden2).subscribe((a:any)=>{
      console.log(a.length);
      if(a.length == 1){
        localStorage.setItem("login",a[0]._id)
        localStorage.setItem("as",tabel)
        location.reload();

      }else{
        alert("salah user atau passord silahkan hubungi admin")
      }
    },(e)=>{
      alert("salah user atau passord silahkan hubungi admin")
    })
  }
}
