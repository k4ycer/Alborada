import Platillo from "../models/Platillo";
import Respuesta from "../models/Respuesta";

export class MenuProvider {

    constructor() { }

	/////////////////////////////////////////
    //
    // addPlatilloImage
    //
    /////////////////////////////////////////
	addPlatilloImage(platillo: Platillo, form: HTMLFormElement): Promise<Platillo>{
		let parsed;

		return new Promise((resolve, reject) => {
			$.ajax({
				url: "../php/UploadPlatilloImage.php",
				type: "POST",
				data:  new FormData(form),
				contentType: false,
				cache: false,
				processData:false,
				success: data => {		   	
					parsed = JSON.parse(data);
					if(!parsed.hasOwnProperty("ErrorCode")){
						platillo.imagen = parsed.imagen;
						resolve(platillo);
					}else{						
						reject(new Respuesta(false, "El archivo no se pudo subir correctamente"));
					}
				},
				error: e => {
					console.log('e', e);
					reject(new Respuesta(false, "El archivo no se pudo subir correctamente"));
				}          
		   });
		});		
	}


	/////////////////////////////////////////
    //
    // deletePlatillo
    //
    /////////////////////////////////////////
	deletePlatillo(id: number): Promise<Respuesta>{
		let jsonData: any;

		console.log(id);
		jsonData = JSON.stringify({ "idPlatillo": id });

		return new Promise((resolve, reject) => {
			$.ajax({
				url: "../php/ModulePlatillos.php?action=deletePlatillo",
				type: "POST",
				data:  jsonData,
				contentType: false,
				cache: false,
				processData: false,
				success: data => {
					console.log(data);
					let parsed = JSON.parse(data);
					if(!parsed.hasOwnProperty("ErrorCode")){
						resolve(new Respuesta(true, null));
					}else{
						// Error getting
						reject(new Respuesta(false, "Error eliminando platillo"));
					}
				},
				error: e => {
					reject(new Respuesta(false, "Error eliminando platillo"));
				}
			});	
		});		
	}
	
	/////////////////////////////////////////
    //
    // getPlatillos
    //
    /////////////////////////////////////////
    getPlatillos(): Promise<Platillo[]> {
		let parsed,
			platillos: Platillo[];

        return new Promise((resolve, reject) => {
            $.ajax({
                url: "../php/ModulePlatillos.php?action=get",
				type: "POST",
				data:  "",
				success: data => {
					parsed = JSON.parse(data);
					if(!parsed.hasOwnProperty("ErrorCode")){
						// Success
						platillos = parsed.platillos.map((platillo: any) => Platillo.EntityToClass(platillo));
						resolve(platillos);						
					}else{
						// Error getting
						reject(new Respuesta(false, parsed.Message));
					}
				},
                error: e => {
					// Error in get
					reject(new Respuesta(false, "Ocurrio un problema, lo sentimos. No pudimos obtener los platillos."))                   	
                }
           });
        });
    }


    /////////////////////////////////////////
    //
    // insertPlatillo
    //
    /////////////////////////////////////////
    insertPlatillo(platillo: Platillo): Promise<Respuesta> {
        let jsonData: any,
            parsed,
            respuesta: Respuesta;
        
		jsonData = Platillo.ClassToEntity(platillo);
		
		console.log('jsonData', jsonData);

        return new Promise((resolve, reject) => {
            $.ajax({
                url: "../php/ModulePlatillos.php?action=insertPlatillo",
                type: "POST",
                data: JSON.stringify(jsonData),
                contentType: false,
                cache: false,
                processData: false,
                success: data => {
                    console.log(data);
                    parsed = JSON.parse(data);
                    if (!parsed.hasOwnProperty("ErrorCode")) {
                        // Done 
                        resolve(new Respuesta(true, ""));
                    } else {
                        // Error 
                       resolve(new Respuesta(false, parsed.Message));
                    }
                },
                error: e => reject()
            });
        });        
	}    
	

	/////////////////////////////////////////
    //
    // updatePlatilloData
    //
    /////////////////////////////////////////
	updatePlatilloData(platillo: Platillo): Promise<Respuesta>{
		let jsonData: any;

		jsonData = JSON.stringify(Platillo.ClassToEntity(platillo));
		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: "../php/ModulePlatillos.php?action=updatePlatillo",
				type: "POST",
				data:  jsonData,
				contentType: false,
				cache: false,
				processData:false,
				success: data => {
					console.log(data);
					let parsed = JSON.parse(data);
					if(!parsed.hasOwnProperty("ErrorCode")){
						resolve(new Respuesta(true, ""));
					}else{
						// Error 
						reject(new Respuesta(false, "Error actualizando"))						
					}
				},
				error: function(e) {
				   // Error in upload
				   reject(new Respuesta(false, "Error actualizando"))		
				}          
		   });	
		});		
	}

	/////////////////////////////////////////
	//
	// updatePlatillosExcel
	//
	/////////////////////////////////////////
	updatePlatillosExcel(file: any): Promise<Respuesta> {
		var form_data = new FormData();
		form_data.append("archivo", file)
		return new Promise((resolve, reject) => {
			$.ajax({
				type: "POST",
				url: '../php/UpdatePlatilloData.php',
				dataType: 'text',
				cache: false,
				contentType: false,
				processData: false,
				data: form_data,
				success: function (data) {
					if (data == "Exito") {
						resolve(new Respuesta(true, ""));
					}else{
						reject(new Respuesta(false, "Error actualizando"))
					}
					console.log(data);
				},
				error: function (e) {
					// Error in upload
					reject(new Respuesta(false, "Error actualizando"))
				}
			});
		});
	}


	/////////////////////////////////////////
    //
    // updatePlatilloImage
    //
    /////////////////////////////////////////
	updatePlatilloImage(platillo: Platillo, form: HTMLFormElement): Promise<Platillo>{
		let parsed;

		return new Promise((resolve, reject) => {
			$.ajax({
				url: "../php/UploadPlatilloImage.php",
				type: "POST",
				data:  new FormData(form),
				contentType: false,
				cache: false,
				processData:false,
				success: data => {		   			
					parsed = JSON.parse(data);
					if(!parsed.hasOwnProperty("ErrorCode")){
						platillo.imagen = parsed.imagen;
						resolve(platillo);
					}else{
						// Error uploading
						reject(new Respuesta(false, parsed.Message));
					}
				},
				error: e => {
					// Error in upload
					reject(new Respuesta(false, "El archivo no se pudo subir correctamente"));
				}          
			});	
		});
		
	}
}