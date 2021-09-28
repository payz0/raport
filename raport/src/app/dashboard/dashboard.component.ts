import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  _datas:any
  dataProfil:any = {}
  constructor(private _data:DataService) {
    this._datas = this._data
    // this.dataProfil = this._data.dataProfil
   }

  ngOnInit() { 
    this.getDataProfil()
  }

  logout(){
    localStorage.clear();
    location.reload()
  }

  getDataProfil(){
    this._data.getData(localStorage.getItem('as'),localStorage.getItem('login')).subscribe((a:any)=>{
      this.dataProfil = a[0]
      this._data.dataProfil = a[0]
      this._data.loadData = true
      // console.log(a[0]);
      // console.log(a[0]);
      
      if(a[0].status == 'wali'){
        this._data.getData('kelas',a[0].id_kelas).subscribe((dat:any)=>{
          // console.log(dat);
          localStorage.setItem('waliKelas',dat[0]._id+"|"+dat[0].kelas)
        })
      }
    })
  }
}
