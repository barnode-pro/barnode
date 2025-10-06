import { eq, ilike, or, count, desc, sql, and, lt } from 'drizzle-orm';
import { db } from '../client.js';
import { articoli, type Articolo, type InsertArticoloInput, type UpdateArticoloInput, type SearchArticoliInput } from '../schema/articolo.js';
import { fornitori } from '../schema/fornitore.js';
import { NotFoundError, DatabaseError } from '../../utils/errors.js';
import type { PaginatedResponse } from '../../utils/validate.js';

/**
 * Repository per gestione CRUD Articoli
 * Include join con fornitori e filtri avanzati
 */

export type ArticoloConFornitore = Articolo & {
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
      
      if (solo_scarsita) {
        conditions.push(lt(articoli.quantita_attuale, articoli.soglia_minima));
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
          quantita_attuale: articoli.quantita_attuale,
          soglia_minima: articoli.soglia_minima,
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
      const [newArticolo] = await db
        .insert(articoli)
        .values(data)
        .returning();

      return newArticolo;
    } catch (error) {
      throw new DatabaseError('Errore creazione articolo', error as Error);
    }
  }

  async update(id: string, data: UpdateArticoloInput): Promise<Articolo> {
    try {
      const [updatedArticolo] = await db
        .update(articoli)
        .set({ ...data, updated_at: new Date() })
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
      const result = await db
        .delete(articoli)
        .where(eq(articoli.id, id));

      if (result.rowCount === 0) {
        throw new NotFoundError('Articolo', id);
      }
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore eliminazione articolo', error as Error);
    }
  }
}

export const articoliRepo = new ArticoliRepository();
