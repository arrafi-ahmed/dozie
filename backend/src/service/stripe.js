const {VUE_BASE_URL, STRIPE_SECRET} = process.env;
const stripe = require("stripe")(STRIPE_SECRET);
const {sql} = require("../db");
const CustomError = require("../model/CustomError");
const registrationService = require("./registration");
const eventService = require("./event");

exports.createProduct = async ({payload}) => {
    const createdProduct = await stripe.products.create(payload);
    return createdProduct;
};

exports.updateProduct = async ({id, payload}) => {
    const updatedProduct = await stripe.products.update(id, payload);
    return updatedProduct;
};

exports.deleteProduct = async ({id}) => {
    const deletedProduct = await stripe.products.del(id);
    return deletedProduct;
};

exports.retrieveProduct = async ({id}) => {
    const retrievedProduct = await stripe.products.retrieve(id);
    return retrievedProduct;
};

exports.createPrice = async ({payload}) => {
    const createdPrice = await stripe.prices.create(payload);
    return createdPrice;
};

exports.updatePrice = async ({id, payload}) => {
    const updatedPrice = await stripe.prices.update(id, payload);
    return updatedPrice;
};

exports.saveEventStripe = async ({payload}) => {
    const [insertedEventStripe] = await sql`
        insert into event_stripe ${sql(payload)} on conflict (id)
        do
        update set ${sql(payload)} returning *`;
    return insertedEventStripe;
};

exports.deleteEventStripe = async ({id}) => {
    const [deletedEventStripe] = await sql`
        delete
        from event_stripe
        where id = ${id} returning *`;
    return deletedEventStripe;
};

exports.createProductPrice = async ({product, price}) => {
    //create stripe product
    const insertedProduct = await exports.createProduct({
        payload: product,
    });
    price.product = insertedProduct.id;
    //create stripe price
    const insertedPrice = await exports.createPrice({
        payload: price,
    });
    return {insertedProduct, insertedPrice};
};

exports.getEventStripe = async ({eventId}) => {
    const [eventStripe] = await sql`
        select *, es.id as es_id, e.id as e_id
        from event_stripe es
                 join event e on e.id = es.event_id
        where e.id = ${eventId}`;
    return eventStripe;
};

exports.createStripeCheckoutIfNeeded = async ({
                                                  payload: {savedRegistration, savedExtrasPurchase, extrasIds},
                                              }) => {
    const lineItems = [];
    const stripeProductEvent = await exports.getEventStripe({
        eventId: savedRegistration.eventId,
    });
    if (stripeProductEvent?.ticketPrice > 0) {
        lineItems.push({price: stripeProductEvent.priceId, quantity: 1});
    }
    const stripeProductEventExtras = await eventService.getExtrasByIds({
        extrasIds,
    });

    stripeProductEventExtras.forEach((item, index) => {
        if (item.price > 0) {
            lineItems.push({price: item.stripePriceId, quantity: 1});
        }
    });
    const checkoutPayload = {
        registration: savedRegistration,
        extrasPurchase: savedExtrasPurchase,
        lineItems,
    };
    if (lineItems.length < 1) return {clientSecret: "no-stripe"};
    return exports.createCheckout({
        payload: checkoutPayload,
    });
};

exports.createCheckout = async ({
                                    payload: {registration, extrasPurchase, lineItems},
                                }) => {
    const returnRoute = `${VUE_BASE_URL}/club/${registration.clubId}/event/${registration.eventId}/success`;
    const params = new URLSearchParams();
    params.append("registration_id", registration.id);
    params.append("uuid", registration.qrUuid);

    const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        line_items: lineItems,
        mode: "payment",
        return_url: `${returnRoute}?${params.toString()}`,
        metadata: {
            registrationId: registration.id,
            registrationUuid: registration.qrUuid,
            extrasPurchaseId: extrasPurchase?.id,
            eventId: registration.eventId,
        },
    });
    return {clientSecret: session.client_secret};
};

exports.sessionStatus = async ({sessionId}) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.status;
};

exports.getPrice = async ({planTitle}) => {
    const prices =
        planTitle === "premium"
            ? await stripe.prices.list({
                lookup_keys: ["premium"],
            })
            : null;
    return prices && prices.data && prices.data[0];
};

exports.webhook = async (req) => {
    let data;
    let eventType;
    const isDev = process.env.NODE_ENV !== "production";
    // Check if webhook signing is configured.
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!isDev && !webhookSecret) {
        throw new Error("Missing STRIPE_WEBHOOK_SECRET in production");
    }
    if (webhookSecret) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        let signature = req.headers["stripe-signature"];

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                webhookSecret,
            );
        } catch (err) {
            throw new CustomError(err.message, 400, err);
        }
        // Extract the object from the event.
        data = event.data;
        eventType = event.type;
    } else if (isDev) {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // retrieve the event data directly from the request body.
        data = req.body.data;
        eventType = req.body.type;
    } else {
        throw new Error(
            "Invalid webhook configuration. Check environment and STRIPE_WEBHOOK_SECRET.",
        );
    }

    let responseMsg = "";
    switch (eventType) {
        // subscription created successfully
        case "checkout.session.completed":
            const checkoutSessionCompleted = data.object;

            await registrationService.updateStatus({
                payload: {
                    id: checkoutSessionCompleted.metadata.registrationId,
                    uuid: checkoutSessionCompleted.metadata.registrationUuid,
                    status: true,
                },
            });
            if (checkoutSessionCompleted.metadata.extrasPurchaseId) {
                await eventService.updateExtrasPurchaseStatus({
                    payload: {
                        id: JSON.parse(checkoutSessionCompleted.metadata.extrasPurchaseId),
                        status: true,
                    },
                });
            }
            // increase registration_count in event
            await eventService.increaseRegistrationCount({
                eventId: checkoutSessionCompleted.metadata.eventId,
            });
            // send email
            await registrationService.sendTicket({
                registrationId: checkoutSessionCompleted.metadata.registrationId,
            });

            responseMsg = "Purchase successful!";
            break;

        // fired immediately when customer cancel subscription
        case "customer.subscription.updated":
            break;

        // fired at end of period when subscription expired
        case "customer.subscription.deleted":
            break;

        // subscription auto renewal succeeded
        case "invoice.paid":
            break;

        // subscription auto renewal failed
        case "invoice.payment_failed":
            break;

        // ... handle other event types
        default:
            console.error(`Unhandled event type ${eventType}`);
    }

    return responseMsg;
};
/*
stripe trigger checkout.session.completed
--override checkout_session:metadata.registrationId=70
--override checkout_session:metadata.uuid=f3b157dd-7eab-46e1-90d1-e676c65948bb
--override checkout_session:metadata.extrasPurchaseId=53
*/
