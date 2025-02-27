import cron from "node-cron";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

/**
 * Schedules a cron job to send job newsletter emails every minute.
 * The job finds new job postings and notifies users subscribed to relevant niches.
 */
export const newsLetterCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("🔄 Running Cron Automation...");

    try {
      // Fetch all jobs that haven't had newsletters sent
      const jobs = await Job.find({ newsLettersSent: false });

      for (const job of jobs) {
        // Find users whose niche matches the job's category
        const users = await User.find(
          {
            $or: [
              { "niches.firstNiche": job.jobNiche },
              { "niches.secondNiche": job.jobNiche },
              { "niches.thirdNiche": job.jobNiche },
            ],
          }
        ).select("email name");

        if (users.length === 0) continue; // Skip if no users match

        const subject = `🔥 Hot Job Alert: ${job.title} in ${job.jobNiche}`;
        const messageTemplate = `Hi {name},\n\nA new job matching your niche is available:\n- **Position:** ${job.title}\n- **Company:** ${job.companyName}\n- **Location:** ${job.location}\n- **Salary:** ${job.salary}\n\nApply now!\n\nBest,\nNicheNest Team`;

        // Send emails to all matched users concurrently
        await Promise.all(
          users.map(({ email, name }) =>
            sendEmail({
              email,
              subject,
              message: messageTemplate.replace("{name}", name),
            })
          )
        );

        // Mark the job as having sent newsletters
        job.newsLettersSent = true;
        await job.save();
      }
    } catch (error) {
      console.error("❌ Cron job error:", error.message);
    }
  });
};
