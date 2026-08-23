import { Offer } from "../models/Offer.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/apiResponse.js";

const publicOfferFields =
  "name slug shortDescription fullDescription price currency offerType deliveryMethod features outcomes idealClient ctaText ctaType ctaUrl checkoutEnabled bookingEnabled applicationRequired externalBookingUrl featured displayOrder relatedEmailSequenceKey";

export const listPublicOffers = asyncHandler(async (req, res) => {
  const query = { active: true };
  if (req.query.type) query.offerType = req.query.type;

  const offers = await Offer.find(query)
    .sort({ displayOrder: 1, createdAt: -1 })
    .select(publicOfferFields)
    .lean();

  ok(res, "Offers loaded.", { offers });
});

export const getPublicOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findOne({ slug: req.params.slug, active: true })
    .select(publicOfferFields)
    .lean();

  if (!offer) {
    return res.status(404).json({
      success: false,
      message: "Offer not found.",
      errors: []
    });
  }

  ok(res, "Offer loaded.", { offer });
});
