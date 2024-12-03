import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AuthenticationService} from "../../services/authentication.service";
import {RouterLink} from "@angular/router";
import {SignUpRequest} from "../../model/sign-up.request";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  form!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private authenticationService: AuthenticationService) {
    this.form = this.fb.group({
      name : ['', [Validators.required, Validators.minLength(1)]],
      lastname: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(1)]],
      dni: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    let name = this.form.value.name;
    let lastname = this.form.value.lastname;
    let email = this.form.value.email;
    let password = this.form.value.password;
    let dni = this.form.value.dni;
    const signInRequest = new SignUpRequest(name, lastname, email, password, dni);
    this.authenticationService.signUp(signInRequest);
    this.submitted = true;
  }
}
