#!/usr/bin/env bun
/**
 * CLI de validação do conhecimento (RF-101, RF-110, RF-112).
 *
 * Sem argumento, valida a pasta conhecimento/ inteira, só as pastas da lista
 * branca de PASTAS_VALIDAS. Com argumentos, valida os arquivos indicados, o que
 * é como as fixtures inválidas são exercitadas sem entrar na varredura normal.
 *
 * Exit code 0 quando tudo passa, 1 quando alguma coisa reprova.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parse as parseYaml } from 'yaml'
import {
  type Problema,
  tipoPeloCaminho,
  validarArquivo,
  validarCamposRelacionados,
  validarNotasContraPlaybooks,
  validarPasta,
} from '@valuation/conhecimento'

/**
 * Carrega os playbooks do repositório para a checagem cruzada de RF-109.
 *
 * No modo arquivo, sem isto, uma nota que amplia a lista de modelos passaria com
 * "nenhum problema encontrado", porque a comparação precisa da lista do playbook.
 * Verde sem substrato é o que a D-052 manda não aceitar.
 */
function carregarPlaybooks(): { caminho: string; documento: unknown }[] {
  const pasta = resolve('conhecimento', 'playbooks')
  let nomes: string[]
  try {
    nomes = readdirSync(pasta)
  } catch {
    return []
  }
  const carregados: { caminho: string; documento: unknown }[] = []
  for (const nome of nomes.filter((n) => n.endsWith('.yaml') || n.endsWith('.yml'))) {
    const caminho = join(pasta, nome)
    try {
      carregados.push({ caminho, documento: parseYaml(readFileSync(caminho, 'utf8')) })
    } catch {
      // arquivo ilegível é reportado pela validação normal da pasta
    }
  }
  return carregados
}

function imprimirProblemas(problemas: Problema[]): void {
  for (const problema of problemas) {
    console.error(`  ${problema.arquivo}`)
    console.error(`    campo: ${problema.campo}`)
    console.error(`    ${problema.mensagem}`)
  }
}

function main(argumentos: string[]): number {
  if (argumentos.length > 0) {
    const problemas: Problema[] = []
    for (const alvo of argumentos) {
      const caminho = resolve(alvo)
      const tipo = tipoPeloCaminho(caminho)
      if (tipo === undefined) {
        problemas.push({
          arquivo: caminho,
          campo: '(pasta)',
          mensagem:
            'RF-101: tipo do item vem do nome da pasta. ' +
            'Use playbooks, heuristicas, notas ou eventos',
        })
        continue
      }
      problemas.push(...validarArquivo(caminho, tipo))
      if (tipo === 'notas' || tipo === 'heuristicas' || tipo === 'eventos') {
        try {
          const item = [{ caminho, documento: parseYaml(readFileSync(caminho, 'utf8')) }]
          const playbooks = carregarPlaybooks()
          if (tipo === 'notas') {
            problemas.push(...validarNotasContraPlaybooks(item, playbooks))
          } else {
            problemas.push(...validarCamposRelacionados(item, playbooks))
          }
        } catch {
          // leitura ou parse já reportados por validarArquivo
        }
      }
    }
    console.log(`arquivos verificados: ${argumentos.length}`)
    if (problemas.length === 0) {
      console.log('nenhum problema encontrado')
      return 0
    }
    console.error(`problemas encontrados: ${problemas.length}`)
    imprimirProblemas(problemas)
    return 1
  }

  const raiz = resolve('conhecimento')
  const { arquivosLidos, problemas } = validarPasta(raiz)
  console.log(`pasta: ${raiz}`)
  console.log(`arquivos verificados: ${arquivosLidos.length}`)
  for (const arquivo of arquivosLidos) console.log(`  lido: ${arquivo}`)

  if (problemas.length === 0) {
    console.log('nenhum problema encontrado')
    return 0
  }
  console.error(`problemas encontrados: ${problemas.length}`)
  imprimirProblemas(problemas)
  return 1
}

process.exit(main(process.argv.slice(2)))
