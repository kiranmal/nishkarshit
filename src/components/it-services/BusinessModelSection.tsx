"use client";

import {
  FaHandshake,
  FaUsers,
  FaCogs,
  FaClock,
  FaUserTie,
  FaRupeeSign,
} from "react-icons/fa";

const data = [
  {
    title: "Value Proposition",
    description:
      "Our value proposition centers on delivering custom software solutions tailored to meet unique business needs, from enterprise systems to mobile apps. We focus on scalability, ensuring our solutions grow with your business.",
    icon: <FaHandshake className="text-3xl text-blue-500" />,
  },
  {
    title: "Optimising Model",
    description:
      "Based on project requirement, we help you in optimising the best business model to meet your business-centric needs.",
    icon: <FaCogs className="text-3xl text-blue-500" />,
  },
  {
    title: "Hire Dedicated Dev",
    description:
      "With this model you get to choose the designer or developer from a pool of talented resources and make your own team that suits you best.",
    icon: <FaUserTie className="text-3xl text-blue-500" />,
  },
  {
    title: "Customer Relationships",
    description:
      "We build strong customer relationships through consultative selling, understanding each client’s unique needs and providing tailored solutions.",
    icon: <FaUsers className="text-3xl text-blue-500" />,
  },
  {
    title: "Time & Material",
    description:
      "Suitable for busy business owners, you will be able to hire dedicated resources on hourly/daily/weekly/monthly basis and leverage their technical expertise.",
    icon: <FaClock className="text-3xl text-blue-500" />,
  },
  {
    title: "Fixed Price",
    description:
      "This fixed price engagement model is suitable for small & medium business owners who have clearly defined the range, budget and deadlines for their project.",
    icon: <FaRupeeSign className="text-3xl text-blue-500" />,
  },
];

const BusinessModelSection = () => {
  return (
    <section className="py-20 text-orange-600 ">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-blue-700 mb-4">
          Business Model
        </h2>
        <p className="text-center text-lg text-gray-600 mb-12">
          Nishkarsh IT Solution – The next generation of technology
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6 text-center border border-blue-100"
            >
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessModelSection;
