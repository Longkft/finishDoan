import { Types } from 'mongoose';

export const getFieldsOfObject = (obj, fields) => {
    if (!Array.isArray(fields) || fields.length == 0) return obj;
    const result = {};
    fields.forEach((field) => {
        if (field in obj) {
            result[field] = obj[field];
        }
    });
    return result;
};

export const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};

export const convert2ObjectId = (id) => {
    return new Types.ObjectId(id);
};
