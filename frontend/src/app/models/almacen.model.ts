export class Almacen {

    constructor(
        public nombre: string, 
        public usuario: {
            userID: string
        },
        public img?: string,
        public _id?: string
    ) {}

}