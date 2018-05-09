import Respuesta from "../models/Respuesta";
import Ticket from "../models/Ticket";

declare var swal: any;

export class TicketProvider{
    constructor(){}

    /////////////////////////////////////////
    //
    // getOrdersByMesero
    //
    /////////////////////////////////////////
    getOrdersByMesero(userId: number, orderStatus: string): Promise<Ticket[]>{
        return new Promise((resolve, reject) => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: "../php/getOrdenesByMesero.php",
                    type: 'GET',
                    data: {
                        userId: userId,
                        orderStatus: orderStatus
                    },
                    success: res => {
                        console.log(res);
                        res = JSON.parse(res);
    
                        if(res.status == 1)
                            resolve(res.tickets);
                        else
                            reject(res.reason);
                    },
                    error: err => {
                        reject(err);
                    }
                });
            });
        });
    }
}