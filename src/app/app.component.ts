import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData } from 'html-to-image';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  form: FormGroup;
  usrLogo: string;
  logoPlaceholder: string = 'assets/images/logo-placeholder.png';
  generatePending: boolean = false;
  isGenerated: boolean = false;
  isPrintingPending: boolean = false;
  private _clearTimeout: any;
  private _clearTimeout2: any;

  get txt1Control() {
    return this.form.get('txt1');
  }

  get txt2Control() {
    return this.form.get('txt2');
  }

  get txt3Control() {
    return this.form.get('txt3');
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.setupForm();
  }

  setupForm(): void {
    this.form = this.fb.group({
      txt1: ['', [Validators.required]],
      txt2: ['', [Validators.required]],
      txt3: ['', [Validators.required]],
    });
  }

  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.onload = () => {
      this.usrLogo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  html2image(ele?: HTMLElement) {
    this.isPrintingPending = true;
    document.body.style.overflow = 'hidden';
    this._clearTimeout2 = setTimeout(() => {
      const generatedTemplate = document.getElementById('generatedTemplate');
      if (generatedTemplate) {
        htmlToImage
          .toJpeg(generatedTemplate, {
            skipFonts: true,
          })
          .then((dataUrl) => {
            const img = document.createElement('img');
            img.src = dataUrl;

            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'image.jpeg';
            a.click();
          })
          .then(() => {
            this.isPrintingPending = false;
            document.body.style.overflow = 'auto';
          })
          .catch((error) => {
            console.error('Error generating image:', error);
          });
      }
    }, 1000);
  }

  generateTemplate() {
    if (this.form.valid && this.usrLogo) {
      this.generatePending = true;
      this._clearTimeout = setTimeout(() => {
        this.generatePending = false;
        this.isGenerated = true;
      }, 500);
    }
  }

  uploadImage(ele: HTMLInputElement) {
    ele.click();
  }

  errorHandler(event: any) {
    event.target.src = this.logoPlaceholder;
  }

  ngOnDestroy(): void {
    if (this._clearTimeout) {
      clearTimeout(this._clearTimeout);
    }

    if (this._clearTimeout2) {
      clearTimeout(this._clearTimeout2);
    }
  }
}
