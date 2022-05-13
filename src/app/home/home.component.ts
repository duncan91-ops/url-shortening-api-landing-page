import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ShortenUrlService } from '../shorten-url.service';
import { UrlResponse } from '../url-response';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  links$!: Observable<UrlResponse[]>;
  form!: FormGroup;
  url: FormControl = new FormControl('', [Validators.required]);
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private shortenUrlService: ShortenUrlService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      url: this.url,
    });
    this.links$ = this.shortenUrlService.getLinks();
  }

  submit() {
    if (this.url.value === '') {
      this.error = 'Please enter a url';
      return;
    }
    this.shortenUrlService.shortenUrl(this.url.value).subscribe((data) => {
      this.shortenUrlService.addLink(data);
      this.links$ = this.shortenUrlService.getLinks();
    });
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
}
