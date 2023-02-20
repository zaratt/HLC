const teamService = require('../services/team-service');
const ErrorHandler = require('../utils/error-handler');
const TeamDto = require('../dtos/team-dto');
const userService = require('../services/user-service');
const mongoose = require('mongoose');
const UserDto = require('../dtos/user-dto');
const DoctorDto = require('../dtos/doctor-dto');
const doctorService = require('../services/doctor-service');


class TeamController {

    createTeam = async (req, res, next) => {
        const image = req.file && req.file.filename;
        const { name, description } = req.body;
        if (!name) return next(ErrorHandler.badRequest('Campos obrigatórios estão vazios'))
        const team = {
            name,
            description,
            image
        }
        const teamResp = await teamService.createTeam(team);
        if (!teamResp) return next(ErrorHandler.serverError('Falha ao criar o grupo'));
        res.json({ success: true, message: 'Grupo foi criado', team: new TeamDto(teamResp) });
    }

    updateTeam = async (req, res, next) => {
        const { id } = req.params;
        if (!id) return next(ErrorHandler.badRequest('Grupo ID ausente'));
        if (!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('Grupo ID inválido'));
        let { name, description, status, leader } = req.body;
        const image = req.file && req.file.filename;
        status = status && status.toLowerCase();
        if (leader && !mongoose.Types.ObjectId.isValid(leader)) return next(ErrorHandler.badRequest('Líder ID inválido'));
        const team = {
            name,
            description,
            status,
            image,
            leader
        }
        const teamResp = await teamService.updateTeam(id, team);
        return (teamResp.modifiedCount != 1) ? next(ErrorHandler.serverError('Falha ao atualizar dados do grupo')) : res.json({ success: true, message: 'Dados do grupo atualizado com sucesso' })
    }

    addMember = async (req, res, next) => {
        const { teamId, userId } = req.body;
        if (!teamId || !userId) return next(ErrorHandler.badRequest('Todos os campos são obrigatórios'));
        if (!mongoose.Types.ObjectId.isValid(teamId)) return next(ErrorHandler.badRequest('Grupo ID inválido'));
        if (!mongoose.Types.ObjectId.isValid(userId)) return next(ErrorHandler.badRequest('Membro ID inválido'));
        const user = await userService.findUser({ _id: userId });
        if (!user) return next(ErrorHandler.notFound('Membro não encontrado'));
        if (user.type != 'member') return next(ErrorHandler.badRequest(`${user.name} não é um membro`));
        if (user.team) return next(ErrorHandler.badRequest(`${user.name} já está no grupo`));
        const result = await userService.updateUser(userId, { team: teamId });
        return (result.modifiedCount != 1) ? next(ErrorHandler.serverError(`Falha ao adicionar o ${user.name} no grupo`)) : res.json({ success: true, message: ` ${user.name} adicionado com sucesso ao grupo` });
    }

    removeMember = async (req, res, next) => {
        const { userId } = req.body;
        if (!userId) return next(ErrorHandler.badRequest('Todos os campos são obrigatórios'));
        if (!mongoose.Types.ObjectId.isValid(userId)) return next(ErrorHandler.badRequest('Membro ID inválido'));
        const user = await userService.findUser({ _id: userId });
        if (!user) return next(ErrorHandler.notFound('Membro não encontrado'));
        if (user.type != 'member') return next(ErrorHandler.badRequest(`${user.name} não é um membro`));
        if (!user.team) return next(ErrorHandler.badRequest(`${user.name} não pertence a um grupo`));
        const result = await userService.updateUser(userId, { team: null });
        return (result.modifiedCount != 1) ? next(ErrorHandler.serverError(`Falha ao remover ${user.name} do grupo`)) : res.json({ success: true, message: ` ${user.name} Removido com sucesso do grupo` });
    }

    addRemoveLeader = async (req, res, next) => {
        const { userId: id, teamId } = req.body;
        const type = req.path.split('/').pop();
        if (!teamId || !id) return next(ErrorHandler.badRequest('Todos os campos são obrigatórios'));
        if (!mongoose.Types.ObjectId.isValid(teamId)) return next(ErrorHandler.badRequest('Grupo ID inválalido'));
        if (!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('Líder ID inválido'));
        const user = await userService.findUser({ _id: id });
        if (!user) return next(ErrorHandler.notFound('Líder não encontrado'));
        if (user.type !== 'leader') return next(ErrorHandler.badRequest(`${user.name} não está como líder`));
        const team = await teamService.findTeam({ leader: id });
        console.log(team)
        if (type === 'add' && team) return next(ErrorHandler.badRequest(`${user.name} já está com perfil de líder no '${team.name}'`));
        if (type === 'remove' && !team) return next(ErrorHandler.badRequest(`${user.name} não é líder em nenhum grupo`));
        const update = await teamService.updateTeam(teamId, { leader: type === 'add' ? id : null });
        console.log(type === 'add' ? id : null);
        return update.modifiedCount !== 1 ? next(ErrorHandler.serverError(`Não foi possível adicionar ${type.charAt(0).toUpperCase() + type.slice(1)} como líder do grupo`)) : res.json({ success: true, message: ` ${user.name} ${type === 'add' ? 'Adicionado' : 'Removido'} com sucesso como líder do grupo` })
    }

    getTeams = async (req, res, next) => {
        const teams = await teamService.findTeams({});
        if (!teams) return next(ErrorHandler.notFound('Grupo não encontrado'));
        const data = teams.map((o) => new TeamDto(o));
        res.json({ success: true, message: 'Grupo encontrado', data })
    }

    getTeam = async (req, res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('Grupo ID inválido'));
        const team = await teamService.findTeam({ _id: id });
        if (!team) return next(ErrorHandler.notFound('Grupo não encontrado'));
        const data = new TeamDto(team);
        const member = await userService.findCount({ team: data.id });
        data.information = { member };
        res.json({ success: true, message: 'Grupo encontrado', data })
    }

    getTeamMembers = async (req, res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('Grupo ID inválido'));
        const teams = await userService.findUsers({ team: id });
        if (!teams) return next(ErrorHandler.notFound('Grupo não encontrado'));
        const data = teams.map((o) => new UserDto(o));
        res.json({ success: true, message: 'Grupo encontrado', data })
    }

    getTeamDoctors = async (req, res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('Médico ID inválido'));
        const teams = await doctorService.findDoctors({ team: id });
        if (!teams) return next(ErrorHandler.notFound('Médico não encontrado'));
        const data = teams.map((o) => new DoctorDto(o));
        res.json({ success: true, message: 'Médico encontrado', data })
    }

    getCounts = async (req, res, next) => {
        const admin = await userService.findCount({ type: 'admin' });
        const member = await userService.findCount({ type: 'member' });
        const leader = await userService.findCount({ type: 'leader' });
        const doctor = await doctorService.findCount({});
        const team = await teamService.findCount({});
        const data = {
            admin,
            member,
            leader,
            doctor,
            team
        }
        res.json({ success: true, message: 'Encontrados', data })
    }

}

module.exports = new TeamController();