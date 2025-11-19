import React, { useEffect, useState } from "react";
import "./Credits.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/credit/plans`, {
          withCredentials: true,
        });

        setPlans(res.data.plans);
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    };

    fetchPlans();
  }, []);

  const handleBuyNow = async (planId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/credit/purchase`,
        { planId },
        { withCredentials: true }
      );
      if (res.data.success) {
        window.location.href = res.data.url;
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Error purchasing plan:", err);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Credit Plans</h1>

      <div className="plansGrid">
        {plans.map((plan, index) => (
          <div key={index} className={`card`}>
            <div className="cardHeader">
              <h2 className="planName">{plan.name}</h2>

              <div className="priceContainer">
                <span className="price">${plan.price}</span>
                <span className="credits"> / {plan.duration}</span>
              </div>
            </div>

            <ul className="featureList">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="featureItem">
                  {feature}
                </li>
              ))}
            </ul>

            <button className="button" onClick={() => handleBuyNow(plan._id)}>
              Buy Now
            </button>
          </div>
        ))}
      </div>
      <ToastContainer theme="dark" />
    </div>
  );
};

export default Credits;
