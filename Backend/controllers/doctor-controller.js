const ErrorHandler = require('../utils/error-handler');
/* const userService = require('../services/user-service'); */
/* const UserDto = require('../dtos/user-dto'); */
const doctorService = require('../services/doctor-service')
const DoctorDto = require('../dtos/doctor-dto');
const mongoose = require('mongoose');
//const teamService = require('../services/team-service');


class DoctorController {

    createDoctor = async (req, res, next) => {

        {

            const image = req.file && req.file.filename;
            const { name, email, address, mobile, specialty1, specialty2, specialty3, subspecialty, patient_type, sus, last_visit, tj, hid } = req.body;
            if (!name || !email || !mobile) return next(ErrorHandler.badRequest('Campos obrigatórios'));

            if (['admin'].includes(type.toLowerCase())) {
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


                doctor = {
                    name, email, address, mobile, specialty1, specialty2, specialty3, subspecialty, patient_type, sus, last_visit, tj, hid, image: filename
                }

                const doctorResp = await doctorService.createDoctor(doctor);
                if (!doctorResp) return next(ErrorHandler.serverError('Erro ao registrar o médico'));
                res.json({ success: true, message: 'Médico criado com sucesso', doctor: new DoctorDto(DoctorResp) });

            }

        }
    }

    /* createDoctorMember = async (req, res, next) => {
 
        {
            const { userId, teamId } = req.body;
            if (!teamId || !userId) return next(ErrorHandler.notFound('Não encontrado ID válido para grupo ou usuário!'));
            const user = await userService.findUser({ _id: userId });
            if (user.type != 'admin') return next(ErrorHandler.badRequest(`${user.name} não é pertence ao grupo`));
 
            const image = req.file && req.file.filename;
            const { name, email, address, mobile, specialty1, specialty2, specialty3, subspecialty, patient_type, sus, last_visit, tj, hid, team } = req.body;
            if (!name || !email || !mobile) return next(ErrorHandler.badRequest('Campos obrigatórios'));
 
 
            type = type.toLowerCase();
            if (type === 'member') {
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
                    team
 
 
                doctor = {
                    name, email, address, mobile, specialty1, specialty2, specialty3, subspecialty, patient_type, sus, last_visit, tj, hid, team, image: filename
                }
 
                const doctorResp = await doctorService.createDoctor({ doctor, team: teamId });
                if (!doctorResp) return next(ErrorHandler.serverError('Erro ao registrar o médico'));
                if (doctor.team) return next(ErrorHandler.badRequest(`${doctor.name} já pertence ao grupo`));
                res.json({ success: true, message: 'Médico criado com sucesso', doctor: new DoctorDto(DoctorResp) });
            }
        }
    } */

    updateDoctor = async (req, res, next) => {
        const { id } = req.params;
        if (!id) return next(ErrorHandler.badRequest('Médico não encontrado'));
        if (!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('Médico ID inválido'));
        const { name, email, address, mobile, specialty1, specialty2, specialty3, subspecialty, patient_type, sus, last_visit, tj, hid, status, team } = req.body;
        const image = req.file && req.file.filename;
        status = status && status.toLowerCase();
        if (user && !mongoose.Types.ObjectId.isValid(user)) return next(ErrorHandler.badRequest('ID de usuário inválido'));

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
            status,
            team
        }
        const doctorResp = await doctorService.updateDoctor(id, doctor);
        return (doctorResp.modifiedCount != 1) ? next(ErrorHandler.serverError('Falha ao atualizar o médico')) : res.json({ success: true, message: 'Médico atualizado' })
    }

    deleteDoctor = async (req, res, next) => {
        const { id } = req.params;
        if (!id) return next(ErrorHandler.badRequest('Médico não encontrado'));
        if (!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('Médico ID inválido'));
        let { name, email, address, mobile, specialty1, specialty2, specialty3, subspecialty, patient_type, sus, last_visit, tj, hid, status, team } = req.body;
        const image = req.file && req.file.filename;
        status = status && status.toLowerCase();
        if (user && !mongoose.Types.ObjectId.isValid(user)) return next(ErrorHandler.badRequest('ID de usuário inválido'));

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
            status,
            team
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
        const doctor = await doctorService.findDoctor({ _id: id });
        if (!doctor) return next(ErrorHandler.notFound('Médico não encontrado'));
        const data = new DoctorDto(doctor);
        /* const team = await doctorService.findCount({ doctor: data.id }); */
        /* data.information = { team }; */
        res.json({ success: true, message: 'Médico encontrado', data })
    }

    getFreeDoctors = async (req, res, next) => {
        const doctors = await doctorService.findFreeDoctors({ teamId: null });
        if (!doctors) return next(ErrorHandler.notFound('Não existem médicos sem grupos'));
        const dts = doctors.map((o) => new DoctorDto(o));
        res.json({ success: true, message: 'Médicos sem grupo encontrado', data: dts })
    }


}

module.exports = new DoctorController();