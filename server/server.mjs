import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import { OAuth2Client } from 'google-auth-library';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(express.json());

// log every request to the console
app.use((req, res, next) => {
  console.log('>', req.method, req.path);
  next();
});

// --- Change nothing above this line ---


// Connect to MongoDB
const client = new MongoClient('mongodb://localhost:27017');
const conn = await client.connect();
const db = conn.db('community');

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed!'), false);
    }
    cb(null, true);
  }
});


app.get('/api/events', async (req, res) => {
  const q = req.query.q;
  let filters = {};

  if (req.query.userId) {
    filters.userId = req.query.userId;
  }
  if (req.query.Free === "true" || req.query.free === "true") {
    filters.price = 0;
  }
  if (req.query["West Campus"] === "true") {
    filters.location = "West Campus";
  }
  if (req.query["North Campus"] === "true") {
    filters.location = "North Campus";
  }
  if (req.query.Collegetown === "true") {
    filters.location = "Collegetown";
  }
  if (q) {
    filters.$text = { $search: q };
  }

  const events = await db.collection('events')
    .find(filters)
    .toArray();
  res.status(200).json(events);
});

// to read by a specific ID I check if it is a valid ID
// then I assign it to a new ObjectID and search the collection for the ID
// if the ID is not valid or object doesnt exsist returns 404, if successful 200 and json
app.get('/api/events/:id', async (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const eventId = new ObjectId(req.params.id);
    const event = await db.collection('events').findOne({ _id: eventId });

    if (!event) {
      res.status(404).send()
    }

    res.status(200).json(event);
  } else {
    res.status(404).send()
  }
});

app.delete('/api/events/:id', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  let ticket;
  try {
    ticket = await oauthClient.verifyIdToken({
      idToken: token,
      audience: "625315434824-0ol6n2t84cuaf967etncrk90l2kbkjtm.apps.googleusercontent.com",
    });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const payload = ticket.getPayload();
  if (!payload.email.endsWith('@cornell.edu')) {
    return res.status(403).json({ error: "Cornell email required" });
  }

  if (ObjectId.isValid(req.params.id)) {
    const eventId = new ObjectId(req.params.id);
    const event = await db.collection('events').findOne({ _id: eventId });

    // Only allow delete if the user owns the event
    if (!event || event.userId !== payload.sub) {
      return res.status(403).json({ error: "Not authorized to delete this event" });
    }

    const result = await db.collection('events').deleteOne({ _id: eventId });
    if (result.deletedCount === 0) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  } else {
    res.status(404).send();
  }
});

const oauthClient = new OAuth2Client("625315434824-0ol6n2t84cuaf967etncrk90l2kbkjtm.apps.googleusercontent.com");

app.post('/api/events', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  let ticket;
  try {
    ticket = await oauthClient.verifyIdToken({
      idToken: token,
      audience: "625315434824-0ol6n2t84cuaf967etncrk90l2kbkjtm.apps.googleusercontent.com",
    });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const payload = ticket.getPayload();
  // payload.sub is the Google user ID
  // payload.email is the user's email

  // Only allow Cornell emails
  if (!payload.email.endsWith('@cornell.edu')) {
    return res.status(403).json({ error: "Cornell email required" });
  }

  // Now save the event with the verified userId
  const { description, price, location, tags, imageUrl } = req.body;
  const result = await db.collection('events').insertOne({
    description,
    price,
    location,
    tags,
    imageUrl,
    userId: payload.sub,
    userEmail: payload.email,
  });
  res.status(201).json(result);
});

// Replace an event document, the AI was pretty good here, just had to take out the if statement for the date object becasue it should always be an entire object and not be missing nay fields. checks if object is valid ID, I removed hte return statement here, then it deletes the old ID, replaces one docuemnt, and checks to see if it removed something and searches for the docuemnt to ensure with an extra check that the new object is present.
app.put('/api/events/:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(404).send();
  }
  const eventId = new ObjectId(req.params.id);
  const updatedEvent = req.body;

  delete updatedEvent._id;

  updatedEvent.date = new Date(updatedEvent.date);

  const result = await db.collection('events').replaceOne(
    { _id: eventId },
    updatedEvent
  );

  if (result.matchedCount === 0) {
    res.status(404).send();
  }

  const event = await db.collection('events').findOne({ _id: eventId });
  res.status(200).json(event);
});

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Image upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.patch('/api/events/:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).send();
  }
  const eventId = new ObjectId(req.params.id);
  const updates = req.body;

  if (updates.date) {
    updates.date = new Date(updates.date);
  }

  const result = await db.collection('events').updateOne(
    { _id: eventId },
    { $set: updates }
  );

  if (result.matchedCount === 0) {
    return res.status(404).send();
  }

  const event = await db.collection('events').findOne({ _id: eventId });
  res.status(200).json(event);
});

setInterval(async () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  fs.readdir(uploadsDir, async (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      return;
    }
    // Get all imageUrl values from the database
    const usedImages = new Set(
      (await db.collection('events').find({ imageUrl: { $exists: true, $ne: "" } }).project({ imageUrl: 1 }).toArray())
        .map(doc => doc.imageUrl && path.basename(doc.imageUrl))
    );
    // Delete files not referenced in the database
    for (const file of files) {
      if (!usedImages.has(file)) {
        fs.unlink(path.join(uploadsDir, file), (err) => {
          if (err) {
            console.error('Error deleting unused image:', file, err);
          } else {
            console.log('Deleted unused image:', file);
          }
        });
      }
    }
  });
}, 10 * 60 * 1000);


app.patch('/api/events/admin/:id/approve', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  let ticket;
  try {
    ticket = await oauthClient.verifyIdToken({
      idToken: token,
      audience: "625315434824-0ol6n2t84cuaf967etncrk90l2kbkjtm.apps.googleusercontent.com",
    });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const payload = ticket.getPayload();
  // Check if user is admin
  const adminUser = await db.collection('users').findOne({ email: payload.email, isAdmin: true });
  if (!adminUser) {
    return res.status(403).json({ error: "Admin access required" });
  }

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).send();
  }
  const eventId = new ObjectId(req.params.id);

  const result = await db.collection('events').updateOne(
    { _id: eventId },
    { $set: { status: "approved" } }
  );

  if (result.matchedCount === 0) {
    return res.status(404).send();
  }

  const event = await db.collection('events').findOne({ _id: eventId });
  res.status(200).json(event);
});


app.delete('/api/events/admin/:id', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  let ticket;
  try {
    ticket = await oauthClient.verifyIdToken({
      idToken: token,
      audience: "625315434824-0ol6n2t84cuaf967etncrk90l2kbkjtm.apps.googleusercontent.com",
    });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const payload = ticket.getPayload();
  // Check if user is admin
  const adminUser = await db.collection('users').findOne({ email: payload.email, isAdmin: true });
  if (!adminUser) {
    return res.status(403).json({ error: "Admin access required" });
  }

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).send();
  }
  const eventId = new ObjectId(req.params.id);

  const result = await db.collection('events').deleteOne({ _id: eventId });
  if (result.deletedCount === 0) {
    return res.status(404).send();
  }
  res.status(204).send();
});



// --- Change nothing below this line ---

// 404 - not found
app.use((req, res, next) => {
  res.status(404).json({ message: 'resource ' + req.url + ' not found' });
});

// 500 - Any server error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send()
});

// start server on port
const server = app.listen(port, () => {
  console.log(`app listening on http://localhost:${port}/`);
});
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`error: port ${port} is already in use!`, 'kill this server! (control + c)');
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});
