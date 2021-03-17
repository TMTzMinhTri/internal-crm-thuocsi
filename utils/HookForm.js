/* eslint-disable no-unused-vars */
import { SetValueConfig, UseFormMethods } from "react-hook-form";
/**
 * @param {object} valueObject New values object
 * @param {Array<string|object>} keys Key
 * @param {string} keys[].name
 * @param {Function} keys[].resolver
 * @param {UseFormMethods['setValue']} setter 
 * @param {SetValueConfig} config
 */
export const formSetter = (valueObject = {}, keys = [], setter, config = {}) => {
    keys.forEach(key => {
        if (typeof key === "string" && key) {
            setter(key, valueObject[key]);
        } else if (typeof key === "object" || key.name) {
            setter(key.name, key.resolver?.(valueObject[key.name]) ?? valueObject[key.name]);
        }
    });
}