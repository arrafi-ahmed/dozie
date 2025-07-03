import ExtrasItem from "./ExtrasItem";

export default class Extras {
  constructor({
                name = null,
                description = null,
                price = null,
                content = [new ExtrasItem()],
                stripeProductId = null,
                stripePriceId = null,
                eventId = null,
              } = {}) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.content = content;
    this.stripeProductId = stripeProductId;
    this.stripePriceId = stripePriceId;
    this.eventId = eventId;
  }
}
