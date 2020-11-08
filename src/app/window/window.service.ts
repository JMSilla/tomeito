import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron'

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  constructor(private electronService: ElectronService) { }

  resize(route: string) {
    if (this.electronService.ipcRenderer)
      this.electronService.ipcRenderer.send('resize-' + route)    
  }
}
