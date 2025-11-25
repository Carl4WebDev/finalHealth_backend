import IQueueRepository from "../domain/repositories/IQueueRepository.js";
import QueueEntry from "../domain/entities/QueueEntry.js";
import db from "../../../core/database/db.js";

export default class QueueRepository extends IQueueRepository {
  // Repository method for adding to the queue in the database
  async addToQueue(queueEntry) {
    const query = `
    INSERT INTO queue_entries 
    (patient_id, doctor_id, clinic_id, priority_id, arrival_time, status)
    VALUES ($1, $2, $3, $4, NOW(), $5)
    RETURNING *;
  `;

    const values = [
      queueEntry.patientId,
      queueEntry.doctorId,
      queueEntry.clinicId,
      queueEntry.priorityId,
      queueEntry.status,
    ];

    const result = await db.query(query, values);
    return this._toEntity(result.rows[0]);
  }
  // Method to check if the patient is already in the queue for the same doctor and clinic
  async findQueueByPatientAndDoctorAndClinic(patientId, doctorId, clinicId) {
    const query = `
      SELECT * FROM queue_entries
      WHERE patient_id = $1
        AND doctor_id = $2
        AND clinic_id = $3;
    `;
    const values = [patientId, doctorId, clinicId];

    const result = await db.query(query, values);
    return result.rows; // Returning the rows (if any) from the query
  }

  async listQueue(doctorId, clinicId) {
    const query = `
    SELECT 
      q.*,
      p.priority_level,
      p.priority_rank,
      u.f_name AS patient_fname,
      u.l_name AS patient_lname
    FROM queue_entries q
    JOIN priority_queue p ON p.priority_id = q.priority_id
    LEFT JOIN patients u ON u.patient_id = q.patient_id
    WHERE q.doctor_id = $1 
      AND q.clinic_id = $2
    ORDER BY p.priority_rank ASC, q.arrival_time ASC;
  `;

    const result = await db.query(query, [doctorId, clinicId]);

    return result.rows.map((row) => {
      const entity = this._toEntity(row);

      return {
        ...entity,
        patientName: `${row.patient_fname || ""} ${
          row.patient_lname || ""
        }`.trim(),
        priorityLevel: row.priority_level,
        priorityRank: row.priority_rank,
      };
    });
  }

  async updateStatus(queueEntryId, status) {
    const result = await db.query(
      `
      UPDATE queue_entries
      SET status=$1
      WHERE queue_entry_id=$2
      RETURNING *;
      `,
      [status, queueEntryId]
    );

    return this._toEntity(result.rows[0]);
  }

  _toEntity(row) {
    if (!row) return null;

    return new QueueEntry.Builder()
      .setQueueEntryId(row.queue_entry_id)
      .setPatientId(row.patient_id)
      .setDoctorId(row.doctor_id)
      .setClinicId(row.clinic_id)
      .setPriorityId(row.priority_id)
      .setArrivalTime(row.arrival_time)
      .setStatus(row.status)
      .build();
  }
}
