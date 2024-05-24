/* eslint-disable prettier/prettier */
import { readFileSync } from 'fs';
import { buildSchema } from 'graphql';

const schemaString = readFileSync('../graphql/schema.graphql', 'utf8');
const schema = buildSchema(schemaString);

export default schema;
