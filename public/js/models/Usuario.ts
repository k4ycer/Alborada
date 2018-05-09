export default class Usuario{
    constructor(
        public id: number,
        public nombre: string,
        public correo: string,
        public contrasena: string,
        public privilegio: string
    ){};

    public static ClassToEntity(usuario: Usuario): any{
        return {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            contrasena: usuario.contrasena,
            privilegio: usuario.privilegio
        }
    }

    public static EntityToClass(usuarioEntity: any): Usuario{
        return new Usuario(usuarioEntity.idUsuario, usuarioEntity.nombre, usuarioEntity.correo, usuarioEntity.contrasena, usuarioEntity.privilegio);
    }
}