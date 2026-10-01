import {
  readFile,
  writeFile,
  mkdir,
  readdir,
  copyFile
} from "node:fs/promises";

import path from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";
import { minify } from "html-minifier-terser";

const raiz = path.dirname(fileURLToPath(import.meta.url));
const destino = path.join(raiz, "dist");
const resultados = [];

async function processar(arquivoRelativo) {
  const origem = path.join(raiz, arquivoRelativo);
  const saida = path.join(destino, arquivoRelativo);
  const extensao = path.extname(origem).toLowerCase();

  await mkdir(path.dirname(saida), { recursive: true });

  // Copia imagens e outros recursos sem alterar seu conteúdo.
  if (![".html", ".css", ".js"].includes(extensao)) {
    await copyFile(origem, saida);
    return;
  }

  const original = await readFile(origem, "utf8");
  let otimizado;

  if (extensao === ".html") {
    otimizado = await minify(original, {
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
    });
  } else {
    const resultado = await transform(original, {
      loader: extensao === ".css" ? "css" : "js",
      minify: true,
      sourcemap: false,
      legalComments: "inline"
    });

    otimizado = resultado.code;
  }

  await writeFile(saida, otimizado, "utf8");

  const antes = Buffer.byteLength(original, "utf8");
  const depois = Buffer.byteLength(otimizado, "utf8");

  resultados.push({
    arquivo: arquivoRelativo,
    original: antes,
    minificado: depois,
    reducao:
      antes === 0
        ? "0.00%"
        : `${((1 - depois / antes) * 100).toFixed(2)}%`
  });
}

async function percorrer(pastaRelativa) {
  const itens = await readdir(path.join(raiz, pastaRelativa), {
    withFileTypes: true
  });

  for (const item of itens) {
    const relativo = path.join(pastaRelativa, item.name);

    if (item.isDirectory()) {
      await percorrer(relativo);
    } else if (item.isFile()) {
      await processar(relativo);
    }
  }
}

await mkdir(destino, { recursive: true });

await processar("index.html");

for (const pasta of ["html", "css", "js", "imagens"]) {
  await percorrer(pasta);
}

const originalTotal = resultados.reduce(
  (soma, item) => soma + item.original,
  0
);

const minificadoTotal = resultados.reduce(
  (soma, item) => soma + item.minificado,
  0
);

const reducaoTotal =
  originalTotal === 0
    ? 0
    : (1 - minificadoTotal / originalTotal) * 100;

const relatorio = {
  unidade: "bytes",
  arquivos: resultados,
  originalTotal,
  minificadoTotal,
  reducaoPercentual: Number(reducaoTotal.toFixed(2))
};

await writeFile(
  path.join(raiz, "relatorio-minificacao.json"),
  JSON.stringify(relatorio, null, 2),
  "utf8"
);

console.table(resultados);
console.log(`Total original: ${originalTotal} bytes`);
console.log(`Total minificado: ${minificadoTotal} bytes`);
console.log(`Redução total: ${reducaoTotal.toFixed(2)}%`);
console.log("Build criada na pasta dist.");