$(()=>{
	var Platillos = [];
	function SerializeForm(form){
		var serialized = $( form ).serializeArray();

		var data = [];
		for(i in serialized){
			data[serialized[i].name] = serialized[i].value;
		}
		return data;
	}
	function SendPlatilloData(platilloData, form){		
		platilloData["existencia"] = 1;
		jsonData = JSON.stringify({
		   		nombre: platilloData["nombre"],
		   		descripcion: platilloData["descripcion"],
		   		ingredientes: platilloData["ingredientes"],
		   		imagen: platilloData["imagen"],
		   		precio: platilloData["precio"],
		   		existencia: platilloData["existencia"]
		   	});
		console.log(jsonData);
		$.ajax({
         	url: "php/ModulePlatillos.php?action=insertPlatillo",
		   	type: "POST",
		   	data:  jsonData,
		   	contentType: false,
		    cache: false,
		   	processData:false,
	   		beforeSend : function(){
	    
	   		},
	   		success: function(data){
	   			console.log(data);
				let parsed = JSON.parse(data);
				if(!parsed.hasOwnProperty("ErrorCode")){
					// Done 
		            swal({
			    		title: "Platillo añadido",
			    		text: "El platillo se añadio al menú correctamente",
			    		buttons: {
			    		    confirm: true,
			    	  	},
			    	  	icon:"success"
			    	});
			    	GetPlatillos();
			    	// Reset the fields
			    	$(form)[0].reset();
				}else{
					// Error 
					swal({
	            		title: "Error añadiendo",
	            		text: parsed.Message,
	            		buttons: {
	            		    confirm: true,
	            	  	},
	            	  	icon:"error"
	            	});
				}
	      	},
	     	error: function(e) {
	    		// Error in upload
            	swal({
            		title: "Error",
            		text: "Ocurrio un problema, lo sentimos. Intentalo de nuevo.",
            		buttons: {
            		    confirm: true,
            	  	},
            	  	icon:"error"
            	});
	      	}          
	    });	
	}
	function AddPlatillo(form){
		var formData = SerializeForm(form);
		
		// Upload image
		let url = "php/UploadPlatilloImage.php";
		let file = $("#platilloImagen").prop("files")[0];
		if(file != null || file != undefined){
			$.ajax({
	         	url: url,
			   	type: "POST",
			   	data:  new FormData(form),
			   	contentType: false,
			    cache: false,
			   	processData:false,
		   		beforeSend : function(){
		    
		   		},
		   		success: function(data){		   			
					let parsed = JSON.parse(data);
					if(!parsed.hasOwnProperty("ErrorCode")){
			            formData["imagen"] = parsed.imagen;
						SendPlatilloData(formData, form);
					}else{
						// Error uploading
						swal({
		            		title: "Error en subida",
		            		text: parsed.Message,
		            		buttons: {
		            		    confirm: true,
		            	  	},
		            	  	icon:"error"
		            	});
					}
		      	},
		     	error: function(e) {
		    		// Error in upload
	            	swal({
	            		title: "Error en subida",
	            		text: "El archivo no se pudo subir correctamente",
	            		buttons: {
	            		    confirm: true,
	            	  	},
	            	  	icon:"error"
	            	});
		      	}          
		    });	
		}else{
			formData["imagen"] = "resources/images/noimage.jpeg";
			SendPlatilloData(formData);
		}
	}
	function ShowPlatillos(platillos){
		Platillos = platillos
		var htmlContent = "";
		for(i in platillos){
			let platillo = platillos[i];
			console.log(platillo);
			htmlContent += `
				<div class="platillo col-6 col-sm-6 col-md-4 col-lg-4 col-xl-3">
					<div>
						<button data-id="${platillo.idPlatillo}" class="delete btn btn-secondary">x</button>
						<h5 class="text-center">${platillo.nombre}</h5>
						<img class="img-fluid" src="${platillo.imagen}">
						<p>${platillo.descripcion}</p>
						<small>$${platillo.precio}</small>
						<button data-index="${i}" class="update btn btn-primary">Editar</button>
					</div>
				</div>
			`;
		}
		$("#gridMenuContent").html(htmlContent);
	}
	function GetPlatillos(){
		$.ajax({
         	url: "php/ModulePlatillos.php?action=get",
		   	type: "POST",
		   	data:  "",
	   		success: function(data){
	   			console.log(data);
				let parsed = JSON.parse(data);
				if(!parsed.hasOwnProperty("ErrorCode")){
		            ShowPlatillos(parsed.platillos);
				}else{
					// Error getting
					swal({
	            		title: "Error obteniendo platillos",
	            		text: parsed.Message,
	            		buttons: {
	            		    confirm: true,
	            	  	},
	            	  	icon:"error"
	            	});
				}
	      	},
	     	error: function(e) {
	    		// Error in get
            	swal({
            		title: "Error",
            		text: "Ocurrio un problema, lo sentimos. No pudimos obtener los platillos.",
            		buttons: {
            		    confirm: true,
            	  	},
            	  	icon:"error"
            	});
	      	}
	    });	
	}
	function DeletePlatillo(id){
		swal({
    		title: "Eliminar platillo",
    		text: "¿Estás seguro que deseas eliminar el platillo?",
    		buttons: {
    		    confirm: true,
    		    cancel: true
    	  	},
    	  	icon:"warning"
    	}).then((value)=>{
    		if(value==true){
				let postData = {
					"idPlatillo": id
				}
				jsonData = JSON.stringify(postData);
				console.log(jsonData);
				$.ajax({
		         	url: "php/ModulePlatillos.php?action=deletePlatillo",
				   	type: "POST",
				   	data:  jsonData,
				   	contentType: false,
				    cache: false,
				   	processData:false,
			   		success: function(data){
			   			console.log(data);
						let parsed = JSON.parse(data);
						if(!parsed.hasOwnProperty("ErrorCode")){
							swal({
			            		title: "Platillo eliminado",
			            		text: "El platillo ha sido eliminado correctamente",
			            		buttons: {
			            		    confirm: true,
			            	  	},
			            	  	icon:"success"
			            	});
				            GetPlatillos();
						}else{
							// Error getting
							swal({
			            		title: "Error obteniendo platillos",
			            		text: parsed.Message,
			            		buttons: {
			            		    confirm: true,
			            	  	},
			            	  	icon:"error"
			            	});
						}
			      	},
			     	error: function(e) {
			    		// Error in get
		            	swal({
		            		title: "Error",
		            		text: "Ocurrio un problema, lo sentimos. No pudimos obtener los platillos.",
		            		buttons: {
		            		    confirm: true,
		            	  	},
		            	  	icon:"error"
		            	});
			      	}
			    });	
    		}
    	});
	}
	function UpdatePlatilloData(platilloData){
		console.log(platilloData);
		jsonData = JSON.stringify({
				idPlatillo: platilloData["idPlatillo"],
		   		nombre: platilloData["nombre"],
		   		descripcion: platilloData["descripcion"],
		   		ingredientes: platilloData["ingredientes"],
		   		imagen: platilloData["imagen"],
		   		precio: platilloData["precio"],
		   		existencia: platilloData["existencia"]
		   	});
		console.log(jsonData);
		$.ajax({
         	url: "php/ModulePlatillos.php?action=updatePlatillo",
		   	type: "POST",
		   	data:  jsonData,
		   	contentType: false,
		    cache: false,
		   	processData:false,
	   		beforeSend : function(){
	    
	   		},
	   		success: function(data){
	   			console.log(data);
				let parsed = JSON.parse(data);
				if(!parsed.hasOwnProperty("ErrorCode")){
					// Done 
		            swal({
			    		title: "Platillo actualizado",
			    		text: "El platillo se actualizó correctamente",
			    		buttons: {
			    		    confirm: true,
			    	  	},
			    	  	icon:"success"
			    	});
			    	GetPlatillos();
				}else{
					// Error 
					swal({
	            		title: "Error actualizando",
	            		text: parsed.Message,
	            		buttons: {
	            		    confirm: true,
	            	  	},
	            	  	icon:"error"
	            	});
				}
	      	},
	     	error: function(e) {
	    		// Error in upload
            	swal({
            		title: "Error",
            		text: "Ocurrio un problema, lo sentimos. Intentalo de nuevo.",
            		buttons: {
            		    confirm: true,
            	  	},
            	  	icon:"error"
            	});
	      	}          
	    });	
	}
	function UpdatePlatillo(){
		$('#updatePlatilloModal').modal('hide');
		let form = $("#updatePlatilloForm")[0];
		let idPlatillo = $("#updatePlatilloForm").attr("data-id");
		let prevImage = $("#updatePlatilloForm").attr("data-prevImage");
		let existencia = $("#updatePlatilloForm").attr("data-existencia");
		let serializedData = SerializeForm(form);
		serializedData["idPlatillo"] = idPlatillo;
		serializedData["existencia"] = existencia;
		let file = $("#platilloUpdateImagen").prop("files")[0];
		if(file == null || file == undefined){
			serializedData["imagen"] = prevImage;
			UpdatePlatilloData(serializedData);
		}else{
			let url = "php/UploadPlatilloImage.php";
			$.ajax({
	         	url: url,
			   	type: "POST",
			   	data:  new FormData(form),
			   	contentType: false,
			    cache: false,
			   	processData:false,
		   		beforeSend : function(){
		    
		   		},
		   		success: function(data){		   			
					let parsed = JSON.parse(data);
					if(!parsed.hasOwnProperty("ErrorCode")){
			            serializedData["imagen"] = parsed.imagen;
						UpdatePlatilloData(serializedData);
					}else{
						// Error uploading
						swal({
		            		title: "Error en subida",
		            		text: parsed.Message,
		            		buttons: {
		            		    confirm: true,
		            	  	},
		            	  	icon:"error"
		            	});
					}
		      	},
		     	error: function(e) {
		    		// Error in upload
	            	swal({
	            		title: "Error en subida",
	            		text: "El archivo no se pudo subir correctamente",
	            		buttons: {
	            		    confirm: true,
	            	  	},
	            	  	icon:"error"
	            	});
		      	}          
		    });	
		}

		console.log(form);
	}
	function OpenUpdatePlatilloModal(platillo){
		let updateTemplate = `
			<div id="updatePlatillo" class="col">
	  			<form id="updatePlatilloForm" data-id="${platillo.idPlatillo}" data-prevImage="${platillo.imagen}" data-existencia="${platillo.existencia}">
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
		$('#updatePlatilloModal').modal('show');
	}
	function ValidaSesion(){
		$.post("php/inicio.php", function(response, status, xhr){
			if(status=="error"){
				alert("Lo sentimos, algo salió mal: " + xhr.status + " " + xhr.statusText);
			}else if (status == "success") {
					if(response == "1"){
						GetPlatillos();
					}else{
						// Error sesion
						swal({
		            		title: "Error en sesión",
		            		text: "Inicia sesion para continuar",
		            		buttons: {
		            		    confirm: true,
		            	  	},
		            	  	icon:"error"
		            	}).then(()=>{
		            		window.location.replace("login.html");
		            	});
					}
			}else{
				// Error sesion
				swal({
            		title: "Error en sesión",
            		text: "Inicia sesion para continuar",
            		buttons: {
            		    confirm: true,
            	  	},
            	  	icon:"error"
            	}).then(()=>{
            		window.location.replace("login.html");
            	});
			}
		});
		$("#logout").click(()=>{
			$.post("php/logout.php", function(response, status, xhr){
				if(status=="error"){
					alert("Lo sentimos, algo salió mal: " + xhr.status + " " + xhr.statusText);
				}else if (status == "success") {
 					window.location.replace("login.html");
				}else{
					// Es necesario iniciar una sesion
 					alert("Inicia sesion para continuar");
 					window.location.replace("login.html");
				}
			})
		});
	}
	// Add platillo
	$("#addPlatilloForm").submit((e)=>{
		var form = e.target;
		e.preventDefault();
		swal({
			title: "Añadir platillo",
			text: "¿Estás seguro que deseas añadir un platillo con la información proporcionada?",
			buttons: {
			    cancel: true,
			    confirm: {
			      	closeModal:false
			    },
		  	},
		  	icon:"info"
		}).then((value) => {
		  	if(value === true){
		  		// Add platillo
		  		AddPlatillo(form);
		  	}else{
		  		// Canceled
		  	}
		});
	});
	// Delete platillo
	$("#gridMenuContent").on("click", ".delete", (e)=>{
		let elem = $(e.target);
		DeletePlatillo(elem.attr("data-id"));
	});
	// Open update platillo modal 
	$("#gridMenuContent").on("click", ".update", (e)=>{
		let elem = $(e.target);
		OpenUpdatePlatilloModal(Platillos[elem.attr("data-index")]);
	});
	// Update platillo
	$("#updatePlatilloBtn").click((e)=>{
		var id = e.target;
		e.preventDefault();
		swal({
			title: "Actualizar platillo",
			text: "¿Estás seguro que deseas actualizar el platillo con la información proporcionada?",
			buttons: {
			    cancel: true,
			    confirm: {
			      	closeModal:false
			    },
		  	},
		  	icon:"warning"
		}).then((value) => {
		  	if(value === true){
		  		// Add platillo
		  		UpdatePlatillo();
		  	}else{
		  		// Canceled
		  	}
		});
	});
	
	// Valida la sesion
	ValidaSesion();
});