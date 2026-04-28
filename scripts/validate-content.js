#!/usr/bin/env node
// Valida los JSON del CMS. Usar: node scripts/validate-content.js

const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const SCHEMAS = {
  'content/novedades.json': {
    array: 'items',
    fields: ['tipo', 'fecha', 'titulo', 'excerpt', 'autor_pie'],
    enums: { tipo: ['lanzamiento', 'evento', 'editorial'] },
  },
  'content/libros.json': {
    array: 'items',
    fields: ['titulo', 'autor', 'coleccion', 'anio'],
    enums: { coleccion: ['voces-del-monte', 'la-palabra-prestada', 'decir-primero'] },
  },
  'content/autores.json': {
    array: 'items',
    fields: ['nombre', 'iniciales', 'coleccion', 'bio'],
    enums: { coleccion: ['voces-del-monte', 'la-palabra-prestada', 'decir-primero'] },
  },
};

let errors = 0;

for (const [file, schema] of Object.entries(SCHEMAS)) {
  const fullPath = path.join(ROOT, file);
  let data;

  try {
    data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
    errors++;
    continue;
  }

  if (!Array.isArray(data[schema.array])) {
    console.error(`✗ ${file}: falta el array "${schema.array}"`);
    errors++;
    continue;
  }

  data[schema.array].forEach((item, i) => {
    for (const field of schema.fields) {
      if (item[field] === undefined || item[field] === '') {
        console.error(`✗ ${file}[${i}]: campo vacío o ausente → "${field}"`);
        errors++;
      }
    }
    if (schema.enums) {
      for (const [field, valid] of Object.entries(schema.enums)) {
        if (item[field] !== undefined && !valid.includes(item[field])) {
          console.error(`✗ ${file}[${i}]: valor inválido en "${field}": "${item[field]}" (válidos: ${valid.join(', ')})`);
          errors++;
        }
      }
    }
  });

  console.log(`✓ ${file}  (${data[schema.array].length} ítems)`);
}

if (errors > 0) {
  console.error(`\n${errors} error(s) encontrado(s).`);
  process.exit(1);
} else {
  console.log('\nTodo el contenido es válido.');
}
