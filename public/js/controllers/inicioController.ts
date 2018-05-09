import Respuesta from '../models/Respuesta';
import { LoginProvider } from '../providers/LoginProvider';
import { UserProvider } from '../providers/UserProvider';
import Usuario from '../models/Usuario';

declare var swal: any;

export class InicioController{

    constructor(
        private loginProvider: LoginProvider,
        private userProvider: UserProvider
    ){
        this.loginProvider = new LoginProvider();
        this.userProvider = new UserProvider();
    }


    /////////////////////////////////////////
    //
    // init
    //
    /////////////////////////////////////////
    public async init(){
        await this.loginProvider.validaSesion();

        this.setListeners();
        this.getUsuarios();
    }


    /////////////////////////////////////////
    //
    // setListeners
    //
    /////////////////////////////////////////
    setListeners(){
        $("#nuevoUsuario").click( () => {
            this.insertarUsuario();
        });
    }


    /////////////////////////////////////////
    //
    // getUsuarios
    //
    /////////////////////////////////////////
    async getUsuarios(){
        let usuarios: Usuario[],
            usuariosHTML;

        $("#tablaUsuarios").html("");
        try{
            usuarios = await this.userProvider.getUsuarios()

            usuariosHTML = "";
            for (var i = (usuarios.length - 1); i >= 0; i--) {
                usuariosHTML += "<tr>" +
                "<td>" + usuarios[i].id + "</td>" +
                "<td>" + usuarios[i].nombre + "</td>" +
                "<td>" + usuarios[i].contrasena + "</td>" +
                "<td>" + usuarios[i].correo + "</td>" +
                "<td>" + usuarios[i].privilegio + "</td>" +
                "<td><button class='btn btn-secondary delete-Usuario' data-id='" + usuarios[i].id + "'>X</button></td>" +
                "</tr>";                
            }

            $("#tablaUsuarios").html(usuariosHTML);
        }catch(respuesta){
            swal({
                title: "Error",
                text: respuesta.message,
                buttons: {
                    confirm: true,
                },
                icon: "error"
            });
        }
    }


    /////////////////////////////////////////
    //
    // insertarUsuario
    //
    /////////////////////////////////////////
    async insertarUsuario(){
        let usuario: Usuario,
            correo: string,
            nombre: string,
            contrasena: string,
            contrasenaConfirm: string,
            emailTest: RegExp,
            eTest: boolean,
            conTest: boolean,
            pselect: number,
            respuesta: Respuesta;
           
        correo = $("#correoUsuario").val().toString();
        nombre = $("#nombreUsuario").val().toString();
        contrasena = $("#contrasenaUsuario").val().toString();
        contrasenaConfirm = $("#contrasenaUsuarioConfirm").val().toString();

        //Verificacion email
        emailTest = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        eTest = emailTest.test(correo);

        //Verificacion contraseña
        conTest = false;

        if ((contrasena == contrasenaConfirm) && (contrasena != "") && (contrasenaConfirm != "")) {
            conTest = true;
        }

        pselect = Number($("#privilegioSelect option:selected").val());

        if (pselect == 0)
            var privilegio = "MESERO";

        if (pselect == 1)
            var privilegio = "COCINERO";

        if (pselect == 2)
            var privilegio = "ADMINISTRADOR";

        if (eTest == true && conTest == true && nombre != "" && privilegio != "") {
            $("#alertacorreo").hide();
            $("#alertaContrasena").hide();
            
            try{
                usuario = new Usuario(null, nombre, correo, contrasena, privilegio);
                respuesta = await this.userProvider.insertUsuario(usuario);

                swal({
                    title: "Éxito",
                    text: respuesta.message,
                    buttons: {
                        confirm: true,
                    },
                    icon: "success"
                });

                (<any>$("#agregar")).modal('hide');

                this.getUsuarios();
            }catch(respuesta){
                swal({
                    title: "Error",
                    text: respuesta.message,
                    buttons: {
                        confirm: true,
                    },
                    icon: "error"
                });
            }
            
        }
        else {
            swal({
                title: "Error",
                text: "Rellena todos los campos para continuar",
                buttons: {
                    confirm: true,
                },
                icon: "error"
            });
            if (eTest == false) {
                $("#alertacorreo").show();
            }
            if (eTest == true) {
                $("#alertacorreo").hide();
            }

            if (conTest == false) {
                $("#alertaContrasena").show();
            }
            if (conTest == true) {
                $("#alertaContrasena").hide();
            }
        }
    }

}