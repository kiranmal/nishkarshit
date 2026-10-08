export default function RefundPolicy() {
  return (
    <div className="w-full">
      {/* HERO */}
      <section className="bg-white ">
        <div className="overflow-hidden rounded-bl-[50px] rounded-br-[50px]">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
            alt="Privacy Policy"
            className="w-full h-[280px] md:h-[420px] object-cover"
          />
        </div>
      </section>

      {/* CONTENT CARD */}
      <section className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10 pb-20">
            <h1 className="text-3xl md:text-5xl font-extrabold text-center text-gray-800">
              Refund &amp; Shipping Policy
              <span className="block w-16 h-1 bg-blue-500 mt-4 mx-auto rounded-full"></span>
            </h1>
            <div
              className="mt-10 bg-white rounded-2xl shadow-2xl p-6 md:p-10 text-gray-800 leading-relaxed 
          prose prose-sm sm:prose lg:prose-lg max-w-none 
          prose-li:marker:text-blue-500 prose-li:marker:font-bold prose-ul:pl-6 
          prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 animate-fade-in space-y-6"
            >
              <p>
                Thank you for shopping at <strong>Nishkarshit</strong>.
              </p>
              <p>
                We offer refund and/or exchange within the first 30 days of your
                purchase. If 30 days have passed since your purchase, you will
                not be offered a refund or exchange of any kind.
              </p>

              <h2>Eligibility for Refunds and Exchanges</h2>
              <ul>
                <li>
                  Your item must be unused and in the same condition that you
                  received it.
                </li>
                <li>The item must be in the original packaging.</li>
                <li>
                  To complete your return, we require a receipt or proof of
                  purchase.
                </li>
                <li>
                  Only regular priced items may be refunded, sale items cannot
                  be refunded.
                </li>
                <li>
                  If the item in question was marked as a gift when purchased
                  and shipped directly to you, you will receive a gift credit
                  for the value of your return.
                </li>
              </ul>

              <h2>Exchanges (if applicable)</h2>
              <p>
                We only replace items if they are defective or damaged. If you
                need to exchange it for the same item, email us at{" "}
                <a href="mailto:hello@nishkarshit.com" className="text-blue-600">
                  hello@nishkarshit.com
                </a>{" "}
                and send your item to: Mahavir Colony, Varanasi, Uttar Pradesh
                221010, India.
              </p>

              <h2>Partial Refunds (if applicable)</h2>
              <ul>
                <li>
                  Any item not in its original condition, is damaged or missing
                  parts for reasons not due to our error.
                </li>
                <li>
                  Any item that is returned more than 30 days after delivery.
                </li>
              </ul>

              <p>
                Once your return is received and inspected, we will notify you
                of the approval or rejection of your refund. If approved, your
                refund will be processed and a credit will automatically be
                applied to your original method of payment.
              </p>

              <h2>Late or Missing Refunds</h2>
              <ul>
                <li>
                  If you have not received a refund yet, first check your bank
                  account again.
                </li>
                <li>
                  Then contact your credit card company — it may take some time
                  before your refund is officially posted.
                </li>
                <li>
                  If you’ve done all of this and still have not received your
                  refund, please contact us at hello@nishkarshit.com.
                </li>
              </ul>

              <h2>Shipping</h2>
              <ul>
                <li>Do not send the product back to the manufacturer.</li>
                <li>
                  Send it to: Mahavir Colony, Varanasi, Uttar Pradesh 221010,
                  India.
                </li>
                <li>
                  You will be responsible for paying for your own shipping costs
                  for returning your item.
                </li>
                <li>Shipping costs are non-refundable.</li>
                <li>
                  If you receive a refund, the cost of return shipping will be
                  deducted.
                </li>
                <li>
                  Depending on where you live, delivery times for exchanged
                  products may vary.
                </li>
                <li>
                  We cannot guarantee that we will receive your returned item.
                </li>
              </ul>
            </div>
            <div className="mt-12 text-center">
              <a
                className="inline-block text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                href="/"
                data-discover="true"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
