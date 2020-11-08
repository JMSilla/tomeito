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
  numberOfPomodoros: number = 0

  constructor(private windowService: WindowService,
    private router: Router)
  {
    
  }

  onActivate(elementRef) {
    if (elementRef.numberOfPomodorosChange) {
      elementRef.numberOfPomodorosChange.subscribe(event => {
        console.log(event)
        this.numberOfPomodoros = event
      })
    }
  }

  close() {
    window.close()
  }

  settings() {
    this.windowService.resize("config")
    this.router.navigateByUrl("config")
  }
}
