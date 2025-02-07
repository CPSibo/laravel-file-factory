import { Template } from '@pipe-dream/core/dist/pipe-dream.js'
import ModelPipe from './ModelPipe';
import F from '../utilities/Formatter'


export default class APIResourcePipe extends ModelPipe {

    static get title() {
        return 'APIResourcePipe';
    }

    calculateFiles(omc = ObjectModelCollection) {
        return [
            ... this.APIResourceFiles(),
        ]
    }

    APIResourceFiles() {
        return this.omc.modelsIncludingUser().map(model => {
            return {
                path: "app/Http/Resources/" + model.className() + "Resource.php",
                content: Template.for('APIResource.php').replace({
                    ___COLUMNS_BLOCK___: this.columnsBlock(model),
                    ___MODEL___: this.className(model),
                    ___MODEL_NAMESPACE___: this.modelNamespace(),                    
                })
            }
        })
    }

    columnsBlock(model) {
        return model.attributes.filter(attribute => {
            return !['password', 'remember_token'].includes(attribute.properties.name)
        }).map(attribute => {
            return F.singleQuotePad(attribute.properties.name) + " => $this->" + attribute.properties.name
        }).concat(model.relationships.hasMany.concat(model.relationships.belongsToMany).map(target => {
            return F.singleQuotePad(F.snakeCase(F.pluralize(target.name))) + " => new " + F.pascalCase(target.name) + "Collection($this->whenLoaded(" + F.singleQuotePad(F.snakeCase(F.pluralize(target.name))) + "))"
        })).concat(model.relationships.belongsTo.map(target => {
            return F.singleQuotePad(F.snakeCase(target.name)) + " => new " + F.pascalCase(target.name) + "Resource($this->whenLoaded(" + F.singleQuotePad(F.snakeCase(target.name)) + "))"
        })).join(",\n")
    }
}
