class Domotica extends Element{
    constructor(variables){
        let blueprint = {
            day: {
                type: H3,
                text: ""
            },
            comfortSelect: {
                type: ComfortSelect,
                options: {
                    items: []
                }
            },
            WoonkamerMediaSelect: {
                type: MediaSelect,
                options: {
                    location: "Woonkamer",
                    items: []
                }
            },
            SlaapkamerSceneSelect: {
                type: SceneSelect,
                options: {
                    sceneName: "Slaapkamer",
                    items: []
                }
            },
            HobbykamerSceneSelect: {
                type: SceneSelect,
                options: {
                    sceneName: "Hobbykamer",
                    items: []
                }
            }
        };
        let mediaRooms = ["Woonkamer"];
        if (variables.day) {
            blueprint.day.text = "Dag";
        }
        else {
            blueprint.day.text = "Nacht";
        }
        let comfortItems = ["vacation", "away", "sleep", "warmup", "home", "comfort"];
        comfortItems.forEach((comfortItem) => {
            let itemObject = {name: comfortItem};
            if (variables.Comfort === comfortItem) {
                itemObject.active = true;
            }
            blueprint.comfortSelect.options.items.push(itemObject);
        });
        let woonkamerMediaItems = ["off", "tv", "movie", "pc", "console", "music"];
        woonkamerMediaItems.forEach((woonkamerMediaItem) => {
            let itemObject = {name: woonkamerMediaItem};
            if (variables.Woonkamer.media === woonkamerMediaItem) {
                itemObject.active = true;
            }
            blueprint.WoonkamerMediaSelect.options.items.push(itemObject);
        });
        let slaapkamerScenes = ["off", "wakeup", "tv", "movie", "music"];
        slaapkamerScenes.forEach((slaapkamerScene) => {
            let itemObject = {name: slaapkamerScene};
/*            if (variables.Slaapkamer.scene === slaapkamerScene) {
                itemObject.active = true;
            }*/
            blueprint.SlaapkamerSceneSelect.options.items.push(itemObject);
        });
        let hobbykamerScenes = ["off", "solderen", "voeding", "alles"];
        hobbykamerScenes.forEach((hobbykamerScene) => {
            let itemObject = {name: hobbykamerScene};
/*            if (variables.Hobbykamer.scene === hobbykamerScene) {
                itemObject.active = true;
            }*/
            blueprint.HobbykamerSceneSelect.options.items.push(itemObject);
        });
        super(blueprint);
        this.variables = variables;
        app.socketManager.socket.on("variables", (data) => {
            console.log(data);
            console.log(this)
            for (let variable in data) {
                if (data.hasOwnProperty(variable)) {
                    if (variable === "day") {
                        if (data[variable]) {
                            this.day.setText = "Dag";
                        }
                        else {
                            this.day.setText = "Nacht";
                        }
                    }
                    else if (variable === "Comfort") {
                        if (this.variables.Comfort !== data.Comfort) {
                            this.comfortSelect[this.variables.Comfort + "Button"].removeCssClass("active");
                            this.comfortSelect[data.Comfort + "Button"].addCssClass("active");
                            this.variables.Comfort = data.Comfort;
                        }
                    }
                    else if (mediaRooms.indexOf(variable) !== -1) {
                        if (this.variables[variable].media !== data[variable].media) {
                            this[variable + "MediaSelect"][this.variables[variable].media + "Button"].removeCssClass("active");
                            this[variable + "MediaSelect"][data[variable].media + "Button"].addCssClass("active");
                            this.variables[variable].media = data[variable].media;
                        }
                    }
                }
            }
        });
    }
}
