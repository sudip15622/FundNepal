
export const generateUniqueSlug = (title, id) => {
    const shortTitle = title
    .toLowerCase()
    .substring(0, 30) // Limit to first 30 characters
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .trim();

  const uniquePart = id.slice(-5); // Use the last 5 characters of the ObjectId for uniqueness

  return `${shortTitle}-${uniquePart}`;
};
