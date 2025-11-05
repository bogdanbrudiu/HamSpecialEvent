import { Component } from '@angular/core';
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
  languages: Language[] = [
    { code: 'en', name: 'English', icon: 'assets/icons/gb.svg' },
    { code: 'ro', name: 'Romana', icon: 'assets/icons/ro.svg' },
    // Add more languages as needed
  ];
  selectedLanguage: Language = this.languages[0]; // Default language
  siteLanguage = 'English';
  constructor(private translate: TranslateService) { }

  onLanguageChange(lang: Language) {
    // Perform actions based on the selected language, e.g., update translation service
    console.log('Selected language:', lang);
    const selectedLanguage = this.languages.find((language) => language.code === lang.code)?.toString();
    if (selectedLanguage) {
      this.siteLanguage = selectedLanguage;
      this.translate.use(lang.code);
    }
    const currentLanguage = this.translate.currentLang;
  }

}
