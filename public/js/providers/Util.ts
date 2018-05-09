class Util{
    constructor(){}

    public static SerializeForm(form: HTMLElement){
        let serialized: any,
            data: any[];

		serialized = $(form).serializeArray();
        data = [];
        
		for(let i in serialized){
			data[serialized[i].name] = serialized[i].value;
        }
        
        return data;
	}
}