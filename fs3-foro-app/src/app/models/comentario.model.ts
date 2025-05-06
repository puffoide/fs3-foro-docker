export interface ComentarioDTO {
  id?: number;
  contenido: string;
  fecha: string;
  publicacionId: number;
  usuarioId: number;
  username?: string;
  rol?: string;
  editando?: boolean;
}
