import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-raport',
  templateUrl: './raport.component.html',
  styleUrls: ['./raport.component.css']
})
export class RaportComponent implements OnInit {
  mapel:any
  allData:any = []
  allSiswa:any
  dataRaport:any = []
  dialogBox:boolean = false
  dataImportExcel:any = []
  download:boolean = false
  tahunAjaran:any = []
  tahunRaport:string// =  new Date().getFullYear()+"/"+Number(new Date().getFullYear())+1
  semester:string = "ganjil"
  tglRaport:Date
  _datas:any
  editTgl:boolean = false
  showRaport:boolean = false
  editDesc:boolean = false
  namaKelas:string = localStorage.getItem("waliKelas").split("|")[1]
  constructor(private _data:DataService) {
    this._datas = this._data
   }

  ngOnInit() {
    this.getAllData()
    this.getTahun()
    // console.log(this.tahunRaport);
    
  }
  
  update(){
    this._data.updateData('raport',this.mapel).subscribe(e=>{
      alert("sukses update")
      this.showRaport = false
      this.editDesc = false
      this.getAllData()
    })
  }

  getTahun(){
    let tahun = this._data.getTahun(new Date())
    // this.tahunRaport = new Date().getFullYear()+"/"+Number(new Date().getFullYear())+1
    for(let i = 5; i > 0;i--){
      this.tahunAjaran.push(tahun-i+"/"+Number(tahun-i+1))
      // console.log(tahun-i+"/"+Number(tahun-i+1));
      
    }
    for(let i = 0; i < 5;i++){
      this.tahunAjaran.push(tahun+i+"/"+Number(tahun+i+1))
      // console.log(tahun+i+"/"+Number(tahun+i+1));
      
    }
  
    
  }

  tahunPelajaran(angka){
    let th = Number(angka)+1
    return Number(angka)+"/"+th
  }

  getAllData(){ 
    // console.log(this.tahunRaport);
    
    this.dataImportExcel = []
    this.allData = []
    this.dataRaport = []
    this._data.getData('siswa',localStorage.getItem('waliKelas').split("|")[0],"perKelas").subscribe((data:any)=>{
      this.allSiswa = data
      console.log(data);
      
      this._data.getDataPerTahun('raport',this.tahunRaport,this.semester).subscribe((x:any)=>{
        this.dataRaport = x
        // console.log(x);
        
        this._data.ascStr(data,'namaSiswa').forEach((val,key)=>{
            let i = x//.filter((d)=>{return d.tahunAjaran == this.tahunRaport && d.semester == this.semester})
            .findIndex((z:any)=>{return z.id_siswa == val._id})
            if(i != -1){
              this.allData.push({nama:val.namaSiswa,nis:val.nis,nisn:val.nisn,...x[i]})
            }else{
              this.allData.push({nama:val.namaSiswa,id_siswa:val._id,nis:val.nis,nisn:val.nisn})

            }
         
           
            if(data.length -1 == key){
              // console.log(this.allData);
              
              if(x.length){
                this.tglRaport = x[0].tglRaport
              }
              
            }
        })
      })
    })
   
  }

  excel(event){
    this.dataImportExcel = []
    // let datas = ["No","id_siswa","nama","agama","pkn","bhsindo","bhsinggris","ipa","ips","matematika","senbud","penjas","prakarya"]
    let datas = ["No","id_siswa","nama",
				  "agama_peng",
				  "pkn_peng",
				  "bhsindo_peng",
				  "bhsinggris_peng",
				  "ipa_peng",
				  "ips_peng",
				  "matematika_peng",
				  "senbud_peng",
				  "penjas_peng",
				  "prakarya_peng",
				  "agama_ket",
				  "pkn_ket",
				  "bhsindo_ket",
				  "bhsinggris_ket",
				  "ipa_ket",
				  "ips_ket",
				  "matematika_ket",
				  "senbud_ket",
				  "penjas_ket",
				  "prakarya_ket",
				  "agama_peng_hrf",
				  "pkn_peng_hrf",
				  "bhsindo_peng_hrf",
				  "bhsinggris_peng_hrf",
				  "ipa_peng_hrf",
				  "ips_peng_hrf",
				  "matematika_peng_hrf",
				  "senbud_peng_hrf",
				  "penjas_peng_hrf",
				  "prakarya_peng_hrf",
				  "agama_ket_hrf",
				  "pkn_ket_hrf",
				  "bhsindo_ket_hrf",
				  "bhsinggris_ket_hrf",
				  "ipa_ket_hrf",
				  "ips_ket_hrf",
				  "matematika_ket_hrf",
				  "senbud_ket_hrf",
				  "penjas_ket_hrf",
				  "prakarya_ket_hrf",
				  "agama_peng_desc",
				  "pkn_peng_desc",
				  "bhsindo_peng_desc",
				  "bhsinggris_peng_desc",
				  "ipa_peng_desc",
				  "ips_peng_desc",
				  "matematika_peng_desc",
				  "senbud_peng_desc",
				  "penjas_peng_desc",
				  "prakarya_peng_desc",
				  "agama_ket_desc",
				  "pkn_ket_desc",
				  "bhsindo_ket_desc",
				  "bhsinggris_ket_desc",
				  "ipa_ket_desc",
				  "ips_ket_desc",
				  "matematika_ket_desc",
				  "senbud_ket_desc",
				  "penjas_ket_desc",
				  "prakarya_ket_desc",
				  "spiritual",
				  "sosial",
				  "spiritual_desc",
				  "sosial_desc",
				  "extra1",
				  "extra2",
				  "extra3",
				  "extra1_ket",
				  "extra2_ket",
				  "extra3_ket",
				  "sakit",
				  "izin",
          "alpa"]
          


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
        // console.log(data);
        
      }else{
        alert('Mohon gunakan format yang sudah di tentukan')
      }
      
    })
  }

  async exportExcel(){
      this.download = await true
    // this.hiddenExport = await true
    // this.numDataPage = await this.jumlahData
    setTimeout(()=>{
      this._data.exportExcel('siswa','Data Siswa')
      this.download = false
      // this.numDataPage = 5
    },0)
    
  }


  tambah(dataAll){
    console.log(dataAll);
    
    dataAll.forEach((val,n)=>{
      
      let i = this.dataRaport.findIndex((z:any)=>{return z.id_siswa == val.id_siswa  && z.semester === this.semester && z.tahunAjaran ===  this.tahunRaport.split("/")[0]})
      console.log(i);
      
      if(i === -1){
        val.tahunAjaran = this.tahunRaport.split("/")[0]
        val.semester = this.semester
        val.tglRaport = this.tglRaport
        this._data.postData('raport',val).subscribe(d=>{
          console.log("data ditambahkan");
        })
        // console.log(val.semester);
        
      }else{
        // console.log(val.semester);
        // console.log(val);
        val._id = this.dataRaport[i]._id
        val.tglRaport = this.tglRaport
        this._data.updateData('raport',val).subscribe(c=>{
          console.log("data di updatade");
        })
      }
      if(dataAll.length - 1 == n){
        this.getAllData()
        // this.dataImportExcel = []
        // console.log(this.dataImportExcel);
        
      }
   
    })
    this.dialogBox = false
    alert('data sudah di rubah')
  }

  detail(data){
    this.mapel = data
    console.log(this.mapel);
    this.showRaport = true;
  }

  // tambah2(){
  //   this.allData.forEach((val,n)=>{
  //     let i = this.dataRaport.findIndex((z:any)=>{return z.id_siswa == val.id_siswa})
  //     if(i == -1){
  //       this._data.postData('raport',val).subscribe(d=>{
  //         console.log("data ditambahkan");
  //       })
  //     }else{
  //       this._data.updateData('raport',val).subscribe(c=>{
  //         console.log("data di updatade");
        
  //         // this.allData[i] = val
  //         // this.allData[i].nama = val.nama
  //         // this.allData = this._data.ascStr(this.allData,'nama')
  //       })
  //     }
  //     if(this.allData.length - 1 == n){
  //       this.getAllData()
  //     }
  //   })
  // }

}
