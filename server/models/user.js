const { trim, type } = require('jquery');
let mongoose=require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');
const { collection } = require('./movie');

let User = mongoose.Schema({
    username:
    {
        type: String,
        default: "",
        trim: true,
        required: false  
    },
    email:
    {
        type: String,
        default: "",
        trim: true,
        required: false  
    },
    displayName:
    {
        type: String,
        default: "",
        trim: true,
        required: false  
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true  
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true
    },
    linkedinId: {
        type: String,
        unique: true,
        sparse: true
    },
    created:
    {
        type: Date,
        default: Date.now
    },
    updated:
    {
        type: Date,
        default: Date.now
    }
},
{
    collection: "user"
}
)

let options = ({ missingPasswordError: 'Wrong/Missing Password' });
User.plugin(passportLocalMongoose, options);
module.exports.User = mongoose.model('User', User);