import { Almacen } from './almacen.model';

export class Inventario {

    constructor(
        public almacen?: Almacen,
        public cantidad?: number,
        public _id?: string
    ) { }
}