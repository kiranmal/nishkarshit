"use client";

/** @param {{members?: any[], heading?: string, description?: string}} props */
export default function ManagementTeam({ members = /** @type {any[]} */ ([]), heading, description }) {
  const activeMembers = (members ?? [])
    .filter((member) => member && member.active);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8">
        {/* SECTION HEADING */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#062E49]"
            style={{
              fontFamily: "var(--font-poppins)",
            }}
          >
            {heading}
          </h2>
        </div>

        {/* TEAM MEMBERS */}
        {activeMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {activeMembers.map((member) => (
              <div
                key={member._id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* IMAGE */}
                <div className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name || "Team member"}
                      className="w-45 h-45 object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-45 h-45 object-cover border-black rounded-full group-hover:scale-105 transition-transform duration-500">
                      <span>No IMAGE</span>
                    </div>
                  )}
                </div>
                {/* MEMBER DETAILS */}
                <div className="p-5 text-center">
                  <h3
                    className="text-xl font-semibold text-[#062E49]"
                    style={{
                      fontFamily: "var(--font-poppins)",
                    }}
                  >
                    {member.name}
                  </h3>

                  {member.role && (
                    <p className="mt-1 text-sm font-medium text-[#1476A8]">
                      {member.role}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No team members available.</p>
          </div>
        )}
      </div>
    </section>
  );
}
