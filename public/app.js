class DomoticaDash extends BaseApp{
  	constructor(){
		super("pencil", "Domotica");
      	this.api_prefix = "/api";
      	this.app_prefix = "/apps";
      	this.dashboard_prefix = "/domotica";
      	this.apps_prefix = this.app_prefix+this.dashboard_prefix;
      	this.apiItems = {};
		this.initialised = false;      	
      	include([
          	//this.apps_prefix+"/app.css",
          	this.apps_prefix+"/domotica.js",
          	this.apps_prefix+"/comfortSelect.js",
          	this.apps_prefix+"/mediaSelect.js",
          	this.apps_prefix+"/sceneSelect.js"
        ], () =>{
        	//this.init();
        });
    }
	init(){
		if(!this.initialised){
            this.initialised=true;
        }
        this.getVariables();
    }
    
    getVariables() {
        app.reqManager.get(this.apps_prefix + "/variables", (res) => {
            console.log(res)
            try {
                this.variables = JSON.parse(res.responseText);
                console.log(this.variables);
                this.domotica = new Domotica(this.variables);
                this.view.addChild(this.domotica);
            } catch (err) {
                console.log(err);
            }
        });
    }
}

new DomoticaDash();
