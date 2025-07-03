const {sql} = require("../db");
const CustomError = require("../model/CustomError");

exports.save = async ({payload: {formQuestions, rmQIds, eventId}}) => {
    // Delete old questions
    if (rmQIds?.length > 0)
        await sql`
            delete
            from form_question
            where id in ${sql(rmQIds)}`;

    let insertedQuestions = [];
    if (formQuestions.length > 0) {
        const formattedQuestions = formQuestions.map((item) => {
            if (!item.options) delete item.options;
            if (!item.id) delete item.id;
            item.eventId = eventId;
            return item;
        });

        for (const item of formattedQuestions) {
            insertedQuestions = await sql`
                insert into form_question ${sql(item)}
                on conflict (id)
                do update set ${sql(item)}
                returning *`;
        }
    }
    return insertedQuestions;
};

exports.getFormQuestions = async (eventId) => {
    return await sql`
        select *
        from form_question
        where event_id = ${eventId}`;
};
