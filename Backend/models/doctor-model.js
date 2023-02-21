const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Informe um email válido'],
        unique: [true, 'Esse email já existe'],
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} não é um email válido'
        }
    },
    address: {
        type: String,
        default: 'Endereço não informado',
        maxlength: 100,
        trim: true
    },

    mobile: {
        type: Number,
        required: false,
        minlength: 10,
        maxlength: 13,
    },

    image: {
        type: String,
        required: false,
        default: 'user.png'
    },
    specialty1: {
        type: String,
        required: false,
        default: 'Selecione a especialidade'
    },
    specialty2: {
        type: String,
        required: false,
        default: 'Selecione a especialidade'
    },

    specialty3: {
        type: String,
        required: false,
        default: 'Selecione a especialidade'
    },

    subspecialty: {
        type: String,
        required: false,
        default: 'Selecione a subespecialidade'
    },

    patient_type: {
        type: String,
        enum: ['Adulto', 'Ambos', 'Pediátrico'],
        default: 'Ambos'
    },

    sus: {
        type: String,
        enum: ['sim', 'não'],
        default: 'não'
    },

    last_visit: {
        type: Date,
        required: false
    },

    tj: {
        type: String,
        enum: ['sim', 'não'],
        default: 'não'
    },

    hid: {
        type: String,
        enum: ['sim', 'não'],
        default: 'não'
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


}, {
    timestamps: true
});



module.exports = new mongoose.model('Doctor', doctorSchema, 'doctors');