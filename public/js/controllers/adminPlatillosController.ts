import Platillo from '../models/Platillo';
import Respuesta from '../models/Respuesta';
import { MenuProvider } from '../providers/MenuProvider';
import { LoginProvider } from '../providers/LoginProvider';
declare var swal: any;

export class AdminPlatillosController{

    platillos: Platillo[];

    constructor(
        private loginProvider: LoginProvider,
        private menuProvider: MenuProvider
    ){
        this.loginProvider = new LoginProvider();
        this.menuProvider = new MenuProvider();
    }

    /////////////////////////////////////////
    //
    // init
    //
    /////////////////////////////////////////
    public async init(){
        await this.loginProvider.validaSesion();
        
        this.setListeners();

        this.getPlatillos();
    }

    /////////////////////////////////////////
    //
    // setListeners
    //
    /////////////////////////////////////////
    public setListeners(){
        // Add platillo
        $("#addPlatilloForm").off("submit").submit(async (e) => {
            let form: HTMLFormElement,
                platillo: Platillo; 
                
            e.preventDefault();            
            form = (<HTMLFormElement>e.target);

            platillo = Platillo.EntityToClass(Util.SerializeForm(form));

            try{
                platillo = await this.addPlatilloImage(platillo, form);
                await this.insertPlatilloData(platillo);
            }catch{

            }

            this.getPlatillos();

            // Reset the fields
            form.reset();
        });

        // Delete platillo
        $("#gridMenuContent").off("click").on("click", ".delete", (e)=>{
            let elem = $(e.target);
            this.deletePlatillo(Number(elem.attr("data-id")));
        });

        // Open update platillo modal 
        $("#gridMenuContent").on("click", ".update", (e)=>{
            let elem = $(e.target);
            this.openUpdatePlatilloModal(this.platillos[Number(elem.attr("data-index"))]);
        });

        // Logout
        $("#logout").off("click").click(()=>{
			this.loginProvider.cerrarSesion();
		});

        // Update platillo
        $("#updatePlatilloBtn").off("click").click(async (e) => {
            let form: HTMLFormElement,
                platillo: Platillo; 
                
            e.preventDefault();            
            form = (<HTMLFormElement>$("#updatePlatilloForm").get(0));

            platillo = Platillo.EntityToClass(Util.SerializeForm(form));

            platillo.id = Number($("#updatePlatilloForm").attr("data-id"));
		    platillo.imagen = $("#updatePlatilloForm").attr("data-prevImage");
            platillo.existencia = Number($("#updatePlatilloForm").attr("data-existencia"));
            platillo.precio = Number(platillo.precio);

            try{
                await this.updatePlatilloImage(platillo, form);
                this.updatePlatilloData(platillo);
            }catch{

            }

            this.getPlatillos();

            // Reset the fields
            form.reset();
        });

        // Update platillos excel
        $("#excelForm").submit((e) => {
            e.preventDefault();
            this.updatePlatillosExcel();
        });
    }    


    /////////////////////////////////////////
    //
    // addPlatilloImage
    //
    /////////////////////////////////////////
    addPlatilloImage(platillo: Platillo, form: HTMLFormElement): Promise<Platillo>{		
        let file;

        return new Promise(async (resolve, reject) => {
            file = $("#platilloImagen").prop("files")[0];
                    
            if(file != null || file != undefined){

                try{
                    platillo = await this.menuProvider.addPlatilloImage(platillo, form);

                    resolve(platillo);
                }catch(respuesta){
                    // Error uploading
                    await swal({
                        title: "Error en subida",
                        text: respuesta.message,
                        buttons: {
                            confirm: true,
                        },
                        icon:"error"
                    });

                    reject();
                }
            }else{
                platillo.imagen = "resources/images/noimage.jpeg";
                resolve(platillo);
            }
        });
		
    }
    

    /////////////////////////////////////////
    //
    // deletePlatillo
    //
    /////////////////////////////////////////
    async deletePlatillo(id: number){
        let confirmar: boolean,
            respuesta: Respuesta;

		confirmar = await swal({
    		title: "Eliminar platillo",
    		text: "¿Estás seguro que deseas eliminar el platillo?",
    		buttons: {
    		    confirm: true,
    		    cancel: true
    	  	},
    	  	icon:"warning"
        });        
        
        if(confirmar == true){            

            try{
                respuesta = await this.menuProvider.deletePlatillo(id);

                swal({
                    title: "Platillo eliminado",
                    text: "El platillo ha sido eliminado correctamente",
                    buttons: {
                        confirm: true,
                    },
                    icon:"success"
                });
                
                this.getPlatillos();
            }catch(respuesta){
                swal({
                    title: "Error obteniendo platillos",
                    text: respuesta.message,
                    buttons: {
                        confirm: true,
                    },
                    icon:"error"
                });

            }
        }
    	
	}
    

    /////////////////////////////////////////
    //
    // getPlatillos
    //
    /////////////////////////////////////////
    getPlatillos(): Promise<any>{
        let respuesta: Respuesta;

        return new Promise(async (resolve, reject) => {
            try{
                this.platillos = await this.menuProvider.getPlatillos();

                this.showPlatillos(this.platillos);

                resolve();
            }catch(respuesta){
                await swal({
                    title: "Error obteniendo platillos",
                    text: respuesta.message,
                    buttons: {
                        confirm: true,
                    },
                    icon:"error"
                });

                reject();
            }            
        });			
    }

    
    /////////////////////////////////////////
    //
    // insertPlatilloData
    //
    /////////////////////////////////////////
    public insertPlatilloData(platillo: Platillo){
        let respuesta: Respuesta,
            confirmar: boolean;

        return new Promise(async (resolve, reject) => {
            platillo.existencia = 1;
            platillo.precio = Number(platillo.precio);
            
            confirmar = await swal({
                title: "Añadir platillo",
                text: "¿Estás seguro que deseas añadir un platillo con la información proporcionada?",
                buttons: {
                    cancel: true,
                    confirm: {
                        closeModal:false
                    },
                },
                icon:"info"
            });
            
            if(confirmar !== true){
                resolve();
                return;
            }
            
            try{
                respuesta = await this.menuProvider.insertPlatillo(platillo);

                if(respuesta){
                    await swal({
                        title: "Platillo añadido",
                        text: "El platillo se añadio al menú correctamente",
                        buttons: {
                            confirm: true,
                        },
                        icon: "success"
                    });
                    resolve();
                }else{
                    await swal({
                        title: "Error añadiendo",
                        text: respuesta.message,
                        buttons: {
                            confirm: true,
                        },
                        icon: "error"
                    });
                    resolve();
                }          
            }catch(err){
                await swal({
                    title: "Error",
                    text: "Ocurrio un problema, lo sentimos. Intentalo de nuevo.",
                    buttons: {
                        confirm: true,
                    },
                    icon: "error"
                });
                resolve();
            }	
        });        	
    }    


    /////////////////////////////////////////
    //
    // openUpdatePlatilloModal
    //
    /////////////////////////////////////////
    openUpdatePlatilloModal(platillo: Platillo){
		let updateTemplate = `
			<div id="updatePlatillo" class="col">
	  			<form id="updatePlatilloForm" data-id="${platillo.id}" data-prevImage="${platillo.imagen}" data-existencia="${platillo.existencia}">
	  			  	<div class="form-group">
	  			    	<label for="platilloNombre">Nombre</label>
	  			    	<input required="required" type="text" class="form-control" id="platilloUpdateNombre" name="nombre" value="${platillo.nombre}">
	  			  	</div>
	  			  	<div class="form-group">
		  			    <label for="platilloDescripcion">Descripción</label>
		  			    <textarea required="required" class="form-control" id="platilloUpdateDescripcion" name="descripcion" rows="4">${platillo.descripcion}</textarea>
		  			</div>
		  			<div class="form-group">
	  			    	<label for="platilloImagen">Cambiar Imagen</label>
	  			    	<input type="file" class="form-control" id="platilloUpdateImagen" name="imagen" accept="image/*">
	  			  	</div>
	  			  	<div class="form-group">
	  			    	<label for="platilloPrecio">Precio</label>
	  			    	<input required="required" type="number" class="form-control" id="platilloUpdatePrecio" name="precio" value="${platillo.precio}">
	  			  	</div>
	  			  	<div class="form-group">
		  			    <label for="platilloIngredientes">Ingredientes</label>
		  			    <textarea required="required" class="form-control" id="platilloUpdateIngredientes" name="ingredientes" rows="4">${platillo.ingredientes}</textarea>
		  			</div>
	  			</form>
	  		</div>
		`
		$("#updatePlatilloModal .modal-body").html(updateTemplate);
		(<any>$('#updatePlatilloModal')).modal('show');
	}
    

    /////////////////////////////////////////
    //
    // showPlatillos
    //
    /////////////////////////////////////////
    public showPlatillos(platillos: Platillo[]){
        let htmlContent: string,
            platillo: Platillo;
        
        htmlContent = "";

		for(let i in platillos){
            platillo = platillos[i];
            
			htmlContent += `
				<div class="platillo col-6 col-sm-6 col-md-4 col-lg-4 col-xl-3">
					<div>
						<button data-id="${platillo.id}" class="delete btn btn-secondary">x</button>
						<h5 class="text-center">${platillo.nombre}</h5>
						<img class="img-fluid" src="../${platillo.imagen}">
						<p>${platillo.descripcion}</p>
						<small>$${platillo.precio}</small>
						<button data-index="${i}" class="update btn btn-primary">Editar</button>
					</div>
				</div>
			`;
		}
		$("#gridMenuContent").html(htmlContent);
    }


    /////////////////////////////////////////
    //
    // updatePlatillo
    //
    /////////////////////////////////////////
    public updatePlatilloImage(platillo: Platillo, form: HTMLFormElement):  Promise<Platillo>{
        let file,
            parsed;

        return new Promise(async (resolve, reject) => {
            (<any>$('#updatePlatilloModal')).modal('hide');
		
            file = $("#platilloUpdateImagen").prop("files")[0];
            if(file == null || file == undefined){
                resolve(platillo);
            }else{
                try{
                    platillo = await this.menuProvider.updatePlatilloImage(platillo, form);
                    resolve(platillo);
                }catch(respuesta){
                    swal({
                        title: "Error en subida",
                        text: respuesta.message,
                        buttons: {
                            confirm: true,
                        },
                        icon:"error"
                    });    
                    reject(); 
                }                           
            }
        });
	}
    

    /////////////////////////////////////////
    //
    // updatePlatilloData
    //
    /////////////////////////////////////////
    public async updatePlatilloData(platillo: Platillo){
        try{
            await this.menuProvider.updatePlatilloData(platillo);

            swal({
                title: "Platillo actualizado",
                text: "El platillo se actualizó correctamente",
                buttons: {
                    confirm: true,
                },
                icon:"success"
            });

            this.getPlatillos();
        }catch(respuesta){
            swal({
                title: "Error actualizando",
                text: respuesta.message,
                buttons: {
                    confirm: true,
                },
                icon:"error"
            });
        }		
    }

    /////////////////////////////////////////
    //
    // updatePlatillosExcel
    //
    /////////////////////////////////////////
    public async updatePlatillosExcel() {
        swal({
            title: "Actualizar platillo",
            text: "¿Estás seguro que deseas actualizar el menu con la información proporcionada?",
            buttons: {
                cancel: true,
                confirm: {
                    closeModal: false
                },
            },
            icon: "warning"
        }).then(async (value: any) => {
            if (value === true) {
                try {
                    var file_data = $("#excel").prop("files")[0];
                    await this.menuProvider.updatePlatillosExcel(file_data);

                    swal({
                        title: "Platillos añadidos",
                        text: "Los platillos se han añadido al menú correctamente",
                        buttons: {
                            confirm: true,
                        },
                        icon: "success"
                    });

                    this.getPlatillos();
                } catch (respuesta) {
                    console.log(respuesta);
                    swal({
                        title: "Error actualizando",
                        text: "Algo salio mal, intentalo mas tarde",
                        buttons: {
                            confirm: true,
                        },
                        icon: "error"
                    });
                }
            }
        });
    }


}