import { eq, ilike, or, count, desc, sql, and, lt, inArray } from 'drizzle-orm';
import { dbSqlite as db } from '../client.js';
import { articoli, type Articolo, type InsertArticoloInput, type UpdateArticoloInput, type SearchArticoliInput, type BulkEditArticoliInput } from '../schema/articolo.js';
import { fornitori } from '../schema/fornitore.js';
import { NotFoundError, DatabaseError } from '../../utils/errors.js';
import type { PaginatedResponse } from '../../utils/validate.js';

/**
 * Repository per gestione CRUD Articoli
 * Include join con fornitori e filtri avanzati
 */

export type ArticoloConFornitore = Omit<Articolo, 'quantita_attuale' | 'soglia_minima'> & {
  /** @deprecated Gestione giacenze disabilitata */
  quantita_attuale?: number;
  /** @deprecated Gestione giacenze disabilitata */
  soglia_minima?: number;
  fornitore: {
    id: string;
    nome: string;
  };
};

export class ArticoliRepository {
  
  async getAll(filters: SearchArticoliInput): Promise<PaginatedResponse<ArticoloConFornitore>> {
    try {
      const { search, categoria, fornitore_id, solo_scarsita, page, pageSize } = filters;
      const offset = (page - 1) * pageSize;

      // Costruzione condizioni WHERE
      const conditions = [];
      
      if (search) {
        conditions.push(
          or(
            ilike(articoli.nome, `%${search}%`),
            ilike(articoli.categoria, `%${search}%`),
            ilike(fornitori.nome, `%${search}%`)
          )
        );
      }
      
      if (categoria) {
        conditions.push(eq(articoli.categoria, categoria));
      }
      
      if (fornitore_id) {
        conditions.push(eq(articoli.fornitore_id, fornitore_id));
      }
      
      // Filtro scarsità disabilitato - gestione giacenze rimossa
      if (solo_scarsita) {
        // Ignora filtro scarsità - funzionalità disabilitata
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Query dati con join fornitore
      const data = await db
        .select({
          id: articoli.id,
          nome: articoli.nome,
          categoria: articoli.categoria,
          unita: articoli.unita,
          confezione: articoli.confezione,
          // quantita_attuale e soglia_minima rimossi - gestione disabilitata
          prezzo_acquisto: articoli.prezzo_acquisto,
          prezzo_vendita: articoli.prezzo_vendita,
          fornitore_id: articoli.fornitore_id,
          note: articoli.note,
          created_at: articoli.created_at,
          updated_at: articoli.updated_at,
          fornitore: {
            id: fornitori.id,
            nome: fornitori.nome
          }
        })
        .from(articoli)
        .innerJoin(fornitori, eq(articoli.fornitore_id, fornitori.id))
        .where(whereClause)
        .orderBy(desc(articoli.created_at))
        .limit(pageSize)
        .offset(offset);

      // Query conteggio totale
      const [{ total }] = await db
        .select({ total: count() })
        .from(articoli)
        .innerJoin(fornitori, eq(articoli.fornitore_id, fornitori.id))
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
      throw new DatabaseError('Errore recupero articoli', error as Error);
    }
  }

  async getById(id: string): Promise<ArticoloConFornitore> {
    try {
      const [articolo] = await db
        .select({
          id: articoli.id,
          nome: articoli.nome,
          categoria: articoli.categoria,
          unita: articoli.unita,
          confezione: articoli.confezione,
          quantita_attuale: articoli.quantita_attuale,
          soglia_minima: articoli.soglia_minima,
          prezzo_acquisto: articoli.prezzo_acquisto,
          prezzo_vendita: articoli.prezzo_vendita,
          fornitore_id: articoli.fornitore_id,
          note: articoli.note,
          created_at: articoli.created_at,
          updated_at: articoli.updated_at,
          fornitore: {
            id: fornitori.id,
            nome: fornitori.nome
          }
        })
        .from(articoli)
        .innerJoin(fornitori, eq(articoli.fornitore_id, fornitori.id))
        .where(eq(articoli.id, id))
        .limit(1);

      if (!articolo) {
        throw new NotFoundError('Articolo', id);
      }

      return articolo;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore recupero articolo', error as Error);
    }
  }
  async create(data: InsertArticoloInput): Promise<Articolo> {
    try {
      // Conversione tipi per Drizzle - giacenze ignorate
      const { quantita_attuale, soglia_minima, ...cleanData } = data;
      const dbData = {
        ...cleanData,
        // Valori default per compatibilità DB (non esposti in API)
        quantita_attuale: 0,
        soglia_minima: 0
      };

      const [newArticolo] = await db
        .insert(articoli)
        .values(dbData)
        .returning();

      return newArticolo;
    } catch (error) {
      throw new DatabaseError('Errore creazione articolo', error as Error);
    }
  }

  async update(id: string, data: UpdateArticoloInput): Promise<Articolo> {
    try {
      // Conversione tipi per Drizzle - giacenze ignorate
      const { quantita_attuale, soglia_minima, ...cleanData } = data;
      const dbData: any = { ...cleanData, updated_at: new Date() };
      
      // Log warning se arrivano campi giacenze (per debug)
      if (quantita_attuale !== undefined || soglia_minima !== undefined) {
        console.warn('Campi giacenze ignorati in update articolo:', { quantita_attuale, soglia_minima });
      }

      const [updatedArticolo] = await db
        .update(articoli)
        .set(dbData)
        .where(eq(articoli.id, id))
        .returning();

      if (!updatedArticolo) {
        throw new NotFoundError('Articolo', id);
      }

      return updatedArticolo;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore aggiornamento articolo', error as Error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Verifica esistenza prima di eliminare
      await this.getById(id);
      
      await db
        .delete(articoli)
        .where(eq(articoli.id, id));
        
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore eliminazione articolo', error as Error);
    }
  }

  async bulkEdit(data: BulkEditArticoliInput): Promise<{ updated: number }> {
    try {
      const { ids, patch } = data;
      
      // Verifica che gli articoli esistano
      const existingArticoli = await db
        .select({ id: articoli.id })
        .from(articoli)
        .where(inArray(articoli.id, ids));
      
      if (existingArticoli.length !== ids.length) {
        throw new NotFoundError('Alcuni articoli non trovati');
      }

      // Prepara i dati per l'update (solo campi presenti)
      const updateData: any = {};
      if (patch.categoria !== undefined) updateData.categoria = patch.categoria;
      if (patch.prezzo_acquisto !== undefined) updateData.prezzo_acquisto = patch.prezzo_acquisto;
      if (patch.prezzo_vendita !== undefined) updateData.prezzo_vendita = patch.prezzo_vendita;
      updateData.updated_at = sql`(unixepoch())`;

      // Esegui bulk update
      await db
        .update(articoli)
        .set(updateData)
        .where(inArray(articoli.id, ids));

      return { updated: ids.length };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore bulk edit articoli', error as Error);
    }
  }
}

export const articoliRepo = new ArticoliRepository();
