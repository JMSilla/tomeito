import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { WindowService } from './window/window.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tomeito'

  constructor(private windowService: WindowService,
    private router: Router)
  {
    
  }

  close() {
    window.close()
  }

  settings() {
    this.windowService.resize("config")
    this.router.navigateByUrl("config")
  }
}
