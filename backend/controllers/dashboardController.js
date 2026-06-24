import Project from '../models/Project.js';
import Contact from '../models/Contact.js';
import User from '../models/User.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalMessages = await Contact.countDocuments();
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        totalMessages,
        totalUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get dashboard recent activity
// @route   GET /api/dashboard/activity
// @access  Private/Admin
export const getActivity = async (req, res) => {
  try {
    // Get latest 5 messages
    const latestMessages = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt');

    // Get latest 5 projects
    const latestProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt');

    // Combine and format activity list
    const activity = [
      ...latestMessages.map(msg => ({
        _id: msg._id,
        type: 'message',
        title: 'New message received',
        name: msg.name,
        time: msg.createdAt
      })),
      ...latestProjects.map(proj => ({
        _id: proj._id,
        type: 'project',
        title: 'New project added',
        name: proj.title,
        time: proj.createdAt
      }))
    ];

    // Sort combined activity by time descending
    activity.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.status(200).json({
      success: true,
      data: activity.slice(0, 8) // Limit to top 8 recent actions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
