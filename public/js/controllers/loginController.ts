import Respuesta from '../models/Respuesta';
import { LoginProvider } from '../providers/LoginProvider';

declare var swal: any;

export class LoginController{

    constructor(
        private loginProvider: LoginProvider
    ){
        this.loginProvider = new LoginProvider();
    }


    /////////////////////////////////////////
    //
    // init
    //
    /////////////////////////////////////////
    init(){
        this.setListeners();
    }


    /////////////////////////////////////////
    //
    // setListeners
    //
    /////////////////////////////////////////
    setListeners(){
        $("#entrar").click(() => {
            let usuario: string,
                contrasena: string;

            usuario = $("#usuario").val().toString();
            contrasena = $("#contra").val().toString();

            this.login(usuario, contrasena);
        });
    }


    /////////////////////////////////////////
    //
    // login
    //
    /////////////////////////////////////////
    async login(usuario: string, contrasena: string){
        let respuesta: Respuesta;

        console.log("iniciando sesion");
        try{
            respuesta = await this.loginProvider.iniciarSesion(usuario, contrasena);
            window.location.replace("inicio.html");
        }catch(respuesta){
             // Error sesion
            await swal({
                title: respuesta.message,
                text: "",
                buttons: {
                    confirm: true,
                },
                icon:"error"
            }); 
        }

            
    }
}