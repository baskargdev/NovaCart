import ContactMessage from "../models/contactMessageModel.js";

// Create Contact Message
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully!",
      contactMessage,
    });
  } catch (error) {
    console.error("Create Contact Message Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message.",
    });
  }
};

// Get All Contact Messages
export const getContactMessages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    // Total messages
    const totalMessages = await ContactMessage.countDocuments();

    // Total pages
    const totalPages = Math.ceil(totalMessages / limitNumber);

    // Get messages for current page
    const messages = await ContactMessage.find()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limitNumber);

    return res.status(200).json({
      success: true,
      messages,
      page: pageNumber,
      limit: limitNumber,
      totalMessages,
      totalPages,
    });
  } catch (error) {
    console.error("Get Contact Messages Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact messages.",
    });
  }
};

// Mark Message as Read
export const markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status: "read" },
      { new: true },
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message marked as read.",
      contactMessage: message,
    });
  } catch (error) {
    console.error("Mark Message Read Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update message.",
    });
  }
};

// Delete Contact Message
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Contact Message Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete message.",
    });
  }
};