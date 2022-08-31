import Dots from './dots.js';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        async dot(obj, {_id}, { user }){
            return Dots.findOne(_id);
        },
        async dots(obj, {set}, args){
            return Dots.find({}).fetch() || {};
        },
    },
    Mutation:{
        async addDot(obj,{label,x,y,z,set},{user}){
            if(user._id){
                Dots.insert({
                    _id:new Mongo.ObjectID(),
                    label:label,
                    x:x,
                    y:y,
                    z:z,
                    set:set
                });
                return [{status:"success",message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        async deleteDot(obj,{_id},{user}){
            if(user._id){
                const admin = Meteor.users.findOne({_id:user._id});
                if(admin.settings.isAdmin){
                    Dots.remove(new Mongo.ObjectID(_id));
                    return [{status:"success",message:'Dot deleted'}];
                }
                return [{status:"error",message:'Error while deleting'}];
            }
            throw new Error('Unauthorized')
        },
        async flushDots(obj,args,{user}){
            if(user._id){
                const admin = Meteor.users.findOne({_id:user._id});
                if(admin.settings.isAdmin){
                    Dots.remove({});
                    return [{status:"success",message:'All dots deleted'}];
                }
                return [{status:"error",message:'Error while deleting'}];
            }
            throw new Error('Unauthorized')
        },
        async dummyDots(obj,{n},{user}){
            if(user._id){
                const admin = Meteor.users.findOne({_id:user._id});
                if(admin.settings.isAdmin){
                    for (let index = 0; index < n; index++) {
                        Dots.insert({
                            _id:new Mongo.ObjectID(),
                            label:"",
                            x:Math.random(),
                            y:Math.random(),
                            z:Math.random(),
                            set:""
                        });
                    }
                    return [{status:"success",message:'Dummy dots generated'}];
                }
                return [{status:"error",message:'Error while deleting'}];
            }
            throw new Error('Unauthorized')
        }
    }
}