import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RecuperarPassComponent } from './recuperar-pass.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('RecuperarPassComponent', () => {
  let component: RecuperarPassComponent;
  let fixture: ComponentFixture<RecuperarPassComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routeSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RecuperarPassComponent, ReactiveFormsModule],
      providers: [{ provide: Router, useValue: routeSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarPassComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería marcar el formulario como inválido si username está vacío', () => {
    component.form.setValue({ username: '' });
    component.recuperar();
    expect(component.form.invalid).toBeTrue();
    expect(component.enviado).toBeFalse();
  });

  it('debería marcar enviado en true tras enviar un formulario válido', fakeAsync(() => {
    component.form.setValue({ username: 'usuario' });
    component.recuperar();
    tick(1000);
    expect(component.enviado).toBeTrue();
  }));

  it('debería navegar a login si se cancela', () => {
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
