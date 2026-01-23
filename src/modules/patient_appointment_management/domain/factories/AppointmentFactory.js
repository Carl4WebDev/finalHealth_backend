import Patient from "../entities/Patient.js";
import Appointment from "../entities/Appointment.js";

export default class AppointmentFactory {
  createPatient(dto) {
    return new Patient.Builder()
      .setFName(dto.fName)
      .setMName(dto.mName)
      .setLName(dto.lName)
      .setGender(dto.gender)
      .setDateOfBirth(dto.dateOfBirth)
      .setContactNumber(dto.contactNumber)
      .setBackupContact(dto.backupContact)
      .setEmail(dto.email)
      .setAddress(dto.address)
      .setPatientTypeId(dto.priorityId)
      .build();
  }

  createAppointment(dto) {
    return new Appointment.Builder()
      .setPatientId(dto.patientId)
      .setDoctorId(dto.doctorId)
      .setClinicId(dto.clinicId)
      .setAppointmentDate(dto.appointmentDate)
      .setAppointmentType(dto.appointmentType)
      .setPriorityId(dto.priorityId)
      .setStatus(dto.status)
      .build();
  }
}
