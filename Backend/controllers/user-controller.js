const ErrorHandler = require('../utils/error-handler');
const userService = require('../services/user-service');
const UserDto = require('../dtos/user-dto');
const mongoose = require('mongoose');
const crypto = require('crypto');
const teamService = require('../services/team-service');

class UserController {

    createUser = async (req, res, next) => {
        const file = req.file;
        let { name, email, password, type, address, mobile } = req.body;
        const username = 'user' + crypto.randomInt(11111111, 999999999);
        console.log(req.file)
        if (!name || !email || !username || !password || !type || !address || !file || !mobile) return next(ErrorHandler.badRequest('Todos os campos são requeridos'));
        type = type.toLowerCase();
        if (type === 'admin') {
            const adminPassword = req.body.adminPassword;
            if (!adminPassword)
                return next(ErrorHandler.badRequest(`Informe sua senha para adicionar ${name} como administrador`));
            const { _id } = req.user;
            const { password: hashPassword } = await userService.findUser({ _id });
            const isPasswordValid = await userService.verifyPassword(adminPassword, hashPassword);
            if (!isPasswordValid) return next(ErrorHandler.unAuthorized('Você digitou a senha errada'));
        }
        const user = {
            name, email, username, mobile, password, type, address, image: file.filename
        }
        const userResp = await userService.createUser(user);
        if (!userResp) return next(ErrorHandler.serverError('Falha ao criar conta'));
        res.json({ success: true, message: 'Usuario adicionado', user: new UserDto(user) });
    }

    updateUser = async (req, res, next) => {
        const file = req.file;
        const filename = file && file.filename;
        let user, id;
        console.log(req.user.type);
        if (req.user.type === 'admin') {
            const { id } = req.params;
            let { name, username, email, password, type, status, address, mobile } = req.body;
            type = type && type.toLowerCase();
            if (!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('ID Inválido'));
            if (type) {
                const dbUser = await userService.findUser({ _id: id });
                if (!dbUser) return next(ErrorHandler.badRequest('Usuário não encontrado'));
                if (dbUser.type != type) {
                    const { _id } = req.user;
                    if (_id === id) return next(ErrorHandler.badRequest(`Você não pode mudar sua posição`));
                    const { adminPassword } = req.body;
                    if (!adminPassword)
                        return next(ErrorHandler.badRequest(`Informe a senha de administrador para alterar os dados`));
                    const { password: hashPassword } = await userService.findUser({ _id });
                    const isPasswordValid = await userService.verifyPassword(adminPassword, hashPassword);
                    if (!isPasswordValid) return next(ErrorHandler.unAuthorized('Você digitou a senha errada'));

                    if ((dbUser.type === 'member') && (type === 'admin' || type === 'leader'))
                        if (dbUser.team != null) return next(ErrorHandler.badRequest(`Erro : ${dbUser.name} está em um grupo.`));

                    if ((dbUser.type === 'leader') && (type === 'admin' || type === 'member'))
                        if (await teamService.findTeam({ leader: id })) return next(ErrorHandler.badRequest(`Erro : ${dbUser.name} está com perfil de lider em um grupo.`));
                }
            }
            user = {
                name, email, status, username, mobile, password, type, address, image: filename
            }
        }
        else {
            id = req.user._id;
            let { name, username, address, mobile } = req.body;
            user = {
                name, username, mobile, address, image: filename
            }
        }
        const userResp = await userService.updateUser(id, user);
        if (!userResp) return next(ErrorHandler.serverError('Não foi possível atualizar a conta'));
        res.json({ success: true, message: 'Conta Atualizada com sucesso' });
    }

    getUsers = async (req, res, next) => {
        const type = req.path.split('/').pop().replace('s', '');
        const emps = await userService.findUsers({ type });
        if (!emps || emps.length < 1) return next(ErrorHandler.notFound(`Não ${type.charAt(0).toUpperCase() + type.slice(1).replace(' ', '')} Encontrado`));
        const members = emps.map((o) => new UserDto(o));
        res.json({ success: true, message: `${type.charAt(0).toUpperCase() + type.slice(1).replace(' ', '')} Lista Encontrada`, data: members })
    }


    getFreeMembers = async (req, res, next) => {
        const emps = await userService.findUsers({ type: 'member', team: null });
        if (!emps || emps.length < 1) return next(ErrorHandler.notFound(`Não foi encontrado nenhum membro sem grupo`));
        const members = emps.map((o) => new UserDto(o));
        res.json({ success: true, message: 'Lista de membros sem grupo encontrado', data: members })
    }


    getUser = async (req, res, next) => {
        const { id } = req.params;
        const type = req.path.replace(id, '').replace('/', '').replace('/', '');
        if (!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest(`Invalid ${type.charAt(0).toUpperCase() + type.slice(1).replace(' ', '')} Id`));
        const emp = await userService.findUser({ _id: id, type });
        if (!emp) return next(ErrorHandler.notFound(`Não Encontrado o ${type.charAt(0).toUpperCase() + type.slice(1).replace(' ', '')}`));
        res.json({ success: true, message: 'Membro encontrado', data: new UserDto(emp) })
    }

    getUserNoFilter = async (req, res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('User ID inválido'));
        const emp = await userService.findUser({ _id: id });
        if (!emp) return next(ErrorHandler.notFound('Usuário não encontrado'));
        res.json({ success: true, message: 'Usuário encontrado', data: new UserDto(emp) })
    }

    getLeaders = async (req, res, next) => {
        const leaders = await userService.findLeaders();
        const data = leaders.map((o) => new UserDto(o));
        res.json({ success: true, message: 'Líderes encontrados', data })
    }

    getFreeLeaders = async (req, res, next) => {
        const leaders = await userService.findFreeLeaders();
        const data = leaders.map((o) => new UserDto(o));
        res.json({ success: true, message: 'Líderes sem grupo encontrados', data })
    }


}

module.exports = new UserController();