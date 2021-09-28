import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-kelas',
  templateUrl: './kelas.component.html',
  styleUrls: ['./kelas.component.css']
})
export class KelasComponent implements OnInit {
  kelas:string;
  allData:any = [];
  download:boolean = false

  constructor(private _data:DataService) { }

  ngOnInit() {
    this.tampilData();
  }

  tambah(){
    this._data.postData('kelas',{kelas:this.kelas}).subscribe(a=>{
      console.log("sukses tambah");
      this.tampilData()
      // this.allData.push(a)
      this.kelas = ""
    },(e)=>{
      console.log('error')
    })
  }



  tampilData(){
    this.allData = []
    this._data.getData('kelas').subscribe((data:any)=>{
      // this.allData = data;
      this._data.getData('siswa').subscribe((siswa:any)=>{
        data.forEach((val)=>{
          val.jumlah = siswa.filter((a)=>{ return a.id_kelas === val._id }).length
          this.allData.push(val)
        })
      })
    })
  }

  hapus(x,i){
    this._data.deleteData('kelas',x._id).subscribe(a=>{
      console.log("sukses terhapus");
      this.allData.splice(i,1)
      
    })
  }


  async exportExcel(){
    this.download = await true
  // this.hiddenExport = await true
  // this.numDataPage = await this.jumlahData
  setTimeout(()=>{
    this._data.exportExcel('kelas','Data Kelas')
    this.download = false
    // this.numDataPage = 5
  },0)
  
}
}
