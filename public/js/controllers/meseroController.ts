import Respuesta from '../models/Respuesta';
import { LoginProvider } from '../providers/LoginProvider';
import Ticket from '../models/Ticket';
import { TicketProvider } from '../providers/TicketProvider';
import { UserProvider } from '../providers/UserProvider';

declare var swal: any;

export class MeseroController{

    currentUserId: number;

    constructor(
        private loginProvider: LoginProvider,
        private ticketProvider: TicketProvider,
        private userProvider: UserProvider
    ){
        this.loginProvider = new LoginProvider();
        this.ticketProvider = new TicketProvider();
        this.userProvider = new UserProvider();
    }


    /////////////////////////////////////////
    //
    // init
    //
    /////////////////////////////////////////
    async init(){  
        let tickets: any[];

        this.loginProvider.validaSesion();

        this.currentUserId = await this.getCurrentUser();
        this.getOrdersByMesero(this.currentUserId, 'PENDIENTE');
        

        this.setListeners();
    }


    /////////////////////////////////////////
    //
    // setListeners
    //
    /////////////////////////////////////////
    setListeners(){
        $("#logout").click(()=>{
            this.loginProvider.cerrarSesion();
        });
    }
        

    /////////////////////////////////////////
    //
    // getCurrentUser
    //
    /////////////////////////////////////////
    getCurrentUser(): Promise<number>{
        return this.userProvider.getCurrentUserId();
    };


    /////////////////////////////////////////
    //
    // getOrdersByMesero
    //
    /////////////////////////////////////////
    async getOrdersByMesero(userId: number, orderStatus: string){
        let tickets: Ticket[];

        tickets = await this.ticketProvider.getOrdersByMesero(userId, orderStatus);

        for(let ticket of tickets){
            $('#listaOrdenesActuales').append(`
                <div class="col-4">
                    <div class="ordenActual">Orden ${ticket.id}</div>
                </div>
            `);
        }        
    }
}