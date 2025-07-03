const CustomError = require("../model/CustomError");
const {sql} = require("../db");
const {v4: uuidv4} = require("uuid");
const {removeImages} = require("../others/util");

exports.save = async ({payload, files, currentUser}) => {
    const newClub = {
        ...payload,
        name: payload.name,
        location: payload.location === '' ? null : payload.location,
        createdBy: currentUser.id,
    }
    //if updating club make sure user is authorized
    if (newClub.id && currentUser.role != "sudo") {
        if (currentUser.clubId != newClub.id)
            throw new CustomError("Access denied", 401);
    }

    if (files && files.length > 0) {
        newClub.logo = files[0].filename;
    }
    //remove logo
    if (payload.rmImage) {
        await removeImages([payload.rmImage]);
        delete newClub.rmImage;

        if (!newClub.logo) newClub.logo = null;
    }
    const [insertedClub] = await sql`
        insert into club ${sql(newClub)} on conflict (id)
        do
        update set ${sql(newClub)} returning *`;

    return insertedClub;
};

exports.getAllClubs = async () => {
    return sql`
        select *
        from club
        order by id desc `;
};

exports.getClub = async ({clubId}) => {
    return sql`
        select *
        from club
        where id = ${clubId}
        order by id desc `;
};

exports.removeClub = async ({clubId}) => {
    const [deletedClub] = await sql`
        delete
        from club
        where id = ${clubId} returning *;`;

    if (deletedClub.logo) {
        await removeImages([deletedClub.logo]);
    }
    return deletedClub;
};
