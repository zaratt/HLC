const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 15,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Informe um Email'],
        unique: [true, 'Esse email já existe'],
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} não é um email válido'
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 15,
        trim: true
    },
    mobile: {
        type: Number,
        required: true,
        minlength: 10,
        maxlength: 13,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    type: {
        type: String,
        enum: ['admin', 'member', 'leader'],
        default: 'member'
    },
    status: {
        type: String,
        enum: ['ativo', 'inativo'],
        default: 'ativo'
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    image: {
        type: String,
        required: false,
        default: 'user.png'
    },
    address: {
        type: String,
        default: 'Endereço não informado',
        maxlength: 100,
        trim: true
    }
}, {
    timestamps: true
});

const SALT_FACTOR = process.env.BCRYPT_PASSWORD_SALT_FACTOR || 10;


// userSchema.path('password').validate(
//     console.log('calling')
// )


userSchema.pre('save', function (done) {
    const user = this;
    if (!user.isModified('password'))
        return done();

    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err)
            return done(err);

        bcrypt.hash(user.password, salt, (err, hashedPassword) => {
            if (err)
                return done(err);
            user.password = hashedPassword;
            return done();
        });
    });
});

userSchema.pre('updateOne', function (done) {
    const user = this.getUpdate();
    if (!user.password)
        return done();
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err)
            return done(err);
        bcrypt.hash(user.password, salt, (err, hashedPassword) => {
            if (err) return done(err);
            user.password = hashedPassword;
            return done();
        });
    });
});

module.exports = new mongoose.model('User', userSchema, 'users');