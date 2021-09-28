import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-hasil',
  templateUrl: './hasil.component.html',
  styleUrls: ['./hasil.component.css']
})
export class HasilComponent implements OnInit {
  mapel:any = {}
  _datas:any
  namaKelas:string
  guru:any

  dataCoplete:boolean = false
  viewRaport:boolean = false
  tahun:string// = new Date().getFullYear()
  tahun2:number =  new Date().getFullYear()+1
  semester:string
  buka:boolean = false
  // editDesc:boolean = false
  ambilData:number = 0
  constructor(private _data:DataService) {
    this._datas = this._data
    this.tahun = (new Date().getFullYear()).toString()

    if(new Date().getMonth() > 7){
      this.semester = "ganjil"
    }else{
      this.semester = "genap"
    }
   }

  ngOnInit() {
    let num = 0
    let load  = setInterval(()=>{
      num++
      console.log(num);
      this.getRaport()
      if(this.dataCoplete && this._data.dataProfil != undefined){
        this.mapel = this._data.dataProfil
        this._data.getData('kelas',this._data.dataProfil.id_kelas).subscribe((d)=>{
          this.namaKelas = d[0].kelas
          this.buka = d[0].buka
        })

        // console.log(this.mapel);
        
        clearInterval(load)
      }
    },100)
  
    // let tahun2 = Number()
    
  }

  tahunPelajaran(angka){
    let th = Number(angka)+1
    return Number(angka)+"/"+th
  }

  getRaport(){
    // console.log(this.dataCoplete);
    
    if(this.ambilData <= 1){
      this.ambilData++
      // console.log(this.ambilData);
      
      this._data.getData('raport',localStorage.getItem("login"),"rap").subscribe((dat:any)=>{
          let raps = dat.filter((a)=>{return a.tahunAjaran == this.tahun && a.semester == this.semester})[0]
          if(this._data.dataProfil != undefined){     
              this._data.getData('guru',this._data.dataProfil.id_kelas,"cari_guru").subscribe((m:any)=>{
                this.dataCoplete = true 
                this.guru =  m[0]
                console.log(m.length);
                Object.assign(this.mapel,raps)
                // console.log(this.mapel);
              })
          }
          // this.dataCoplete = true
      })
    }
  }

  lihatRaport(semester){
    if(this.semester == semester && this.buka){
      this.viewRaport = true
    }else{
      this.viewRaport = false
      alert("Maaf saat ini semester "+semester+" belum bisa diakses")
    }

    // if(this.semester == "ganjil"){
    //   this.viewRaport = true
    // }else{
    //   this.viewRaport = false
    //   alert("Maaf saat ini hanya bisa lihat semester genap")
    // }
  }

  cetak() {
    // this.judulCetak = true
    // this.hiddenExport = true
    setTimeout(()=>{
      this._data.convetToPDF("raport")
      // this.hiddenExport =false
      // this.judulCetak = false
    },200)
    
  }

}
