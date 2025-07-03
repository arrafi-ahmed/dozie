const jwt = require("jsonwebtoken");
const {v4: uuidv4} = require("uuid");
const {hash, compare, compareSync} = require("bcrypt");
const CustomError = require("../model/CustomError");
const {sql} = require("../db");
const {ifAdmin} = require("../others/util");

const generateAuthData = async (result) => {
    let token = "";
    let currentUser = {};
    console.log(2, result)
    if (result) {
        currentUser = {
            id: result.id,
            role: Number(result.role),
            fullName: result.fullName,
        };

        if (ifAdmin(currentUser.role)) {
            const [club] = await sql`
                select *
                from club
                where id = ${result.clubId}`;

            currentUser.clubId = club.id || null;
            currentUser.clubName = club.name || null;
        }
        token = jwt.sign({currentUser}, process.env.TOKEN_SECRET);
    }
    console.log(3, currentUser)
    return {token, currentUser};
};

// role 10 = admin, 20 = customer
exports.save = async (payload) => {
    const user = {
        ...payload,
    };
    if (!user.id) {
        user.password = await hash(payload.password, 10);
        user.role = payload.role || 20
        user.createdAt = new Date()
    }

    let savedUser = null;
    try {
        [savedUser] = await sql`
            insert into app_user ${sql(user)} on conflict(id) do
            update set ${sql(user)} returning *`;
    } catch (err) {
        if (err.code === "23505")
            throw new CustomError("Email already taken!", 409);
        else throw err;
    }
    return savedUser;
};

exports.signin = async ({email, password}) => {
    const user = await exports.getUserByEmail({email});
    if (!user?.email) {
        throw new CustomError("User not found!", 401);
    }
    const isPasswordValid = await compare(password, user.password); // Compare hashed password

    if (!isPasswordValid) {
        throw new CustomError("Incorrect email/password!", 401);
    }
    return generateAuthData(user);
};

exports.getUserByEmail = async ({email}) => {
    const [user] = await sql`
        select *
        from app_user
        where email = ${email}`;
    return user;
};
