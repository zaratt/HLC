const validator = require('validator');
const bcrypt = require('bcrypt');
const ErrorHandler = require('../utils/error-handler');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');
const otpService = require('../services/otp-service');
const mailService = require('../services/mail-service');

class AuthController {

    login = async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) return next(ErrorHandler.badRequest());
        let data;
        if (validator.isEmail(email))
            data = { email }
        else
            data = { username: email };
        const user = await userService.findUser(data);
        if (!user) return next(ErrorHandler.badRequest('Email ou Usuário Inválido'));
        const { _id, name, username, email: dbEmail, password: hashPassword, type, status, team } = user;
        if (status != 'ativo') return next(ErrorHandler.badRequest('Há uma problema com sua conta, contate o administrador'));
        const isValid = await userService.verifyPassword(password, hashPassword);
        if (!isValid) return next(ErrorHandler.badRequest('Senha Incorreta'));
        const payload = {
            _id,
            name,
            email: dbEmail,
            username,
            type,
        }
        const { accessToken, refreshToken } = tokenService.generateToken(payload);
        await tokenService.storeRefreshToken(_id, refreshToken);
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })

        res.json({ success: true, message: 'Login Successfull', user: new UserDto(user) })
    }

    forgot = async (req, res, next) => {
        const { email: requestEmail } = req.body;
        if (!requestEmail) return next(ErrorHandler.badRequest());
        if (!validator.isEmail(requestEmail)) return next(ErrorHandler.badRequest('Email inválido'));
        const user = await userService.findUser({ email: requestEmail });
        if (!user) return next(ErrorHandler.notFound('Email inválido'));
        const { _id: userId, name, email } = user;
        const otp = otpService.generateOtp();
        const type = process.env.TYPE_FORGOT_PASSWORD || 2;
        await otpService.removeOtp(userId);
        await otpService.storeOtp(userId, otp, type);
        await mailService.sendForgotPasswordMail(name, email, otp);
        res.json({ success: true, message: 'Uma mensagem foi enviado ao seu email' });
    }

    reset = async (req, res, next) => {
        const { email, otp, password } = req.body;
        if (!email || !otp || !password) return next(ErrorHandler.badRequest());
        const user = await userService.findUser({ email });
        if (!user) return next(ErrorHandler.notFound('Conta não encontrada'));
        const { _id: userId } = user;
        const type = process.env.TYPE_FORGOT_PASSWORD || 2;
        const response = await otpService.verifyOtp(userId, otp, type);
        console.log(response);
        if (response === 'INVALID') return next(ErrorHandler.badRequest('OTP Inválido'));
        if (response === 'EXPIRED') return next(ErrorHandler.badRequest('Otp Expirado'));
        const { modifiedCount } = await userService.updatePassword(userId, password);
        return modifiedCount === 1 ? res.json({ success: true, message: 'Senha redefinida com sucesso' }) : next(ErrorHandler.serverError('Falha ao redefinir a senha'));
    }

    logout = async (req, res, next) => {
        const { refreshToken } = req.cookies;
        const { _id } = req.user;
        const response = await tokenService.removeRefreshToken(_id, refreshToken);
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        return (response.modifiedCount === 1) ? res.json({ success: true, message: 'Você saiu com sucesso do sistema' }) : next(ErrorHandler.unAuthorized());
    }

    refresh = async (req, res, next) => {
        const { refreshToken: refreshTokenFromCookie } = req.cookies;
        if (!refreshTokenFromCookie) return next(ErrorHandler.unAuthorized());
        const userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
        const { _id, email, username, type } = userData;
        const token = await tokenService.findRefreshToken(_id, refreshTokenFromCookie);
        if (!token) {
            res.clearCookie('refreshToken');
            res.clearCookie('accessToken');
            return res.status(401).json({ success: false, message: 'Acesso não autorizado' })
        }
        const user = await userService.findUser({ email });
        if (user.status != 'active') return next(ErrorHandler.unAuthorized('Há uma problema com sua conta, contate o administrador'));
        const payload = {
            _id,
            email,
            username,
            type
        }
        const { accessToken, refreshToken } = tokenService.generateToken(payload);
        await tokenService.updateRefreshToken(_id, refreshTokenFromCookie, refreshToken);
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })
        res.json({ success: true, message: 'Acesso seguro concedido', user: new UserDto(user) })
    }

}

module.exports = new AuthController();