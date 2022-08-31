import Sets from './sets.js';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        async set(obj, {_id}, { user }){
            return Sets.findOne(_id);
        },
        async sets(obj, args){
            return Sets.find({}).fetch() || {};
        }
    },
    Mutation:{
        async addSet(obj,{title},{user}){
            if(user._id){
                const url = "/"+title.toLowerCase().replace(" ","-");
                Sets.insert({
                    _id:new Mongo.ObjectID(),
                    title:title
                });
                return [{status:"success",message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        async deleteSet(obj,{_id},{user}){
            if(user._id){
                const admin = Meteor.users.findOne({_id:user._id});
                if(admin.settings.isAdmin){
                    Sets.remove(new Mongo.ObjectID(_id));
                    return [{status:"success",message:'Set deleted'}];
                }
                return [{status:"error",message:'Error while deleting'}];
            }
            throw new Error('Unauthorized')
        }
    }
}