// Interface (modelo) del formulario de registro de usuarios:
export interface RegisterForm {
    nombre: string
    email: string
    password: string
    password2: string
    terminos: boolean
}

// Interface (modelo) del formulario de incio de sesión:
export interface LoginForm {
    email: string
    password: string
    remember: boolean
}

// Interface (modelo) de la respuesta del backend al iniciar sesión
export interface RespLogin {
    ok: boolean,
    usuario?: {
        nombre: string
        email: string
    },
    token?: string,
    header?: string
    msg?: string,
    menu?: []
}