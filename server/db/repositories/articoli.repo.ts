import { eq, ilike, or, count, desc, gte, lte, and, inArray, sql } from 'drizzle-orm';
import { dbSqlite as db } from '../client.js';
import { articoli, type Articolo, type InsertArticoloInput, type UpdateArticoloInput, type SearchArticoliInput, type BulkEditArticoliInput } from '../schema/articolo.js';
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
  } | null;
};

export class ArticoliRepository {
  
  async getAll(filters: SearchArticoliInput): Promise<PaginatedResponse<ArticoloConFornitore>> {
    try {
      const { search, categoria, fornitore_id, page, pageSize } = filters;
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
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Query dati con join fornitore - Solo 3 campi essenziali
      const data = await db
        .select({
          id: articoli.id,
          nome: articoli.nome,
          categoria: articoli.categoria,
          fornitore_id: articoli.fornitore_id,
          created_at: articoli.created_at,
          updated_at: articoli.updated_at,
          fornitore: {
            id: fornitori.id,
            nome: fornitori.nome
          }
        })
        .from(articoli)
        .leftJoin(fornitori, eq(articoli.fornitore_id, fornitori.id))
        .where(whereClause)
        .orderBy(desc(articoli.created_at))
        .limit(pageSize)
        .offset(offset);

      // Query conteggio totale
      const [{ total }] = await db
        .select({ total: count() })
        .from(articoli)
        .leftJoin(fornitori, eq(articoli.fornitore_id, fornitori.id))
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
          fornitore_id: articoli.fornitore_id,
          created_at: articoli.created_at,
          updated_at: articoli.updated_at,
          fornitore: {
            id: fornitori.id,
            nome: fornitori.nome
          }
        })
        .from(articoli)
        .leftJoin(fornitori, eq(articoli.fornitore_id, fornitori.id))
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

  async findByFornitoreAndNome(fornitoreId: string, nome: string): Promise<Articolo | null> {
    try {
      const [articolo] = await db
        .select()
        .from(articoli)
        .where(
          and(
            eq(articoli.fornitore_id, fornitoreId),
            eq(articoli.nome, nome.trim())
          )
        )
        .limit(1);

      return articolo || null;
    } catch (error) {
      throw new DatabaseError('Errore ricerca articolo per fornitore e nome', error as Error);
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
      const dbData: any = { ...data, updated_at: new Date() };

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
      if (patch.fornitore_id !== undefined) updateData.fornitore_id = patch.fornitore_id;
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
