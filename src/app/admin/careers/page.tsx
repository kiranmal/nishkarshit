import AdminShell from "@/components/admin/AdminShell";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { COLLECTIONS, type JobPostingDoc } from "@/lib/models";
import { addJobPostingAction, updateJobPostingAction, deleteJobPostingAction } from "@/app/admin/careers/actions";

export const dynamic = "force-dynamic";

async function getJobs(): Promise<JobPostingDoc[]> {
  if (!isDbConfigured()) return [];
  const db = await getDb();
  return db.collection<JobPostingDoc>(COLLECTIONS.jobPostings).find().sort({ postedAt: -1 }).toArray();
}

export default async function AdminCareersPage() {
  const jobs = await getJobs();

  return (
    <AdminShell active="/admin/careers">
      <h1
        className="text-2xl font-bold text-brand-navy mb-1"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        Careers
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Job postings shown on <code>/careers</code>. Applications land in{" "}
        <a href="/admin/enquiries?tab=jobs" className="text-blue-600 hover:underline">
          Enquiries → Job Applications
        </a>
        .
      </p>

      <details className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <summary className="cursor-pointer font-semibold text-brand-navy">
          + Add Job Posting
        </summary>
        <form action={addJobPostingAction} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" required placeholder="Job title" className="input" />
          <input name="location" required placeholder="Location" className="input" />
          <input name="type" placeholder="Type (Full-time, Field, etc.)" className="input" />
          <select name="status" defaultValue="published" className="input">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <textarea name="description" required placeholder="Description" rows={3} className="input md:col-span-2" />
          <button className="md:col-span-2 justify-self-start rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">
            Add Job
          </button>
        </form>
      </details>

      <div className="space-y-3">
        {jobs.map((j) => (
          <details key={String(j._id)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <summary className="cursor-pointer flex items-center justify-between gap-3">
              <span className="font-semibold text-brand-navy">{j.title}</span>
              <span className="text-xs capitalize bg-gray-100 px-2 py-1 rounded-full">{j.status}</span>
            </summary>
            <form action={updateJobPostingAction.bind(null, String(j._id))} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="title" defaultValue={j.title} required className="input" />
              <input name="location" defaultValue={j.location} required className="input" />
              <input name="type" defaultValue={j.type} className="input" />
              <select name="status" defaultValue={j.status} className="input">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <textarea name="description" defaultValue={j.description} required rows={3} className="input md:col-span-2" />
              <div className="md:col-span-2 flex items-center gap-3">
                <button className="rounded-full bg-brand-navy text-white text-sm font-semibold px-6 py-2.5">Save</button>
                <button
                  type="submit"
                  formAction={deleteJobPostingAction.bind(null, String(j._id))}
                  className="text-red-600 text-xs font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            </form>
          </details>
        ))}
        {jobs.length === 0 && (
          <p className="text-center text-gray-400 py-8 bg-white rounded-2xl border border-gray-100">
            No job postings yet.
          </p>
        )}
      </div>
    </AdminShell>
  );
}
