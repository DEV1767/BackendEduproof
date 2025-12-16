export const generateId = async (Model, prefix, idField) => {
    const year = new Date().getFullYear();

    const lastRecord = await Model.findOne({})
        .sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastRecord && lastRecord[idField]) {
        const lastNumber = parseInt(
            lastRecord[idField].split("-")[2]
        );
        nextNumber = lastNumber + 1;
    }

    return `${prefix}-${year}-${String(nextNumber).padStart(4, "0")}`;
};
