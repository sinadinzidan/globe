import { DefaultNamingStrategy, type NamingStrategyInterface } from 'typeorm';

const WORD_BOUNDARY = /([a-z0-9])([A-Z])/g;
const SEPARATED_WORDS = '$1_$2';

export const toSnakeCase = (name: string) =>
  name.replace(WORD_BOUNDARY, SEPARATED_WORDS).toLowerCase();

/**
 * Maps camelCase names in code to snake_case names in the database, so no entity has to
 * spell out a column name. Explicit names given on an entity are kept as they are.
 */
export class SnakeCaseNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  override tableName(targetName: string, userSpecifiedName: string | undefined) {
    return userSpecifiedName ?? toSnakeCase(targetName);
  }

  override columnName(
    propertyName: string,
    customName: string | undefined,
    embeddedPrefixes: string[],
  ) {
    return toSnakeCase([...embeddedPrefixes, customName ?? propertyName].join('_'));
  }

  override relationName(propertyName: string) {
    return toSnakeCase(propertyName);
  }

  override joinColumnName(relationName: string, referencedColumnName: string) {
    return toSnakeCase(`${relationName}_${referencedColumnName}`);
  }

  override joinTableName(firstTableName: string, secondTableName: string) {
    return toSnakeCase(`${firstTableName}_${secondTableName}`);
  }

  override joinTableColumnName(tableName: string, propertyName: string, columnName?: string) {
    return toSnakeCase(`${tableName}_${columnName ?? propertyName}`);
  }
}
