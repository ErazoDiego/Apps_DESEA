import { Card } from '../types';

// Importar el JSON (requiere tsconfig.json con "resolveJsonModule": true, que Expo ya tiene)
const jsonData = require('./cards.json') as {
  version: string;
  total_cartas: number;
  fecha_actualizacion: string;
  categorias: Record<string, number>;
  cartas: Array<{
    id: number;
    categoria: string;
    nivel: string;
    tipo: string;
    acceso: string;
    texto: string;
    cronometro_segundos: number | null;
    frase_instruccion: string | null;
    ilustracion: string | null;
  }>;
};

// Función de mapeo para transformar el JSON al formato Card
function mapJsonToCard(jsonItem: typeof jsonData.cartas[0]): Card {
  // Normalizar nivel: "SUAVE"/"PICANTE"/"INTENSO" -> "suave"/"picante"/"fuego"
  let nivel: Card['nivel'];
  if (jsonItem.nivel === 'SUAVE') nivel = 'suave';
  else if (jsonItem.nivel === 'PICANTE') nivel = 'picante';
  else if (jsonItem.nivel === 'INTENSO') nivel = 'fuego';
  else nivel = jsonItem.nivel as Card['nivel'];

  // Normalizar tipo: "MIXTA" -> "mixta", "PARA_EL" -> "el", "PARA_ELLA" -> "ella"
  let dirigida_a: Card['dirigida_a'];
  if (jsonItem.tipo === 'MIXTA') dirigida_a = 'mixta';
  else if (jsonItem.tipo === 'PARA_EL') dirigida_a = 'el';
  else if (jsonItem.tipo === 'PARA_ELLA') dirigida_a = 'ella';
  else dirigida_a = jsonItem.tipo as Card['dirigida_a'];

  // Normalizar categoria: "VERDAD" -> "verdad", "RETO_CON_FRASE" -> "reto_con_frase", etc.
  let category: Card['category'];
  if (jsonItem.categoria === 'VERDAD') category = 'verdad';
  else if (jsonItem.categoria === 'RETO') category = 'reto';
  else if (jsonItem.categoria === 'DESEO') category = 'deseo';
  else if (jsonItem.categoria === 'RETO_CON_FRASE') category = 'reto_con_frase';
  else if (jsonItem.categoria === 'SIN_LIMITES') category = 'sin_limites';
  else if (jsonItem.categoria === 'CIERRE') category = 'cierre';
  else category = jsonItem.categoria.toLowerCase() as Card['category'];

  return {
    id: jsonItem.id.toString(),
    category: category,
    nivel: nivel,
    dirigida_a: dirigida_a,
    texto: jsonItem.texto,
    tiene_tiempo: jsonItem.cronometro_segundos !== null && jsonItem.cronometro_segundos > 0,
    tiempo_segundos: (jsonItem.cronometro_segundos !== null && jsonItem.cronometro_segundos > 0) ? jsonItem.cronometro_segundos : undefined,
    version_app: '1.0.0',
    acceso: jsonItem.acceso,
    cronometro_segundos: jsonItem.cronometro_segundos !== null ? jsonItem.cronometro_segundos : undefined,
    frase_instruccion: jsonItem.frase_instruccion,
    ilustracion: jsonItem.ilustracion,
  };
}

// Exportar las cartas mapeadas desde el array "cartas"
export const cards: Card[] = jsonData.cartas.map(mapJsonToCard);
