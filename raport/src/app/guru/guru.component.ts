import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';


@Component({
  selector: 'app-guru',
  templateUrl: './guru.component.html',
  styleUrls: ['./guru.component.css']
})
export class GuruComponent implements OnInit {
  guru:any = {}
  dataKelas:any = [];
  // kelas:string;
  allData:any = [];
  dataImportExcel:any = []
  dialogBox:boolean = false;
  walikelas:boolean = false;
  namaGuru:any
  siapEdit:boolean =false
  _datas:any
  namaKelas:string 
  publish:boolean = false
  // id_kelas:string

  constructor(private _data:DataService) {
    this._datas = this._data
   }

  async ngOnInit() {
    this.guru.status = "guru"
    await this.getKelas()
    await this.getGuru()

    if(this._data.sebagai == "guru"){
    let num = 0
    let load  = setInterval(()=>{
      num++
      console.log(num);
      
          if(this._data.loadData && localStorage.getItem('waliKelas')){
            this.guru = this._data.dataProfil
            this.namaKelas = localStorage.getItem('waliKelas') ? localStorage.getItem('waliKelas').split("|")[1] : null
            // this.id_kelas = localStorage.getItem('waliKelas') ? localStorage.getItem('waliKelas').split("|")[0] : null
            clearInterval(load)
          }
        },100)
      }
    
  }

  shareRaport(){

    this._data.updateData('kelas',{_id:localStorage.getItem('waliKelas').split("|")[0],buka:this.publish}).subscribe((e:any)=>{
      // alert("raport sudah bisa di lihat siswa")
      console.log(e);
      if(e.buka){
        alert("raport sudah bisa di lihat siswa")
      }else{
        alert("raport di tutup, siswa tidak bisa akses raport")
      }
    })
  }

  edit(id,i){
    this.guru = id;
    this.guru.index = i
  }

  hapus(da,i){
    this._data.deleteData('guru',da._id).subscribe(a=>{
      alert("Guru sudah di hapus")
      this.allData.splice(i,1)
    })
  }

  getKelas(){
    // return new Promise((resolve,reject)=>{
      this._data.getData('kelas').subscribe((a:any)=>{
        this.dataKelas = a
        if(this._data.sebagai == 'guru'){
          let load = setInterval(()=>{
              if(localStorage.getItem('waliKelas')){
                let i = a.findIndex((m)=>{ return m._id == localStorage.getItem('waliKelas').split("|")[0]})
                if(i != -1){
                  this.publish = a[i].buka
                }
                clearInterval(load)
              }
          },200)
        }
       
      })
    // })
  }
    
  
  getGuru(){
    this.allData = []
    // return new Promise((resolve,reject)=>{
      this._data.getData('guru').subscribe((a:any)=>{
        this.namaGuru = a
        a.forEach((val:any,key)=>{
          // console.log(val.id_kelas);
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
    })

   
    
  }

  pilihData(){
    this.siapEdit = false
    if(this.walikelas){
      this.allData  = this.allData.filter((a)=>{return a.status == "wali"})
    }else{
      this.getGuru()
    }
  }

  tambah(){
    if(this.dataImportExcel.length){
      this.dataImportExcel.forEach((val)=>{
        console.log(val);
        this._data.postData('guru',val).subscribe(a=>{
          console.log("guru di tambahkan");
          // this.getGuru();
          this.allData.push(a)
          this.dialogBox = false;
        })
      })
    }
    
  }

  getIdKelas(event){
    if(event.target.value != "" && event.target.value != null){
      let i = this.dataKelas.findIndex((a:any)=>{ return a.kelas == event.target.value})
      if( i != -1){
        let n = this.allData.findIndex((c:any)=>{ return c.id_kelas == this.dataKelas[i]._id})
        if(n == -1){
          this.guru.id_kelas = this.dataKelas[i]._id
        }else{
          alert("kelas sudah ada walinya")
          this.guru.kelas = ""
        }
        
      }else{
        alert("kelas tidak terdaftar")
      }
    }else{
      alert("kelas tidak boleh kosong")
    }
    
  }

  getIdGuru(event){
    if(event.target.value != "" && event.target.value != null){
      let i = this.allData.findIndex((a:any)=>{ return a.namaGuru == event.target.value})
      if( i != -1){
        this.guru = this.allData[i]
        // console.log(this.guru._id);
        
      }else{
        alert("Guru tidak terdaftar")
      }
    }else{
      alert("Nama guru tidak boleh kosong")
    }
    
  }

  excel(event){
    this.dataImportExcel = []
    let datas = ["namaGuru","nip","gol","status","password"]
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

  update(){
      if(this.guru.status == "guru"){
        this.guru.id_kelas = null
      }
      this._data.updateData('guru',this.guru).subscribe((a:any)=>{
      if(this._data.sebagai == "admin"){
        this.allData[this.guru.index].kelas = this.guru.kelas
        this.guru  = {}
        this.siapEdit = false
      }
        alert("Sukses update")
       
      },(e)=>{
        alert("gagal update")
      })
  }


  upload(e){
    this.uploadEvent(e).then(data=>{
      this._data.upload(data,localStorage.getItem("login")).subscribe((r:any)=>{
        let data = {_id:localStorage.getItem('login'),foto:r.foto}
        this._data.updateData('guru',data).subscribe((s)=>{
          console.log("update dan upload sukses");
          alert("berhasil upload")
          
        })  
      })
    })
  }

  uploadEvent(event){
    return new Promise((resolve, reject)=>{
        let img
        let file=<File>event.target.files[0]
        let reader = new FileReader();
        img = new FormData()
        img.append('image',file)
        reader.readAsDataURL(file)
      setTimeout(()=>{
        resolve(img)
      },1000)
    })
  }
}
