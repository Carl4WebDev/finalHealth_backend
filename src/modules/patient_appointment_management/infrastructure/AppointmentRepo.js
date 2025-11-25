import IAppointmentRepository from "../domain/repositories/IAppointmentRepository.js";
import Appointment from "../domain/entities/Appointment.js";
import db from "../../../core/database/db.js";

export default class AppointmentRepo extends IAppointmentRepository {
  async save(appointment) {
    const query = `
      INSERT INTO appointments
      (patient_id, doctor_id, clinic_id, appointment_date, appointment_type, priority_id, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *;
    `;

    const values = [
      appointment.patientId,
      appointment.doctorId,
      appointment.clinicId,
      appointment.appointmentDate,
      appointment.appointmentType,
      appointment.priorityId,
      appointment.status,
    ];

    const result = await db.query(query, values);
    return this._toEntity(result.rows[0]);
  }

  async findById(id) {
    const result = await db.query(
      `SELECT * FROM appointments WHERE appointment_id=$1`,
      [id]
    );
    if (result.rows.length === 0) return null;
    return this._toEntity(result.rows[0]);
  }

  async findByPatient(patientId) {
    const result = await db.query(
      `SELECT * FROM appointments 
       WHERE patient_id=$1
       ORDER BY appointment_date DESC`,
      [patientId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  async findByDateRange(clinicId, fromDate, toDate) {
    const result = await db.query(
      `SELECT * FROM appointments
       WHERE clinic_id=$1
         AND appointment_date BETWEEN $2 AND $3
       ORDER BY appointment_date`,
      [clinicId, fromDate, toDate]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  async update(appointment) {
    const query = `
      UPDATE appointments
      SET appointment_date=$1,
          appointment_type=$2,
          priority_id=$3,
          status=$4
      WHERE appointment_id=$5
      RETURNING *;
    `;

    const values = [
      appointment.appointmentDate,
      appointment.appointmentType,
      appointment.priorityId,
      appointment.status,
      appointment.appointmentId,
    ];

    const result = await db.query(query, values);
    return this._toEntity(result.rows[0]);
  }

  async updateStatus(id, status) {
    const result = await db.query(
      `UPDATE appointments
       SET status=$1
       WHERE appointment_id=$2
       RETURNING *;`,
      [status, id]
    );
    return this._toEntity(result.rows[0]);
  }
  async findAllByDoctorAndClinic(doctorId, clinicId) {
    const query = `
    SELECT 
      a.*,
      p.priority_level,
      p.priority_rank,

      -- PATIENT
      pa.f_name AS patient_fname,
      pa.l_name AS patient_lname,
      pa.gender AS patient_gender,

      -- CLINIC
      c.clinic_name,

      -- DOCTOR
      d.f_name AS doctor_fname,
      d.l_name AS doctor_lname

    FROM appointments a
    LEFT JOIN priority_queue p ON p.priority_id = a.priority_id
    LEFT JOIN patients pa ON pa.patient_id = a.patient_id
    LEFT JOIN clinics c ON c.clinic_id = a.clinic_id
    LEFT JOIN doctors d ON d.doctor_id = a.doctor_id

    WHERE a.doctor_id = $1
      AND a.clinic_id = $2
      AND a.status NOT IN ('Completed', 'Cancelled')

    ORDER BY a.appointment_date DESC;
  `;

    const result = await db.query(query, [doctorId, clinicId]);

    return result.rows.map((row) => {
      const entity = this._toEntity(row);
      return {
        ...entity,
        patientName: `${row.patient_fname} ${row.patient_lname}`,
        gender: row.patient_gender,
        clinicName: row.clinic_name,
        doctorName: `${row.doctor_fname} ${row.doctor_lname}`,
        priorityLevel: row.priority_level,
        priorityRank: row.priority_rank,
      };
    });
  }

  async checkDoubleBooking(patientId, date) {
    const result = await db.query(
      `SELECT * FROM appointments
       WHERE patient_id=$1
         AND appointment_date=$2
         AND status IN ('Scheduled','Completed')`,
      [patientId, date]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  async findTodayAppointments(doctorId, clinicId) {
    const query = `
    SELECT 
      a.*,
      p.priority_level,
      p.priority_rank,

      -- PATIENT
      pa.f_name AS patient_fname,
      pa.l_name AS patient_lname,
      pa.gender AS patient_gender,

      -- CLINIC
      c.clinic_name,

      -- DOCTOR
      d.f_name AS doctor_fname,
      d.l_name AS doctor_lname

    FROM appointments a
    LEFT JOIN priority_queue p ON p.priority_id = a.priority_id
    LEFT JOIN patients pa ON pa.patient_id = a.patient_id
    LEFT JOIN clinics c ON c.clinic_id = a.clinic_id
    LEFT JOIN doctors d ON d.doctor_id = a.doctor_id

    WHERE a.doctor_id = $1
      AND a.clinic_id = $2
      AND DATE(a.appointment_date) = CURRENT_DATE
      AND a.status NOT IN ('Completed', 'Cancelled')

    ORDER BY a.appointment_date ASC;
  `;

    const result = await db.query(query, [doctorId, clinicId]);

    return result.rows.map((row) => {
      const entity = this._toEntity(row);
      return {
        ...entity,

        patientName: `${row.patient_fname} ${row.patient_lname}`,
        gender: row.patient_gender,

        clinicName: row.clinic_name,
        doctorName: `${row.doctor_fname} ${row.doctor_lname}`,

        priorityLevel: row.priority_level,
        priorityRank: row.priority_rank,
      };
    });
  }

  _toEntity(row) {
    if (!row) return null;

    return new Appointment.Builder()
      .setAppointmentId(row.appointment_id)
      .setPatientId(row.patient_id)
      .setDoctorId(row.doctor_id)
      .setClinicId(row.clinic_id)
      .setAppointmentDate(row.appointment_date)
      .setAppointmentType(row.appointment_type)
      .setPriorityId(row.priority_id)
      .setStatus(row.status)
      .setCreatedAt(row.created_at)
      .build();
  }
}
