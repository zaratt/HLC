const TeamDto = require('./team-dto');

class DoctorDto {
    id;
    name;
    email;
    address;
    mobile;
    image;
    specialty1;
    specialty2;
    specialty3;
    subspecialty;
    patient_type;
    sus;
    last_visit;
    tj;
    hid;
    status;
    team;
    constructor(doctor) {
        this.id = doctor._id,
            this.name = doctor.name,
            this.email = doctor.email,
            this.address = doctor.address,
            this.mobile = doctor.mobile,
            this.image = doctor.image && `${process.env.BASE_URL}storage/images/profile/${doctor.image}`,
            this.specialty1 = doctor.specialty1,
            this.specialty2 = doctor.specialty2,
            this.specialty3 = doctor.specialty3,
            this.subspecialty = doctor.subspecialty,
            this.patient_type = doctor.patient_type && doctor.patient_type.charAt(0).toUpperCase() + doctor.patient_type.slice(1),
            this.sus = doctor.sus,
            this.last_visit = doctor.last_visit,
            this.tj = doctor.tj,
            this.hid = doctor.hid,
            this.status = doctor.status && doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1),
            this.team = doctor.team && new TeamDto(Array.isArray(doctor.team) && doctor.team.length > 0 ? doctor.team[0] : doctor.team);

    }

    /* this.team = user.team && new TeamDto(Array.isArray(user.team) && user.team.length>0 ? user.team[0] : user.team); */

}

module.exports = DoctorDto;