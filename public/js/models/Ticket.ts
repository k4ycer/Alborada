export default class Ticket{
    constructor(
        public id: number,
        public fecha: Date,
        public status: string,
        public idUsuario: number
    ){};

    public static ClassToEntity(ticket: Ticket): any{
        return {
            id: ticket.id,
            fecha: ticket.fecha,
            status: ticket.status,
            idUsuario: ticket.idUsuario
        }
    }

    public static EntityToClass(ticketEntity: any): Ticket{
        return new Ticket(ticketEntity.idTicket, ticketEntity.fecha, ticketEntity.status, ticketEntity.idUsuario);
    }
}