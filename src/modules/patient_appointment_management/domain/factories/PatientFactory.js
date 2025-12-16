import Patient from "../entities/Patient.js";

export default class PatientFactory {
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
      .setPatientTypeId(dto.patientTypeId)
      .build();
  }
}
