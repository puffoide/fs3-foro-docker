import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperar-pass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recuperar-pass.component.html',
  styleUrls: ['./recuperar-pass.component.scss']
})
export class RecuperarPassComponent {
  form: FormGroup;
  submitted = false;
  enviado = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required]
    });
  }

  recuperar(): void {
    this.submitted = true;

    if (this.form.invalid) return;

    setTimeout(() => {
      this.enviado = true;
    }, 1000);
  }

  onCancel():void {
    this.router.navigate(['/login']);
  }
}
