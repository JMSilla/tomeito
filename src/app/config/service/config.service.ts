import { Injectable } from '@angular/core';
import { TomeitoConfig } from '../model/tomato-config'

const TOMEITO_CONFIG_STORAGE_KEY = "TOMEITO_CONFIG"

@Injectable({
  providedIn: "root"
})
export class ConfigService {
  private config: TomeitoConfig;

  constructor() {
    let storedTomeitoConfig = localStorage.getItem(TOMEITO_CONFIG_STORAGE_KEY)

    if (storedTomeitoConfig)
      this.config = JSON.parse(storedTomeitoConfig)
    else
      this.config = new TomeitoConfig()
  }

  getConfig() {
    return this.config
  }

  saveConfig(config: TomeitoConfig) {
    this.config = config;
    localStorage.setItem(TOMEITO_CONFIG_STORAGE_KEY, JSON.stringify(config))
  }
}
