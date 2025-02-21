import mongoose from 'mongoose';
import {
  atLeastOnePermission,
  checkValidPermissions,
  formatOptions,
} from '../utils/helperFunctions.js';
import { PERMISSIONS, REGEX } from '../constants/common.js';

const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, 'Role title is required'],
      maxLength: [50, 'Role title cannot exceed 50 characters'],
      match: [REGEX.NAME, 'Role title must contain only letters'],
    },
    permissions: {
      type: [String],
      set: value => [...new Set(value)],
      validate: [
        {
          validator: atLeastOnePermission,
          message: 'Role must have at least one permission',
        },
        {
          validator: checkValidPermissions,
          message: `One or more permissions are invalid. Valid permissions are: ${formatOptions(
            PERMISSIONS
          )}`,
        },
      ],
    },
    userCount: {
      type: Number,
      default: 0,
      min: [0, 'User count for a role cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'User count must be an integer',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Role', roleSchema);
