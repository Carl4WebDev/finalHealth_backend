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

  async getQueueOfDoctorInClinic(doctorId, clinicId) {
    const query = `
    SELECT 
      q.queue_entry_id,
      q.patient_id,
      q.doctor_id,
      q.clinic_id,
      q.priority_id,
      q.status,

      TO_CHAR(q.arrival_time, 'YYYY-MM-DD') AS arrival_date,
      TO_CHAR(q.arrival_time, 'HH12:MI AM') AS arrival_time,

      p.priority_level,
      p.priority_rank,

      pt.f_name AS patient_fname,
      pt.l_name AS patient_lname,

      CASE q.status
        WHEN 'in-progress' THEN 1
        WHEN 'Waiting' THEN 2
        WHEN 'Completed' THEN 3
        ELSE 4
      END AS status_order

    FROM queue_entries q
    JOIN priority_queue p ON p.priority_id = q.priority_id
    LEFT JOIN patients pt ON pt.patient_id = q.patient_id

    WHERE q.doctor_id = $1
      AND q.clinic_id = $2
      AND q.arrival_time::date = CURRENT_DATE

    ORDER BY 
      p.priority_rank ASC,
      status_order ASC,
      q.arrival_time ASC;
  `;

    const { rows } = await db.query(query, [doctorId, clinicId]);

    const normalQueue = [];
    const priorityQueue = [];

    let normalInProgressUsed = false;
    let priorityInProgressUsed = false;

    for (const row of rows) {
      let status = row.status;

      // 🔒 Enforce single in-progress per queue
      if (row.priority_level === "Normal") {
        if (status === "in-progress") {
          if (normalInProgressUsed) status = "Waiting";
          else normalInProgressUsed = true;
        }
      } else {
        if (status === "in-progress") {
          if (priorityInProgressUsed) status = "Waiting";
          else priorityInProgressUsed = true;
        }
      }

      const entry = {
        queueEntryId: row.queue_entry_id,
        patientId: row.patient_id,
        doctorId: row.doctor_id,
        clinicId: row.clinic_id,
        priorityId: row.priority_id,
        status,

        arrivalDate: row.arrival_date,
        arrivalTime: row.arrival_time,

        patientName: `${row.patient_fname ?? ""} ${
          row.patient_lname ?? ""
        }`.trim(),
        priorityLevel: row.priority_level,
        priorityRank: row.priority_rank,
      };

      if (row.priority_level === "Normal") {
        normalQueue.push(entry);
      } else {
        priorityQueue.push(entry);
      }
    }

    return { normalQueue, priorityQueue };
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

    return this._toEntity(result.rows[0]); // Return the updated entry as an entity
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
