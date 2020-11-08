import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WindowService } from '../../window/window.service';
import { TomeitoConfig } from '../model/tomato-config';
import { ConfigService } from '../service/config.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  config: TomeitoConfig

  constructor(private windowService: WindowService,
    private router: Router, private configService: ConfigService)
  {
    this.config = configService.getConfig()
  }

  saveConfig() {
    this.configService.saveConfig(this.config)
  }

  return() {
    this.windowService.resize("tomeito")
    this.router.navigateByUrl("")
  }
}
