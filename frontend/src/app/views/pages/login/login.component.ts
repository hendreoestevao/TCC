import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth-service/auth.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [FormsModule, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  userType: string = '';
  constructor(private router: Router, private authService: AuthService) {}


  login() {
    if (this.userType && this.username && this.password) {
      this.authService.login(this.username, this.password, this.userType).subscribe((response) => {
        if (response && response.token) {
          this.router.navigate(['/dashboard']);
        }
      });
    } else {
      // Lidar com o caso em que algum campo obrigatório não foi preenchido
      Swal.fire('Erro', 'Por favor, preencha todos os campos.', 'error');
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

}
