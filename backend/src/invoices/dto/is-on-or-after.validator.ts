import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsOnOrAfter(property: string, options?: ValidationOptions) {
  return (object: object, propertyName: string) =>
    registerDecorator({
      name: 'isOnOrAfter',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const other = (args.object as Record<string, string>)[args.constraints[0]];
          if (!value || !other) return false;
          return new Date(value) >= new Date(other);
        },
      },
    });
}
