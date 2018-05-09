export default class Platillo{
    constructor(
        public id: number,
        public nombre: string,
        public descripcion: string,
        public imagen: string,
        public precio: number,
        public ingredientes: string,
        public existencia: number
    ){};

    public static ClassToEntity(platillo: Platillo): any{
        return {
            idPlatillo: platillo.id,
            nombre: platillo.nombre,
            descripcion: platillo.descripcion,
            ingredientes: platillo.ingredientes,
            imagen: platillo.imagen,
            precio: platillo.precio,
            existencia: platillo.existencia
        }
    }

    public static EntityToClass(platilloEntity: any): Platillo{
        return new Platillo(platilloEntity.idPlatillo, platilloEntity.nombre, platilloEntity.descripcion, platilloEntity.imagen, platilloEntity.precio, platilloEntity.ingredientes, platilloEntity.existencia);
    }
}