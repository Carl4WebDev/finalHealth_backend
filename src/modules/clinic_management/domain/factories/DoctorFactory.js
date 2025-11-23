import Clinic from "../entities/Clinic.js";
import Doctor from "../entities/Doctor.js";
import DoctorSession from "../entities/DoctorSession.js";

export default class DoctorFactory {
  createClinic(dto) {
    return new Clinic.Builder()
      .setClinicName(dto.clinicName)
      .setAddress(dto.address)
      .setContactNum(dto.contactNum)
      .setBackupNum(dto.backupNum)
      .setOpenHours(dto.openHours)
      .setOpenDays(dto.openDays)
      .setBusinessPermitNo(dto.businessPermitNo)
      .setOwnerName(dto.ownerName)
      .setProfileImagePath(dto.profileImagePath)
      .build();
  }

  createDoctor(dto) {
    return new Doctor.Builder()
      .setFName(dto.fName)
      .setMName(dto.mName)
      .setLName(dto.lName)
      .setSpecialization(dto.specialization)
      .setLicenseNumber(dto.licenseNumber)
      .setYearsExperience(dto.yearsExperience)
      .setEducation(dto.education)
      .setGender(dto.gender)
      .setAddress(dto.address)
      .build();
  }

  createSession(dto) {
    return new DoctorSession.Builder()
      .setDoctorId(dto.doctorId)
      .setClinicId(dto.clinicId)
      .setDayOfWeek(dto.dayOfWeek)
      .setStartTime(dto.startTime)
      .setEndTime(dto.endTime)
      .build();
  }
}
