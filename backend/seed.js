const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });
    console.log('Connected to MongoDB');

    // Get the most recent user or the directtest2 user
    let user = await User.findOne({ email: 'directtest2@example.com' });
    if (!user) {
      user = await User.findOne().sort({ createdAt: -1 });
    }
    if (!user) {
      console.log('No user found. Please sign up first.');
      process.exit(1);
    }

    console.log(`Seeding data for user: ${user.name} (${user.email})`);

    // Create sample projects
    const project1 = await Project.create({
      title: 'Website Redesign',
      description: 'Complete redesign of company website with modern UI',
      owner: user._id,
      members: [user._id]
    });

    const project2 = await Project.create({
      title: 'Mobile App MVP',
      description: 'Build MVP for mobile application',
      owner: user._id,
      members: [user._id]
    });

    console.log(`Created projects: ${project1.title}, ${project2.title}`);

    // Create sample tasks
    const now = new Date();
    const tasks = await Task.insertMany([
      {
        title: 'Design homepage mockups',
        description: 'Create initial designs for the homepage',
        status: 'In Progress',
        assignee: user._id,
        project: project1._id,
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        title: 'Setup database schema',
        description: 'Design and setup MongoDB collections',
        status: 'Done',
        assignee: user._id,
        project: project2._id,
        dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        title: 'Create API documentation',
        description: 'Document all REST API endpoints',
        status: 'To Do',
        assignee: user._id,
        project: project1._id,
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      },
      {
        title: 'Implement authentication',
        description: 'Add JWT-based authentication system',
        status: 'In Progress',
        assignee: user._id,
        project: project2._id,
        dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
      },
      {
        title: 'User testing session',
        description: 'Conduct user testing with target audience',
        status: 'To Do',
        assignee: user._id,
        project: project1._id,
        dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) // yesterday - overdue
      }
    ]);

    console.log(`Created ${tasks.length} sample tasks`);
    console.log('\n✅ Sample data seeded successfully!');
    console.log('Now refresh your dashboard to see the tasks and stats.');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
})();
