import CustomError from '../utils/CustomError.js';

const joiValidator = (schema, type) => (req, _res, next) => {
  const joiOptions = {
    abortEarly: false,
    stripUnknown: true,
  };

  const { error, value } = schema.validate(req[type] ?? {}, joiOptions);

  if (error) {
    const joiErrorMessage = error.details.map(errorDetail => errorDetail.message).join('. ');
    throw new CustomError(joiErrorMessage, 400);
  }

  req[type] = value;
  next();
};

export const validatePathParams = schema => joiValidator(schema, 'params');
export const validateQueryParams = schema => joiValidator(schema, 'query');
export const validatePayload = schema => joiValidator(schema, 'body');
