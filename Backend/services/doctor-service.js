const DoctorModel = require('../models/doctor-model');

class DoctorService {

    createDoctor = async doctor => await DoctorModel.create(doctor);

    updateDoctor = async (_id, doctor) => await DoctorModel.updateOne({ _id }, doctor, { runValidators: true });

    deleteDoctor = async (_id, doctor) => await DoctorModel.deleteOne({ _id }, doctor, { runValidators: true });

    findDoctor = async filter => await DoctorModel.findOne(filter);

    findDoctors = async filter => await DoctorModel.find(filter).populate('team');

    //findCount = async filter => await DoctorModel.find(filter).countDocuments();




}

module.exports = new DoctorService()