import { Template } from '@pipe-dream/core/dist/pipe-dream.js'
import ModelPipe from './ModelPipe';
import F from '../utilities/Formatter'

export default class ControllerPipe extends ModelPipe {

    static get title() {
        return 'ControllerPipe';
    }

    calculateFiles(omc = ObjectModelCollection) {
        return omc.modelsIncludingUser().map(model => {
            return {
                path: "app/Http/Controllers/" + model.className() + "Controller.php",
                content: Template.for('Controller.php').replace({
                    ___HIDDEN___: this.hiddenAttributes(model),
                    ___MODEL___: this.className(model),
                    ___MODEL_INSTANCE___: F.camelCase(model.className()),
                    ___WITH_RELATIONSHIPS___: this.withRelationships(model),
                    ___FILLABLE___: this.fillableAttributes(model),
                    ___CASTS___: this.casts(model),
                    ___RELATIONSHIP_METHODS_BLOCK___: this.relationshipMethods(model),
                    ___MODEL_NAMESPACE___: this.modelNamespace(),                    
                })
            }
        })
    }

    withRelationships(model) {
        return "with([" + [
            ... model.relationships.hasMany.map(target => {
                return F.singleQuotePad(F.camelCase(F.pluralize(target.name)))
            }),

            ... model.relationships.belongsTo.map(target => {
                return F.singleQuotePad(F.camelCase(target.name))
            }),

            ... model.relationships.belongsToMany.map(target => {
                return F.singleQuotePad(F.camelCase(F.pluralize(target.name)))
            }),
        ].join(", ") + "])->"
    }
}
