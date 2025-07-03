const CustomError = require("../model/CustomError");
const {sql} = require("../db");
const {v4: uuidv4} = require("uuid");
const exceljs = require("exceljs");
const {formatTime} = require("../others/util");
const emailContentService = require("../service/emailContent");
const sendMailService = require("../service/sendMail");
const formService = require("../service/form");
const eventService = require("../service/event");

exports.bulkImportAttendee = async ({excelFile, eventId, clubId}) => {
    const sheetPath = excelFile.path;
    const workbook = new exceljs.Workbook();
    await workbook.xlsx.readFile(sheetPath);
    const worksheet = workbook.worksheets[0];

    const headers = worksheet.getRow(1).values.slice(1); // ignore first undefined
    const rows = [];

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const values = row.values.slice(1); // 1-based index
        const rowObj = Object.fromEntries(
            headers.map((h, i) => [h, values[i] || ""]),
        );

        rows.push(rowObj);
    });

    const attendees = [];
    for (const row of rows) {
        const {
            first_name,
            last_name,
            email,
            phone,
            spouse,
            chapter,
            payment_amount,
            child_1,
            child_2,
            child_3,
            child_4,
            child_5,
            no_of_t_shirts_and_cap,
            registration_type,
            allergies,
            gala_night_table,
            hotel_reserved,
        } = row;

        const registrationData = {
            name: `${first_name} ${last_name}`,
            email,
            phone,
            others: {
                spouse,
                chapter,
                payment_amount,
                child_1,
                child_2,
                child_3,
                child_4,
                child_5,
                no_of_t_shirts_and_cap,
                registration_type,
                allergies,
                gala_night_table,
                hotel_reserved
            }
        }

        attendees.push({
            registrationData,
            registrationTime: Date.now(),
            status: true,
            qrUuid: uuidv4(),
            eventId,
            clubId,
        });
    }
    let savedAttendees = [];
    if (attendees.length) {
        savedAttendees = await sql`
            insert into registration ${sql(attendees)} returning *`;
    }
    return {insertCount: savedAttendees.length};
};

exports.defaultSave = async ({payload}) => {
    // if event is paid, set 'status = unpaid' by default, after stripe purchase set 'status = paid' thru webhook
    const event = await eventService.getEvent({eventId: payload.eventId});
    payload.status = event.ticketPrice <= 0;
    return exports.save({payload});
};

exports.save = async ({payload}) => {
    payload.registrationTime = new Date();
    payload.qrUuid = uuidv4();

    const [insertedRegistration] = await sql`
        INSERT INTO registration ${sql(payload)} returning *;
    `;

    return insertedRegistration;
};

exports.updateStatus = async ({payload: {id, uuid, status}}) => {
    const [registration] = await sql`
        update registration
        set status = ${status}
        where id = ${id}
          and qr_uuid = ${uuid} returning *`;
    ``;
    return registration;
};

exports.getRegistration = async ({registrationId, qrUuid, isLoggedIn}) => {
    const [registration] = await sql`
        select *
        from registration r
        where r.id = ${registrationId} ${
                !isLoggedIn
                        ? sql` and qr_uuid =
                        ${qrUuid}`
                        : sql``
        }`;
    return registration;
};

exports.getRegistrationWEventWExtrasPurchase = async ({registrationId}) => {
    const [registration] = await sql`
        SELECT *,
               r.id       AS r_id,
               e.id       AS e_id,
               e.start_date,
               e.end_date,
               e.location,
               ep.id      AS ep_id,
               r.qr_uuid  AS r_qr_uuid,
               ep.qr_uuid AS ep_qr_uuid
        FROM registration r
                 JOIN event e ON r.event_id = e.id
                 LEFT JOIN extras_purchase ep ON ep.registration_id = r.id
        WHERE r.id = ${registrationId};`;
    return registration;
};

exports.sendTicket = async ({registrationId}) => {
    const result = await exports.getRegistrationWEventWExtrasPurchase({
        registrationId,
    });

    const registration = {
        id: result.rId,
        registrationData: result.registrationData,
        registrationTime: result.registrationTime,
        qrUuid: result.rQrUuid,
    };
    const event = {
        id: result.eId,
        name: result.name,
        startDate: result.startDate,
        endDate: result.endDate,
        location: result.location,
    };
    const extrasPurchase = {
        id: result.epId,
        extrasData: result.extrasData,
        qrUuid: result.epQrUuid,
    };

    const {attachment, emailBody} =
        await emailContentService.generateTicketContent({
            registration,
            event,
            extrasPurchase,
        });

    sendMailService
        .sendMailWAttachment(
            result.registrationData.email,
            `Check-in QR Code for ${event.name}`,
            emailBody,
            attachment,
        )
        .catch((err) => {
            console.error(err.message);
            throw new CustomError("Email sending failed!");
        });
};
exports.getAttendees = async ({
                                  eventId,
                                  searchKeyword = "",
                                  sortBy = "registration",
                              }) => {
    const keyword = `%${searchKeyword}%`;

    //@formatter:off
  const attendees = await sql`
    SELECT jsonb_build_object(
             'id', r.id,
             'registrationData', r.registration_data,
             'registrationTime', r.registration_time,
             'status', r.status,
             'qrUuid', r.qr_uuid,
             'eventId', r.event_id,
             'clubId', r.club_id
           ) AS registration,
           COALESCE(jsonb_build_object(
             'id', c.id,
             'status', c.status,
             'checkinTime', c.checkin_time
           ), '{}'::jsonb) AS checkin,
           COALESCE(jsonb_build_object(
             'id', ep.id,
             'extrasData', ep.extras_data,
             'status', ep.status,
             'qrUuid', ep.qr_uuid,
             'scannedAt', ep.scanned_at
           ), '{}'::jsonb) AS extras
    FROM registration r
    LEFT JOIN checkin c ON r.id = c.registration_id
    LEFT JOIN extras_purchase ep ON r.id = ep.registration_id
    WHERE r.event_id = ${eventId}
      AND r.status = true
      AND (
        ${
          searchKeyword
            ? sql`
          r.registration_data ->> 'name' ILIKE ${keyword} OR
          r.registration_data ->> 'email' ILIKE ${keyword} OR
          r.registration_data ->> 'phone' ILIKE ${keyword}
        `
            : sql`true`
        }
      )
    ${
      sortBy === "registration"
        ? sql`ORDER BY r.registration_time DESC`
        : sortBy === "checkin"
          ? sql`ORDER BY c.checkin_time ASC`
          : sql``
    };
  `;
  //@formatter:on

    return attendees;
};

exports.removeRegistration = async ({eventId, registrationId}) => {
    const [deletedEvent] = await sql`
        delete
        from registration
        where id = ${registrationId}
          and event_id = ${eventId} returning *;`;

    return deletedEvent;
};
exports.validateExtrasQrCode = async ({id, qrUuid, eventId}) => {
    const [extrasPurchase] = await sql`
        select *, r.id as r_id, ep.id as id
        from registration r
                 left join extras_purchase ep on r.id = ep.registration_id
        where ep.id = ${id}
          and r.event_id = ${eventId}
          and r.status = true`;

    if (!extrasPurchase || extrasPurchase.qrUuid != qrUuid) {
        throw new CustomError("Invalid QR Code", 401, extrasPurchase);
    } else if (extrasPurchase.status === true) {
        throw new CustomError("Already Redeemed", 401, extrasPurchase);
    }
    return extrasPurchase;
};

exports.scanByExtrasPurchaseId = async ({qrCodeData, eventId}) => {
    const {id, qrUuid} = JSON.parse(qrCodeData);
    const extrasPurchase = await exports.validateExtrasQrCode({
        id,
        qrUuid,
        eventId,
    });
    const payload = {id: extrasPurchase.id, status: true};
    const updatedExtrasPurchase = await eventService.updateExtrasPurchaseStatus({
        payload,
    });
    return updatedExtrasPurchase;
};

exports.downloadAttendees = async ({eventId}) => {
    const attendees = await exports.getAttendees({eventId});
    const formQuestions = await formService.getFormQuestions(eventId);

    if (attendees.length === 0)
        throw new CustomError("No data available for report!", 404);

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Attendee Report");

    const sheet_columns = [
        {header: "Registration ID", key: "registration_id", width: 15},
        {header: "Name", key: "name", width: 25},
        {header: "Email", key: "email", width: 25},
        {header: "Phone", key: "phone", width: 20},
        {header: "Registration Time", key: "registration_time", width: 25},
        {header: "Checkin Time", key: "checkin_time", width: 25},
        {header: "Checkin Status", key: "checkin_status", width: 20},
        {header: "Voucher Status", key: "extras_status", width: 20},
    ];

    if (formQuestions.length > 0) {
        formQuestions.forEach((q) => {
            sheet_columns.push({
                header: q.text,
                key: `qId_${q.id}`,
                width: 30,
            });
        });
    }

    worksheet.columns = sheet_columns;

    attendees.forEach((item) => {
        const reg = item.registration || {};
        const checkin = item.checkin || {};
        const extras = item.extras || {};

        const rowData = {
            registration_id: reg.id,
            name: reg.registrationData?.name || "",
            email: reg.registrationData?.email || "",
            phone: reg.registrationData?.phone || "",
            registration_time: reg.registrationTime
                ? formatTime(reg.registrationTime)
                : "",
            checkin_time: checkin.checkinTime ? formatTime(checkin.checkinTime) : "",
            checkin_status: checkin.status ? "Checked-in" : "Pending",
            extras_status: extras.status ? "Redeemed" : "Not Redeemed",
        };

        // Handle dynamic form questions inside registrationData.others array
        const others = reg.registrationData?.others || [];
        others.forEach((answer) => {
            if (answer.qId) {
                rowData[`qId_${answer.qId}`] = answer.answer?.toString() || "";
            }
        });

        worksheet.addRow(rowData);
    });

    return workbook;
};
