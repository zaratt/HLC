const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const teamScheam = new Schema({

    name: {
        type: String,
        unique: true,
        require: true,
        minlength: [3, 'Nome muito curto.'],
        maxlength: [20, "Nome muito extenso"],
        trim: true
    },
    description: {
        type: String,
        required: false,
        default: 'Esse grupo não tem descrição'
    },
    image: {
        type: String,
        required: false,
        default: 'team.png'
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    status: {
        type: String,
        enum: ['ativo', 'inativo', 'deletado'],
        default: 'ativo'
    }

}, {
    timestamps: true
});

module.exports = new mongoose.model('Team', teamScheam, 'teams');