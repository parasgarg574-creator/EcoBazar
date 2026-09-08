const Content = require("../../Modles/Content/script");

const ALLOWED_PAGES = ["terms-and-conditions", "privacy-policy"];

const isValidPage = (page) => ALLOWED_PAGES.includes(page);

// Admin: list both pages (whatever their status) so the CMS screen can show them
const getAllContent = async (req, res) => {
    try {
        const contents = await Content.find();
        return res.status(200).json({
            success: true,
            message: "Content fetched successfully",
            data: contents,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Admin: fetch one page (draft or published) so it can be loaded into the edit form
const getContentByPage = async (req, res) => {
    try {
        const { page } = req.params;
        if (!isValidPage(page)) {
            return res.status(400).json({
                success: false,
                message: `Invalid page. Allowed values: ${ALLOWED_PAGES.join(", ")}`,
            });
        }

        const content = await Content.findOne({ page });
        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found for this page",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Content fetched successfully",
            data: content,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Public: only ever return published content (used by the storefront)
const getPublishedContentByPage = async (req, res) => {
    try {
        const { page } = req.params;
        if (!isValidPage(page)) {
            return res.status(400).json({
                success: false,
                message: `Invalid page. Allowed values: ${ALLOWED_PAGES.join(", ")}`,
            });
        }

        const content = await Content.findOne({ page, status: "published" });
        if (!content) {
            return res.status(404).json({
                success: false,
                message: "This page has not been published yet",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Content fetched successfully",
            data: content,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Admin: edit a page's content. Upserts so the very first save creates the
// document - there are intentionally no separate create/delete endpoints,
// since only these two fixed pages should ever exist.
const updateContentByPage = async (req, res) => {
    try {
        const { page } = req.params;
        if (!isValidPage(page)) {
            return res.status(400).json({
                success: false,
                message: `Invalid page. Allowed values: ${ALLOWED_PAGES.join(", ")}`,
            });
        }

        const { title, content, status } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required",
            });
        }

        const updatedContent = await Content.findOneAndUpdate(
            { page },
            {
                page,
                title,
                content,
                status: status === "published" ? "published" : "draft",
            },
            { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Content updated successfully",
            data: updatedContent,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getAllContent,
    getContentByPage,
    getPublishedContentByPage,
    updateContentByPage,
};
