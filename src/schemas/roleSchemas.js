import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import {
  validateObjectId,
  formatOptions,
  checkPermission,
  validateCommaSeparatedValues,
  flattenObject,
} from '../utils/helperFunctions.js';
import { activeSchema, limitSchema, orderSchema, pageSchema } from './commonSchemas.js';
import { REGEX, PERMISSIONS } from '../constants/common.js';
import { ROLE_SORT_OPTIONS } from '../constants/sortOptions.js';

export const roleBodySchema = customJoi.object({
  title: Joi.string().trim().pattern(REGEX.NAME).max(50).required().messages({
    'any.required': 'Role title is required',
    'string.base': 'Role title must be a string',
    'string.empty': 'Role title cannot be empty',
    'string.pattern.base': 'Role title must contain only letters',
    'string.max': 'Role title cannot exceed 50 characters',
  }),

  permissions: Joi.array()
    .items(
      Joi.string()
        .trim()
        .lowercase()
        .custom(checkPermission)
        .messages({
          'string.base': 'Each permission must be a string',
          'string.empty': 'Permissions array cannot have empty values',
          'any.invalid': `One or more permissions are invalid. Valid permissions are: ${formatOptions(
            PERMISSIONS
          )}`,
        })
    )
    .min(1)
    .required()
    .custom(value => [...new Set(value)])
    .messages({
      'any.required': 'Permissions are required',
      'array.base': 'Permissions must be an array',
      'array.min': 'Role must have at least one permission',
      'array.sparse': 'Undefined values are not allowed in permissions array',
    })
    .options({ abortEarly: true }),
});

export const roleIdSchema = Joi.object({
  roleId: Joi.string().trim().empty(':roleId').required().custom(validateObjectId).messages({
    'any.required': 'Role ID is required',
    'string.empty': 'Role ID cannot be empty',
    'any.invalid': 'Role ID is invalid. Expected a valid ObjectId',
  }),
});

export const rolesQuerySchema = Joi.object({
  permissions: Joi.string()
    .empty('')
    .default([])
    .custom(validateCommaSeparatedValues(PERMISSIONS))
    .messages({
      'any.invalid': `One or more permissions are invalid. Valid permissions are: ${formatOptions(
        flattenObject(PERMISSIONS)
      )}`,
    }),

  active: activeSchema,

  sortBy: Joi.string()
    .trim()
    .lowercase()
    .valid(...Object.values(ROLE_SORT_OPTIONS))
    .allow('')
    .messages({
      'string.base': 'Sort option must be a string',
      'any.only': `Invalid value for sortBy. Valid options are: ${formatOptions(
        ROLE_SORT_OPTIONS
      )}`,
    }),

  order: orderSchema,
  page: pageSchema,
  limit: limitSchema,
});
