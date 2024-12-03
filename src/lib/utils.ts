import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type FormDataObject = {
  [key: string]: any; // Allow flexible structure for nested or dynamic keys
};

export function teamFormDataToObject(formData: FormData): FormDataObject {
  const obj: FormDataObject = {};

  for (const [key, value] of formData.entries()) {
      const match = key.match(/(\w+)\[(\d+)]\[(\w+)]/);

      if (match) {
          // If the key matches the array pattern (e.g., "members[0][id]")
          const [, arrayKey, indexStr, prop] = match;
          const index = parseInt(indexStr, 10);

          // Ensure the array exists in the object
          if (!obj[arrayKey]) {
              obj[arrayKey] = [];
          }

          // Ensure the index exists in the array
          if (!obj[arrayKey][index]) {
              obj[arrayKey][index] = {};
          }

          // Assign the property value
          obj[arrayKey][index][prop] = value;
      } else {
          // If it's a normal key, just assign it directly
          obj[key] = value;
      }
  }

  return obj;
}


