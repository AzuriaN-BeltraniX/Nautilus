export class Medico {

    constructor(
        public nombre: string, 
        public cedulaProf: string,
        public usuario: {
            role: string,
            userID: string,
            nombre: string
        },
        public img?: string,
        public _id?: string
    ) {}

}