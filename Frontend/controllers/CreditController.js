import Transaction from "../models/Transaction.js";
import Stripe from "stripe";
import "dotenv/config";

export const plans = [
  {
    _id: "Basic",
    name: "Basic",
    price: 10,
    credits: 100,
    duration: "Monthly",
    features: [
      "500 chat generations per month",
      "Access to advanced GPT model",
      "Full conversation history",
      "Priority response speed",
      "Email support",
    ],
  },
  {
    _id: "Pro",
    name: "Pro",
    price: 30,
    credits: 500,
    duration: "Monthly",
    features: [
      "500 chat generations per month",
      "Access to GPT-5 model",
      "Unlimited chat history",
      "Faster response time",
      "Priority customer support",
    ],
  },
  {
    _id: "Premium",
    name: "Premium",
    price: 50,
    credits: 1000,
    duration: "Monthly",
    features: [
      "1000 chat generations per month",
      "Custom AI model tuning",
      "Team collaboration features",
      "Dedicated support manager",
      "API access for integrations",
    ],
  },
];

// API to get all plans
export const getPlans = async (req, res) => {
  try {
    res.status(200).json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); //Initialize Stripe with your secret key

//API to purchase a plan
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;
    const plan = plans.find((e) => e._id === planId);

    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    //Create the new transaction record
    const newTransaction = await Transaction.create({
      userId: userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false,
    });

    // create a Stripe payment intent

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: plan.price * 100,
            product_data: {
              name: plan.name,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        transactionId: newTransaction._id.toString(),
        appId: "sigma_gpt",
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes from now
      payment_method_types: ["card"],
      mode: "payment",
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
