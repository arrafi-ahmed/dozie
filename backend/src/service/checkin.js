const {sql} = require("../db");
const CustomError = require("../model/CustomError");

exports.save = async ({newCheckin}) => {
    newCheckin = {
        ...newCheckin,
        checkinTime: new Date(),
    };
    if (!newCheckin.id) delete newCheckin.id;

    const [savedCheckin] = await sql`
        insert into checkin ${sql(newCheckin)} on conflict (id)
        do
        update set ${sql(newCheckin)}
            returning *;`;

    return savedCheckin;
};

exports.validateQrCode = async ({id, qrUuid, eventId}) => {
    const [registration] = await sql`
        select *, r.id as r_id, c.id as c_id
        from registration r
                 left join checkin c on r.id = c.registration_id
        where r.id = ${id}
          and r.event_id = ${eventId}
          and r.status = true`;

    if (!registration || registration.qrUuid != qrUuid) {
        throw new CustomError("Invalid QR Code", 401, registration);
    } else if (registration.status === true) {
        throw new CustomError("Already checked-in", 401, registration);
    }
    return registration;
};

exports.scanByRegistrationId = async ({qrCodeData, eventId, userId}) => {
    const {id, qrUuid} = JSON.parse(qrCodeData);
    const registration = await exports.validateQrCode({id, qrUuid, eventId});

    const newCheckin = {
        status: true,
        registrationId: id,
        checkedinBy: userId,
        checkinTime: new Date().toISOString(),
    };
    if (registration.cId) {
        newCheckin.id = registration.cId;
    }
    const updatedCheckin = await exports.save({newCheckin});

    return {...registration, status: updatedCheckin.status, checkinTime: updatedCheckin.checkinTime};
};

exports.getStatistics = async ({eventId, date}) => {
    const [counts] = await sql`
        SELECT COUNT(DISTINCT CASE
                                  WHEN r.registration_time:: date = ${date}::date
                                      THEN r.id END)                                                                            AS historical_registration_count,
               COUNT(DISTINCT CASE
                                  WHEN r.registration_time:: date = ${date}::date AND c.status = true
                                      THEN c.id END) AS historical_checkin_count,
               COUNT(DISTINCT r.id)                                                                                             AS total_registration_count,
               COUNT(DISTINCT CASE
                                  WHEN c.status = true
                                      THEN c.id END)                                                                            AS total_checkin_count
        FROM registration r
                 LEFT JOIN checkin c ON r.id = c.registration_id
        WHERE r.event_id = ${eventId};

    `;

    return counts;
};
