import { Routes } from '@angular/router';
import { LoginComponent } from './components/autenticacion/login/login.component';
import { RegistroComponent } from './components/autenticacion/registro/registro.component';
import { RecuperarPassComponent } from './components/autenticacion/recuperar-pass/recuperar-pass.component';
import { ForoComponent } from './components/foro/foro.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { HomeComponent } from './components/shared/home/home.component';
import { PublicacionDetalleComponent } from './components/foro/publicacion-detalle/publicacion-detalle.component';
import { PublicarComponent } from './components/foro/publicar/publicar.component';
import { EditarPerfilComponent } from './components/usuario/editar-perfil/editar-perfil.component';

export const routes: Routes = [

    { path: '', component: HomeComponent },
    { path: "login", component: LoginComponent },
    { path: "registro", component: RegistroComponent },
    { path: "recuperar-contraseña", component: RecuperarPassComponent },
    { path: "foro", component: ForoComponent },
    { path: "perfil", component: PerfilComponent },
    { path: 'publicacion/:id', component: PublicacionDetalleComponent },
    { path: 'publicar', component: PublicarComponent },
    { path: 'editar-perfil', component: EditarPerfilComponent },
    { path: 'recuperar-contraseña', component: RecuperarPassComponent },



    { path:"**", redirectTo: "foro" }
];
