import sanitize from "sanitize-html";

const sanitizeInput = (data) => {
    return sanitize(data, { allowedTags: [], allowedAttributes: {} });
};

export default sanitizeInput;