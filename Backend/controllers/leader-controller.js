const userService = require('../services/user-service');
const teamService = require('../services/team-service');
const doctorService = require('../services/doctor-service');
const ErrorHandler = require('../utils/error-handler');
const UserDto = require('../dtos/user-dto');
const TeamDto = require('../dtos/team-dto');
const DoctorDto = require('../dtos/doctor-dto');

class LeaderController {

    getTeamMembers = async (req, res, next) => {
        const team = await teamService.findTeam({ leader: req.user._id });
        if (!team) return next(ErrorHandler.notFound('Seu perfil não é de gestão de grupo'));
        const members = await userService.findUsers({ team: team._id });
        if (!members || members.length < 1) return next(ErrorHandler.notFound('Não foi possível encontrar nenhum membro do seu grupo'));
        const data = members.map((o) => new UserDto(o));
        res.json({ success: true, message: 'Membros Encontrados', data });
    }

    getTeam = async (req, res, next) => {
        const team = await teamService.findTeam({ leader: req.user._id });
        if (!team) return next(ErrorHandler.notFound('Seu perfil não é de gestão de grupo'));
        const data = new TeamDto(team);
        res.json({ success: true, message: 'Equipe encontrada', data });
    }

    getDoctors = async (req, res, next) => {
        const team = await teamService.findTeam({ leader: req.user._id });
        if (!team) return next(ErrorHandler.notFound('Seu perfil não é de gestão de grupo'));
        const doctors = await doctorService.findUsers({ team: team._id });
        if (!doctors || doctors.length < 1) return next(ErrorHandler.notFound('Não foi possível encontrar nenhum medico no seu grupo'));
        const data = doctors.map((o) => new DoctorDto(o));
        res.json({ success: true, message: 'Médicos Encontrados', data });
    }


}

module.exports = new LeaderController();