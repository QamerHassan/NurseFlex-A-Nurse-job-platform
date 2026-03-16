const { MongoClient, ObjectId } = require('mongodb');

const url = "mongodb+srv://NurseFlexdb:8ETj7-Zv@cluster0.wqgikom.mongodb.net/NurseFlex?retryWrites=true&w=majority";
const dbName = 'NurseFlex';

async function main() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const notificationsCol = db.collection('Notification');
        const blogsCol = db.collection('Blog');

        // Find the latest blog
        const latestBlog = await blogsCol.findOne({}, { sort: { createdAt: -1 } });
        if (!latestBlog) {
            console.log('No blogs found');
            return;
        }
        console.log('Latest Blog ID:', latestBlog._id);

        // Update latest notifications that don't have metadata
        const result = await notificationsCol.updateMany(
            { 
                type: 'BLOG_POST', 
                $or: [
                    { metadata: { $exists: false } },
                    { metadata: null },
                    { 'metadata.blogId': { $exists: false } }
                ]
            },
            { 
                $set: { 
                    metadata: { blogId: latestBlog._id.toString() } 
                } 
            }
        );

        console.log(`Updated ${result.modifiedCount} notifications with blogId: ${latestBlog._id}`);

    } finally {
        await client.close();
    }
}

main().catch(console.error);
