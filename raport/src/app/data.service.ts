import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import  {environment} from '../environments/environment';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import  * as html2pdf from 'html2pdf.js';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl:string =  'http://43.252.237.153:52301/data/' //"http://localhost:8080/data/" //
  baseUrl2:string = 'http://43.252.237.153:52301/' //"http://localhost:8080/" //
  notify:boolean = false
  isiPesan:string
  router:string
  mobile:boolean = false
  sebagai:string = localStorage.getItem('as')
  dataProfil:any = {}
  loadData:boolean = false
  bulan:any = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

  private headers = new HttpHeaders({
    'Content-Type':  'application/json',
    'auth':// environment.token,
    'Bypass-Tunnel-Reminde'
  })
  
  constructor(private _http:HttpClient) {
    if(window.innerWidth > 600){
      this.mobile = true
    }
  }


  getData(tabel,id = null,field = null){
    if(id == null){
      return this._http.get(this.baseUrl+tabel,{headers:this.headers})
    }else if(id != null && field != null){
      return this._http.get(this.baseUrl+tabel+"/"+id+"/"+field,{headers:this.headers})
    }else{
      return this._http.get(this.baseUrl+tabel+"/"+id,{headers:this.headers})
    }
    
  }

  getDataLogin(tabel,inden,inden2){
    return this._http.get(this.baseUrl2+"login/"+tabel+"/"+inden+"/"+inden2,{headers:this.headers})
  }

  getDataPerTahun(tabel,tahun,semester){
    return this._http.get(this.baseUrl2+"raport/"+tabel+"/"+tahun+"/"+semester,{headers:this.headers})
  }

  postData(tabel,data){
    return this._http.post(this.baseUrl+tabel,data,{headers:this.headers})
  }

  deleteData(tabel,id){
    return this._http.delete(this.baseUrl+tabel+"/"+id,{headers:this.headers})
  }

  updateData(tabel,data){
    return this._http.put(this.baseUrl+tabel,data,{headers:this.headers})
  }

  upload(data,id){
    return this._http.post(this.baseUrl2+"upload/"+(id+new Date()).replace(/\s/g,'')+"~"+environment.token,data)
  }

  notif(pesan:string){
    this.notify = true;
    this.isiPesan = pesan
    setTimeout(()=>{
      this.notify = false
    },2000)
  }

  xls2Tanggal(tgl){
    // var offset = new Date(0).getTimezoneOffset()
    let jsdate = new Date(0, 0, tgl-1, 0, -new Date(0).getTimezoneOffset(), 0);

    return jsdate//this.formatAngka(new Date(jsdate.toJSON()).getDate(),2)+""+ this.formatAngka(Number(new Date(jsdate.toJSON()).getMonth()+1),2)+""+new Date(jsdate.toJSON()).getFullYear()
  }

  xlsToJson(event){

    return new Promise((resolve,reject)=>{
      let workBook = null;
      let jsonData = null;
      const reader = new FileReader();
      reader.readAsBinaryString(event.target.files[0]);
      reader.onload = (e) => {
        workBook =  XLSX.read(reader.result, { type: 'binary' });
        jsonData =  workBook.SheetNames.reduce((initial, name) => {
          resolve(XLSX.utils.sheet_to_json(workBook.Sheets[name]));
        }, {});
      }
  })
  }

  exportExcel(id,nama){
    var workbook = XLSX.utils.table_to_book(document.getElementById(id))
    XLSX.writeFile(workbook, nama+'.xlsx');
  }

 
  descTgl(data,objek){
    return data.sort((a,b)=>{ return new Date(b[objek]).getFullYear() - new Date(a[objek]).getFullYear() || new Date(b[objek]).getMonth() - new Date(a[objek]).getMonth() ||
                      new Date(b[objek]).getDate() - new Date(a[objek]).getDate() })
                      // return data
  }

  ascTgl(data,objek){
      return data.sort((a,b)=>{ return new Date(a[objek]).getFullYear() - new Date(b[objek]).getFullYear() || new Date(a[objek]).getMonth() - new Date(b[objek]).getMonth() ||
                      new Date(a[objek]).getDate() - new Date(b[objek]).getDate()})
  // return data
  }

  ascStr(data,objek){
    return data.sort((a,b)=>{
      return (a[objek] > b[objek]) ? 1 : ((b[objek] > a[objek]) ? -1 : 0)
    })
  }

  descStr(data,objek){
    return data.sort((a,b)=>{
      return (a[objek] > b[objek]) ? -1 : ((b[objek] > a[objek]) ? 1 : 0)
    })
  }

  getBulan(data){
    return new Date(data).getMonth()
  }

  getTahun(data){
    return new Date(data).getFullYear()
  }

  getHarian(data){
    return new Date(data).getDate()
  }

  formatTanggal(data){
    return this.getHarian(data)+' '+this.bulan[this.getBulan(data)]+' '+this.getTahun(data)
  }

  separator(angka){
    if(angka != null){
      return angka.replace(/,/g,'.')
    }
  }


  cekRequired(arr,objek,number = null){
    return new Promise((resolve)=>{
    let cek =  false
       arr.forEach((a,i)=>{
        if(objek[a] == undefined || objek[a] == null || objek[a] == ''){
          cek = true
          if(number != null){
            objek[a] = 0
          }
          // console.log(a)
        } 
        if(arr.length == 1+i){
          resolve(cek)
          // console.log(cek)
        }
        
      })
    })
  }

  
  download(url){
    return this._http.get(url, {responseType: 'arraybuffer',headers:this.headers})
  }


convetToPDF2(id){

    let data = document.getElementById(id);

    html2canvas(data).then(canvas => {
      console.log(canvas)
    // Few necessary setting options
    let imgWidth = 320//canvas.width * 300 / canvas.height;//200;
    // let pageHeight = 295;
    let imgHeight =  canvas.height * imgWidth / canvas.width;
    // let heightLeft = imgHeight;
    // console.log(canvas.height * imgWidth / canvas.width)
    const contentDataURL = canvas.toDataURL('image/jpg',1.0)
    let pdf = new jspdf('p', 'mm', [canvas.width, canvas.height]); // A4 size page of PDF
    let position = 3;

    pdf.addImage(contentDataURL, 'jpg', 5, position,  imgWidth, imgHeight)
    // pdf.save('new-file.pdf'); // Generated PDF
    window.open(pdf.output('bloburl'), '_blank')
    // window.open(pdf.output('datauri'), '_blank')
    });
  }
  

  convetToPDF3(id){
    let data = document.getElementById(id);

    html2canvas(data).then(canvas => {
      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      // enter code here
      const imgData = canvas.toDataURL('image/jpg',1.0)

      var doc = new jspdf('p', 'mm');
      // doc.internal.scaleFactor = 2.35;
      var position = 10;

      doc.addImage(imgData, 'PNG', 10, position, imgWidth-17, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
      position = heightLeft - imgHeight+10;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 10, position, imgWidth-17, imgHeight);
      heightLeft -= pageHeight-10;
      }
      // doc.save( 'file.pdf');
      window.open(doc.output('bloburl'), '_blank')
  
    })
  }

  convetToPDF(id){
    var element = document.getElementById(id);
    element.style.width = "100%"
    var opt = {
      margin:      [-20,-50,30 ,-10],
      filename:     id+'.pdf',
      image:        { type: 'jpeg', quality: 0.98  },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy', 'whiteline'] },
      html2canvas:  { scale: 1,dpi: 192, letterRendering: true, logging: true, allowTaint: false, useCORS: true},
      jsPDF:        { unit: 'mm', format:"legal",  orientation: 'portrait' }
    };
    // console.log(element.offsetWidth);
    // if(element.offsetWidth > 1200){
    //   // element.style.fontSize = "7pt"
    //   opt.jsPDF.format = 'legal'
    // }
    element.style.fontSize = "12pt"
    // }
    // else{
    //   element.style.fontSize = "10pt"
    // }
    
    
    // New Promise-based usage:
    // html2pdf().set(opt).from(element).save();
    html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {
      window.open(pdf.output('bloburl'), '_blank');
      element.style.fontSize = "10pt"
    });
  }


  convetToPDF6(id,nama){
    let data = document.getElementById(id);
    html2canvas(data, { logging: true, allowTaint: false, useCORS: true }).then(canvas => {
    // Few necessary setting options
    // {allowTaint : true}
    let imgWidth = 190;
    let pageHeight = 1000;
    let imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    
    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jspdf('p', 'mm', 'letter'); // A4 size page of PDF
    let position = 3;
    // pdf.addImage(contentDataURL, 'PNG', 20, 10, imgWidth, imgHeight)
    // pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight)
    pdf.addImage( contentDataURL,'PNG',0,0,canvas.width*0.2,canvas.height*0.2,"a","FAST");
    pdf.save(nama+'.pdf'); // Generated PDF
    // window.open(pdf.output('bloburl'), '_blank')
    // window.open(pdf.output('datauri'), '_blank')
    });
  }
 
}
