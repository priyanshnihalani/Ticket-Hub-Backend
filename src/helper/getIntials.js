const getInitials = (name = "") => {
    return name
        .trim()
        .split(" ")
        .filter(Boolean)
        .map(word => word[0].toUpperCase())
        .slice(0, 2)
        .join("");
};

module.exports = getInitials
