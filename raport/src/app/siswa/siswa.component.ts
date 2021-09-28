import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-siswa',
  templateUrl: './siswa.component.html',
  styleUrls: ['./siswa.component.css']
})
export class SiswaComponent implements OnInit {

  dialogBox:boolean = false;
  dataImportExcel:any = []
  allData:any = [];
  siswa:any = {}
  dataKelas:any = []
  jumlah:number = 0
  pilihKelas:any = {id_kelas:''}

  siapEdit:boolean = false
  constructor(private _data:DataService) { }

  ngOnInit() {
    this.getKelas();
  }

  addNew(){
    this._data.postData('siswa',this.siswa).subscribe(a=>{
      console.log(a);
      this.getSiswa()
      this.siswa = {}
    })
  }

  update(){
    this._data.updateData('siswa',this.siswa).subscribe(a=>{
      console.log("sukses update");
      // this.getSiswa();
      this.siswa = {}
      alert("Sukses update")
    },(e)=>{
      alert("gagal update")
    })
  }

  excel(event){
    this.dataImportExcel = []
    let datas = ["namaSiswa","nis","nisn","sex","kelas"]
    let cek:boolean = false
   
    this._data.xlsToJson(event).then(async(data:any)=>{
      await Object.keys(data[0]).forEach((key,i)=>{
        if(datas.indexOf(key) < 0){
              cek = true
            }            
      })
      

      event.target.value = ''
      if(!cek){
        // this.boxImportExcel = true
        this.dialogBox = true
        this.dataImportExcel = data
        console.log(data);
        
      }else{
        alert('Mohon gunakan format yang sudah di tentukan')
      }
      
    })
  }

  getSiswa(){
      this.allData = []
      this._data.getData('siswa').subscribe((a:any)=>{
      if(this.dataKelas.length){
       this._data.ascStr(a,'namaSiswa').forEach((val:any,key)=>{
          if(val.id_kelas != null && val.id_kelas != undefined){
            let i = this.dataKelas.findIndex((z:any)=>{ return z._id == val.id_kelas})
            if(i != -1){
              val.kelas = this.dataKelas[i].kelas;
            }else{
              val.kelas = ""
            }
          }
          this.allData.push(val)
        })
      }
     
    })
    
  }

  getIdKelas(event){
    if(event.target.value != "" && event.target.value != null){
      let i = this.dataKelas.findIndex((a:any)=>{ return a.kelas == event.target.value})
      if( i != -1){
          this.siswa.id_kelas = this.dataKelas[i]._id
      }else{
        alert("kelas tidak terdaftar")
      }
    }else{
      alert("kelas tidak boleh kosong")
    }
    
  }

  getKelas(){
    this._data.getData('kelas').subscribe((a:any)=>{
      this.dataKelas = a   
      this.getSiswa()
    })
  }

  tambah(){
    if(this.dataImportExcel.length){
      if(this.dataKelas.length){
        this.dataImportExcel.forEach((val,n)=>{
            let i = this.dataKelas.findIndex((z:any)=>{return z.kelas == val.kelas})
            if(i == -1){
              val.id_kelas = null
            }else{
              val.id_kelas = this.dataKelas[i]._id
            }
            console.log(val);
            
          this._data.postData('siswa',val).subscribe(a=>{
            console.log("siswa di tambahkan");
            // this.getSiswa();
            this.dialogBox = false;
            if(this.dataImportExcel.length - 1 == n){
              this.getKelas()
            }
          })
        })
      }
    }
    
  }


  edit(dat){
    this.siswa = dat;
  }


  hapus(x,i){
    this._data.deleteData('siswa',x._id).subscribe((a:any)=>{
      this.allData.splice(i,1)
      alert("siswa di hapus")
    })
  }


  
}
