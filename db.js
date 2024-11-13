
const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb+srv://barnabasagbekorode:barney02@cluster0.numvz.mongodb.net/';  
const client = new MongoClient(uri);

async function connectDB() {
  await client.connect();
  console.log('Connected to MongoDB');
  return client.db('final_project').collection('reminders');
}

async function addReminder(reminder) {
  const reminders = await connectDB();
  const result = await reminders.insertOne(reminder);
  console.log('Reminder added with ID:', result.insertedId);
  return result.insertedId;
}

async function removeReminder(id) {
  const reminders = await connectDB();
  const result = await reminders.deleteOne({ _id: new ObjectId(id) });
  console.log('Reminder removed:', result.deletedCount > 0);
}

async function editReminder(id, updatedFields) {
  const reminders = await connectDB();
  const result = await reminders.updateOne({ _id: new ObjectId(id) }, { $set: updatedFields });
  console.log('Reminder updated:', result.modifiedCount > 0);
}

module.exports = { addReminder, removeReminder, editReminder };
