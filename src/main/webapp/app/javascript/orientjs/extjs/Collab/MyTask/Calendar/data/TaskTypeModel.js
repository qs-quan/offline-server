Ext.define('OrientTdm.Collab.MyTask.Calendar.data.TaskTypeModel', {
    extend: 'Ext.data.Model',
    
    requires: [
        'OrientTdm.Collab.MyTask.Calendar.data.TaskTypeMappings'
    ],
    
    statics: {
        /**
         * Reconfigures the default record definition based on the current {@link OrientTdm.Collab.MyTask.Calendar.data.TaskTypeMappings TaskTypeMappings}
         * object. See the header documentation for {@link OrientTdm.Collab.MyTask.Calendar.data.TaskTypeMappings} for complete details and
         * examples of reconfiguring a CalendarRecord.
         * @method create
         * @static
         * @return {Function} The updated CalendarRecord constructor function
         */
        reconfigure: function(){
            var Data = OrientTdm.Collab.MyTask.Calendar.data,
                Mappings = Data.TaskTypeMappings,
                proto = Data.TaskTypeModel.prototype,
                fields = [];
            
            // It is critical that the id property mapping is updated in case it changed, since it
            // is used elsewhere in the data package to match records on CRUD actions:
            proto.idProperty = Mappings.TaskTypeId.name || 'id';
            
            for(prop in Mappings){
                if(Mappings.hasOwnProperty(prop)){
                    fields.push(Mappings[prop]);
                }
            }
            proto.fields.clear();
            for(var i = 0, len = fields.length; i < len; i++){
                proto.fields.add(Ext.create('Ext.data.Field', fields[i]));
            }
            return Data.TaskTypeModel;
        }
    }
},
function() {
    OrientTdm.Collab.MyTask.Calendar.data.TaskTypeModel.reconfigure();
});