const ContactMessage = require("../../Modles/ContactMessage/script");

const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name?.trim() || !emailPattern.test(email || "") || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, valid email, subject and message are required",
      });
    }

    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Your question has been sent successfully",
      data: { id: contactMessage._id },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to send your question",
      error: error.message,
    });
  }
};

module.exports = { submitContactMessage };