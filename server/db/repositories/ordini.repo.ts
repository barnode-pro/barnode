import { eq, and, count, desc, gte, lte } from 'drizzle-orm';
import { db } from '../client.js';
import { ordini, type Ordine, type InsertOrdineInput, type UpdateOrdineInput, type SearchOrdiniInput } from '../schema/ordine.js';
import { righeOrdine, type RigaOrdine, type InsertRigaOrdineInput } from '../schema/rigaOrdine.js';
import { fornitori } from '../schema/fornitore.js';
import { articoli } from '../schema/articolo.js';
import { NotFoundError, DatabaseError } from '../../utils/errors.js';
import type { PaginatedResponse } from '../../utils/validate.js';

/**
 * Repository per gestione CRUD Ordini
 * Include gestione righe ordine e join con fornitori
 */

export type OrdineCompleto = Ordine & {
  fornitore: {
    id: string;
    nome: string;
    whatsapp: string | null;
  };
  righe: (RigaOrdine & {
    articolo: {
      id: string;
      nome: string;
      unita: string | null;
      confezione: string | null;
    };
  })[];
};

export class OrdiniRepository {
  
  async getAll(filters: SearchOrdiniInput): Promise<PaginatedResponse<OrdineCompleto>> {
    try {
      const { stato, fornitore_id, data_da, data_a, page, pageSize } = filters;
      const offset = (page - 1) * pageSize;

      // Costruzione condizioni WHERE
      const conditions = [];
      
      if (stato) {
        conditions.push(eq(ordini.stato, stato));
      }
      
      if (fornitore_id) {
        conditions.push(eq(ordini.fornitore_id, fornitore_id));
      }
      
      if (data_da) {
        conditions.push(gte(ordini.data, data_da.toISOString().split('T')[0]));
      }
      
      if (data_a) {
        conditions.push(lte(ordini.data, data_a.toISOString().split('T')[0]));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Query ordini base
      const ordiniBase = await db
        .select({
          id: ordini.id,
          fornitore_id: ordini.fornitore_id,
          data: ordini.data,
          stato: ordini.stato,
          note: ordini.note,
          created_at: ordini.created_at,
          updated_at: ordini.updated_at,
          fornitore: {
            id: fornitori.id,
            nome: fornitori.nome,
            whatsapp: fornitori.whatsapp
          }
        })
        .from(ordini)
        .innerJoin(fornitori, eq(ordini.fornitore_id, fornitori.id))
        .where(whereClause)
        .orderBy(desc(ordini.created_at))
        .limit(pageSize)
        .offset(offset);

      // Carica righe per ogni ordine
      const data: OrdineCompleto[] = [];
      for (const ordine of ordiniBase) {
        const righe = await this.getRigheByOrdineId(ordine.id);
        data.push({ ...ordine, righe });
      }

      // Query conteggio totale
      const [{ total }] = await db
        .select({ total: count() })
        .from(ordini)
        .innerJoin(fornitori, eq(ordini.fornitore_id, fornitori.id))
        .where(whereClause);

      return {
        data,
        pagination: {
          page,
          pageSize,
          total: Number(total),
          totalPages: Math.ceil(Number(total) / pageSize)
        }
      };
    } catch (error) {
      throw new DatabaseError('Errore recupero ordini', error as Error);
    }
  }

  async getById(id: string): Promise<OrdineCompleto> {
    try {
      const [ordine] = await db
        .select({
          id: ordini.id,
          fornitore_id: ordini.fornitore_id,
          data: ordini.data,
          stato: ordini.stato,
          note: ordini.note,
          created_at: ordini.created_at,
          updated_at: ordini.updated_at,
          fornitore: {
            id: fornitori.id,
            nome: fornitori.nome,
            whatsapp: fornitori.whatsapp
          }
        })
        .from(ordini)
        .innerJoin(fornitori, eq(ordini.fornitore_id, fornitori.id))
        .where(eq(ordini.id, id))
        .limit(1);

      if (!ordine) {
        throw new NotFoundError('Ordine', id);
      }

      const righe = await this.getRigheByOrdineId(id);
      return { ...ordine, righe };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore recupero ordine', error as Error);
    }
  }

  async create(data: InsertOrdineInput, righe?: InsertRigaOrdineInput[]): Promise<OrdineCompleto> {
    try {
      // Conversione tipi per Drizzle
      const dbData = {
        ...data,
        data: data.data ? data.data.toISOString().split('T')[0] : undefined
      };

      const [newOrdine] = await db
        .insert(ordini)
        .values(dbData)
        .returning();

      // Aggiungi righe se fornite
      if (righe && righe.length > 0) {
        const righeConOrdineId = righe.map(riga => ({
          ...riga,
          ordine_id: newOrdine.id,
          qta_ordinata: riga.qta_ordinata.toString(),
          qta_ricevuta: riga.qta_ricevuta?.toString() || '0'
        }));
        
        await db.insert(righeOrdine).values(righeConOrdineId);
      }

      return this.getById(newOrdine.id);
    } catch (error) {
      throw new DatabaseError('Errore creazione ordine', error as Error);
    }
  }

  async update(id: string, data: UpdateOrdineInput): Promise<OrdineCompleto> {
    try {
      // Conversione tipi per Drizzle
      const dbData: any = { ...data, updated_at: new Date() };
      if (data.data) {
        dbData.data = data.data.toISOString().split('T')[0];
      }

      const [updatedOrdine] = await db
        .update(ordini)
        .set(dbData)
        .where(eq(ordini.id, id))
        .returning();

      if (!updatedOrdine) {
        throw new NotFoundError('Ordine', id);
      }

      return this.getById(id);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore aggiornamento ordine', error as Error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Verifica esistenza prima di eliminare
      await this.getById(id);
      
      await db
        .delete(ordini)
        .where(eq(ordini.id, id));
        
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore eliminazione ordine', error as Error);
    }
  }

  private async getRigheByOrdineId(ordineId: string) {
    return await db
      .select({
        id: righeOrdine.id,
        ordine_id: righeOrdine.ordine_id,
        articolo_id: righeOrdine.articolo_id,
        qta_ordinata: righeOrdine.qta_ordinata,
        qta_ricevuta: righeOrdine.qta_ricevuta,
        note: righeOrdine.note,
        created_at: righeOrdine.created_at,
        updated_at: righeOrdine.updated_at,
        articolo: {
          id: articoli.id,
          nome: articoli.nome,
          unita: articoli.unita,
          confezione: articoli.confezione
        }
      })
      .from(righeOrdine)
      .innerJoin(articoli, eq(righeOrdine.articolo_id, articoli.id))
      .where(eq(righeOrdine.ordine_id, ordineId));
  }
}

export const ordiniRepo = new OrdiniRepository();
