import Stripe from "stripe";
import "dotenv/config";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

//API to handle Stripe webhooks
export const stripeWebhook = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the payment intent event
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];

        const { transactionId, appId } = session.metadata;

        if (appId === "sigma_gpt") {
          const transaction = await Transaction.findOne({
            _id: transactionId,
            isPaid: false,
          });

          // Update the credits in user's account
          await User.updateOne(
            {
              _id: transaction.userId,
            },
            {
              $inc: {
                credits: transaction.credits,
              },
            }
          );

          // Mark the transaction as paid
          transaction.isPaid = true;
          await transaction.save();
        } else {
          return res
            .status(400)
            .json({ reveiced: true, message: "Invalid App ID" });
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).json({ received: true });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Webhook processing error");
  }
};
