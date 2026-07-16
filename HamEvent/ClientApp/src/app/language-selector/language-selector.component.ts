import { Component, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatOption } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';

interface Language {
  code: string;
  name: string;
  icon: string; // Path to the icon in the assets folder
}

@Component({
    selector: 'app-language-selector',
    templateUrl: './language-selector.component.html',
    styleUrls: ['./language-selector.component.css'],
  standalone: true,
  imports: [MatFormField, MatSelect, MatLabel, NgFor, MatOption, FlexModule, TranslateModule]
})

export class LanguageSelectorComponent {
  @Output() languageChanged = new EventEmitter<string>();

  changeLanguage(lang: string) {
    this.languageChanged.emit(lang);
  }
  languages: Language[] = [
    { code: 'en', name: 'English', icon: 'assets/icons/gb.svg' },
    { code: 'ro', name: 'Romana', icon: 'assets/icons/ro.svg' },
    { code: 'de', name: 'Deutsch', icon: 'assets/icons/de.svg' },
    { code: 'it', name: 'Italiano', icon: 'assets/icons/it.svg' },
    { code: 'fr', name: 'Français', icon: 'assets/icons/fr.svg' },
    { code: 'es', name: 'Español', icon: 'assets/icons/es.svg' },
    { code: 'hu', name: 'Magyar', icon: 'assets/icons/hu.svg' },
    { code: 'bg', name: 'Български', icon: 'assets/icons/bg.svg' },
    { code: 'sr', name: 'Srpski', icon: 'assets/icons/sr.svg' }
  ];
  selectedLanguage = this.languages[0].code;
  siteLanguage = 'English';
  constructor(private translate: TranslateService) { }

  onLanguageChange(langCode: string) {
    const selectedLanguage = this.languages.find((language) => language.code === langCode);
    if (selectedLanguage) {
      this.siteLanguage = selectedLanguage.name;
      this.selectedLanguage = selectedLanguage.code;
      this.translate.use(selectedLanguage.code);
      this.languageChanged.emit(selectedLanguage.code);
    }
  }

}
