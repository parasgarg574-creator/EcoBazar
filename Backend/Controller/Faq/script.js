const Faq = require("../../Modles/Faq/script");

const createFaq = async (req, res) => {
    try {
        const { question, answer, status, order } = req.body;
        if (!question || !answer) {
            return res.status(400).json({
                success: false,
                message: "Question and answer are required",
            });
        }
        const faq = await Faq.create({ question, answer, status, order });
        return res.status(201).json({
            success: true,
            message: "FAQ created successfully",
            data: faq,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getFaqs = async (req, res) => {
    try {
        const faqs = await Faq.find().sort({ order: 1, createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "FAQs fetched successfully",
            data: faqs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getPublishedFaqs = async (req, res) => {
    try {
        const faqs = await Faq.find({ status: "published" }).sort({
            order: 1,
            createdAt: -1,
        });
        return res.status(200).json({
            success: true,
            message: "FAQs fetched successfully",
            data: faqs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getSingleFaq = async (req, res) => {
    try {
        const faq = await Faq.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "FAQ fetched successfully",
            data: faq,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateFaq = async (req, res) => {
    try {
        const { question, answer, status, order } = req.body;
        const faq = await Faq.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found",
            });
        }

        faq.question = question ?? faq.question;
        faq.answer = answer ?? faq.answer;
        faq.status = status ?? faq.status;
        faq.order = order ?? faq.order;

        await faq.save();

        return res.status(200).json({
            success: true,
            message: "FAQ updated successfully",
            data: faq,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteFaq = async (req, res) => {
    try {
        const faq = await Faq.findByIdAndDelete(req.params.id);
        if (!faq) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "FAQ deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createFaq,
    getFaqs,
    getPublishedFaqs,
    getSingleFaq,
    updateFaq,
    deleteFaq,
};
