export default class AssignDoctorToClinicDTO {
  constructor(body) {
    this.doctorId = body.doctorId;
    this.clinicId = body.clinicId;
  }
}
