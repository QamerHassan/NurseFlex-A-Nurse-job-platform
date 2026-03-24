const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- STARTING DATABASE PURGE ---');
    try {
        // Models with Cascade delete on User will handle Profiles, Applications, SavedJobs, etc.
        // But some models might not have explicit cascade or are independent.
        
        console.log('Deleting Messages...');
        const messages = await prisma.message.deleteMany({});
        console.log(`Deleted ${messages.count} messages.`);

        console.log('Deleting Conversations...');
        const conversations = await prisma.conversation.deleteMany({});
        console.log(`Deleted ${conversations.count} conversations.`);

        console.log('Deleting Applications...');
        const applications = await prisma.application.deleteMany({});
        console.log(`Deleted ${applications.count} applications.`);

        console.log('Deleting Saved Jobs...');
        const savedJobs = await prisma.savedJob.deleteMany({});
        console.log(`Deleted ${savedJobs.count} saved jobs.`);

        console.log('Deleting Notifications...');
        const notifications = await prisma.notification.deleteMany({});
        console.log(`Deleted ${notifications.count} notifications.`);

        console.log('Deleting Reviews...');
        const reviews = await prisma.review.deleteMany({});
        console.log(`Deleted ${reviews.count} reviews.`);

        console.log('Deleting Issue Reports...');
        const issueReports = await prisma.issueReport.deleteMany({});
        console.log(`Deleted ${issueReports.count} issue reports.`);

        console.log('Deleting Business Subscriptions...');
        const subscriptions = await prisma.businessSubscription.deleteMany({});
        console.log(`Deleted ${subscriptions.count} business subscriptions.`);

        console.log('Deleting Subscription Tiers...');
        const tiers = await prisma.subscriptionTier.deleteMany({});
        console.log(`Deleted ${tiers.count} subscription tiers.`);

        console.log('Deleting Jobs...');
        const jobs = await prisma.job.deleteMany({});
        console.log(`Deleted ${jobs.count} jobs.`);

        console.log('Deleting Profiles...');
        const profiles = await prisma.profile.deleteMany({});
        console.log(`Deleted ${profiles.count} profiles.`);

        console.log('Deleting Accounts...');
        const accounts = await prisma.account.deleteMany({});
        console.log(`Deleted ${accounts.count} accounts.`);

        console.log('Deleting Sessions...');
        const sessions = await prisma.session.deleteMany({});
        console.log(`Deleted ${sessions.count} sessions.`);

        console.log('Deleting Users...');
        const users = await prisma.user.deleteMany({});
        console.log(`Deleted ${users.count} users.`);

        console.log('Deleting Service Requests...');
        const serviceRequests = await prisma.serviceRequest.deleteMany({});
        console.log(`Deleted ${serviceRequests.count} service requests.`);

        console.log('Deleting Verification Tokens...');
        const tokens = await prisma.verificationToken.deleteMany({});
        console.log(`Deleted ${tokens.count} verification tokens.`);

        console.log('Deleting Blogs...');
        const blogs = await prisma.blog.deleteMany({});
        console.log(`Deleted ${blogs.count} blogs.`);

        console.log('--- DATABASE PURGE COMPLETED SUCCESSFULLY ---');
    } catch (error) {
        console.error("--- ERROR DURING DATABASE PURGE ---");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
