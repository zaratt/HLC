const ErrorHandler = require('../utils/error-handler');
const userService = require('../services/user-service');
const DoctorDto = require('../dtos/doctor-dto');
const mongoose = require('mongoose');
const teamService = require('../services/team-service');
const doctorService = require('../services/doctor-service')

class DoctorController {

    createDoctor = async (req, res, next) => {
        const { type, team } = req.body;

        type = type.toLowerCase();
        team = team.toLowerCase();

        //Verifying if type(admin, team member, team leader)
        if ({ type: 'admin' || 'member' || 'leader', team: req.user.team })
            if (type && team != null) return next(ErrorHandler.badRequest(`Erro : ${dbUser.name} não pode cadastrar médicos.`));


        const image = req.file && req.file.filename;
        const { name, email, address, mobile, specialty1, specialty2, specialty3, subspecialty, patient_type, sus, last_visit, tj, hid } = req.body;
        if (!name || !email || !mobile) return next(ErrorHandler.badRequest('Campos obrigatórios'));


        const doctor = {
            name,
            email,
            address,
            mobile,
            image,
            specialty1,
            specialty2,
            specialty3,
            subspecialty,
            patient_type,
            sus,
            last_visit,
            tj,
            hid
        }


        const doctorResp = await doctorService.createDoctor(doctor);
        if (!doctorResp) return next(ErrorHandler.serverError('Erro ao cadastrar o médico'));
        res.json({ success: true, message: 'Médico cadastrado com sucesso', doctor: new DoctorDto(doctor) });


    }

    updateDoctor = async (req, res, next) => {
        const { id } = req.params;
        if (!id) return next(ErrorHandler.badRequest('Médico não encontrado'));
        if (!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('Médico ID inválido'));
        let { name, email, address, mobile, specialty1, specialty2, specialty3, subspecialty, patient_type, sus, last_visit, tj, hid, status } = req.body;
        const image = req.file && req.file.filename;
        status = status && status.toLowerCase();
        if (user && !mongoose.Types.ObjectId.isValid(user)) return next(ErrorHandler.badRequest('User ID inválido'));

        const doctor = {
            name,
            email,
            address,
            mobile,
            image,
            specialty1,
            specialty2,
            specialty3,
            subspecialty,
            patient_type,
            sus,
            last_visit,
            tj,
            hid,
            status
        }
        const doctorResp = await doctorService.updateDoctor(id, doctor);
        return (doctorResp.modifiedCount != 1) ? next(ErrorHandler.serverError('Falha ao atualizar o médico')) : res.json({ success: true, message: 'Médico atualizado' })
    }

    deleteDoctor = async (req, res, next) => {
        const { id } = req.params;
        if (!id) return next(ErrorHandler.badRequest('Médico não encontrado'));
        if (!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('Médico ID inválido'));
        let { name, email, address, mobile, specialty1, specialty2, specialty3, subspecialty, patient_type, sus, last_visit, tj, hid, status } = req.body;
        const image = req.file && req.file.filename;
        status = status && status.toLowerCase();
        if (user && !mongoose.Types.ObjectId.isValid(user)) return next(ErrorHandler.badRequest('User ID inválido'));

        const doctor = {
            name,
            email,
            address,
            mobile,
            image,
            specialty1,
            specialty2,
            specialty3,
            subspecialty,
            patient_type,
            sus,
            last_visit,
            tj,
            hid,
            status
        }
        const doctorResp = await doctorService.deleteDoctor(id, doctor);
        return (doctorResp.modifiedCount != 1) ? next(ErrorHandler.serverError('Não foi possível deletar o médico. Tente novamente mais tarde')) : res.json({ success: true, message: 'Médico atualizado' })
    }

    getDoctors = async (req, res, next) => {
        const doctors = await doctorService.findDoctors({});
        if (!doctors) return next(ErrorHandler.notFound('Médico não encontrado'));
        const data = doctors.map((o) => new DoctorDto(o));
        res.json({ success: true, message: 'Médicos encontrados', data })
    }

    getDoctor = async (req, res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('Médico ID inválido'));
        const doctor = await doctorService.findTeam({ _id: id });
        if (!doctor) return next(ErrorHandler.notFound('Médico não encontrado'));
        const data = new DoctorDto(doctor);
        const member = await userService.findCount({ doctor: data.id });
        data.information = { member };
        res.json({ success: true, message: 'Médico encontrado', data })
    }


}

module.exports = new DoctorController();