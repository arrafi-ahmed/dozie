const CustomError = require("../model/CustomError");
const {sql} = require("../db");
const {v4: uuidv4} = require("uuid");

exports.save = async ({payload}) => {
    payload.role = payload.role.toLowerCase();
    payload.role =
        payload.role == "sudo"
            ? 1
            : payload.role == "admin"
                ? 2
                : payload.role == "attendee"
                    ? 3
                    : null;

    // if add request
    if (!payload.id) {
        delete payload.id;
        payload.password = exports.generatePassword();
    }

    let upsertedUser = null;
    try {
        [upsertedUser] = await sql`
            insert into app_user ${sql(payload)}
            on conflict (id)
            do update set ${sql(payload)}
            returning *`;
    } catch (err) {
        if (err.code === "23505")
            throw new CustomError("Username already taken!", 409);
        else throw err;
    }
    return upsertedUser;
};

exports.getAppUsers = async ({clubId}) => {
    const appUsers = await sql`select *, a.id as id
                               from app_user a
                                        join role r on a.role = r.id
                               where r.name in ('admin')
                                 and a.club_id = ${clubId}`;

    const admins = appUsers.filter((item) => item.name === "admin");
    return {admins};
};

exports.generatePassword = (length = 8) => {
    const charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,/()-*&^%$#@!";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};
