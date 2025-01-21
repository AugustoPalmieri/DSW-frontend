export interface Hamburguesa {
    idHamburguesa?: number;
    nombre: string;
    descripcion: string;
    cantidad?:number;
    precio?:number;
    imagen?:File|null;
    
}