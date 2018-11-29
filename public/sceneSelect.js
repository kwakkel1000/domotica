class SceneSelect extends Element {
    constructor(blueprint) {
        let localBlueprint = {
            title: {
                type: H3,
                text: blueprint.options.sceneName
            }
        };
        blueprint.options.items.forEach((option) => {
            localBlueprint[option.name + "Button"] = {
                type: Button,
                text: option.name
            };
            if (option.active) {
                localBlueprint[option.name + "Button"].cssClass = "btn btn-primary active";
            }
        })
        super(localBlueprint);
        blueprint.options.items.forEach((option) => {
            this[option.name + "Button"].onClick = () => {
                app.reqManager.post("/apps/domotica/scene", {scene: blueprint.options.sceneName, value: option.name}, (res) => {
                    console.log(res);
                });
            }
        });
    }
}
