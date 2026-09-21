import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import {
  MODELO_PROVIDER,
  type ModeloProvider,
} from '../ia/providers/modelo.provider';
import {
  CHAMADO_CATEGORIAS,
  isCategoriaPermitida,
  normalizarCategoria,
} from './chamado-categoria';

@Injectable()
export class ChamadosService {
  constructor(
    @Inject(MODELO_PROVIDER)
    private readonly modelo: ModeloProvider,
  ) {}

  async classificar(texto: string) {
    const textoNormalizado = texto.trim();

    const resultado = await this.modelo.gerar({
      mensagem:
        `Classifique o chamado em uma destas categorias: ${CHAMADO_CATEGORIAS.join(', ')}.\n` +
        `Responda somente com uma categoria.\n\n` +
        textoNormalizado,
    });

    const categoria = normalizarCategoria(resultado.resposta);

    if (!isCategoriaPermitida(categoria)) {
      throw new BadGatewayException('O modelo retornou uma categoria inválida');
    }

    return {
      texto: textoNormalizado,
      categoria,
      modelo: resultado.modelo,
    };
  }
}
