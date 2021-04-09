import { Inventario } from './inventario.model';

export class Producto {

    constructor(
        public nombre: string, 
        public descripcion: string,
        public cantidad: number,
        public inventario: Inventario[],
        public precio: number,
        public usuarioReg: string,
        public img?: string,
        public _id?: string
    ) {}

}