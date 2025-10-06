import { eq, ilike, or, count, desc } from 'drizzle-orm';
import { dbSqlite as db } from '../client.js';
import { fornitori, type Fornitore, type InsertFornitoreInput, type UpdateFornitoreInput, type SearchFornitoriInput } from '../schema/fornitore.js';
import { NotFoundError, DatabaseError } from '../../utils/errors.js';
import type { PaginatedResponse } from '../../utils/validate.js';

/**
 * Repository per gestione CRUD Fornitori
 * Astrazione accesso dati con gestione errori
 */

export class FornitoriRepository {
  
  async getAll(filters: SearchFornitoriInput): Promise<PaginatedResponse<Fornitore>> {
    try {
      const { search, page, pageSize } = filters;
      const offset = (page - 1) * pageSize;

      // Costruzione query con filtri
      let whereClause;
      if (search) {
        whereClause = or(
          ilike(fornitori.nome, `%${search}%`),
          ilike(fornitori.whatsapp, `%${search}%`),
          ilike(fornitori.email, `%${search}%`)
        );
      }

      // Query dati paginati
      const data = await db
        .select()
        .from(fornitori)
        .where(whereClause)
        .orderBy(desc(fornitori.created_at))
        .limit(pageSize)
        .offset(offset);

      // Query conteggio totale
      const [{ total }] = await db
        .select({ total: count() })
        .from(fornitori)
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
      throw new DatabaseError('Errore recupero fornitori', error as Error);
    }
  }

  async getById(id: string): Promise<Fornitore> {
    try {
      const [fornitore] = await db
        .select()
        .from(fornitori)
        .where(eq(fornitori.id, id))
        .limit(1);

      if (!fornitore) {
        throw new NotFoundError('Fornitore', id);
      }

      return fornitore;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore recupero fornitore', error as Error);
    }
  }

  async create(data: InsertFornitoreInput): Promise<Fornitore> {
    try {
      const [newFornitore] = await db
        .insert(fornitori)
        .values(data)
        .returning();

      return newFornitore;
    } catch (error) {
      throw new DatabaseError('Errore creazione fornitore', error as Error);
    }
  }

  async update(id: string, data: UpdateFornitoreInput): Promise<Fornitore> {
    try {
      const [updatedFornitore] = await db
        .update(fornitori)
        .set({ ...data, updated_at: new Date() })
        .where(eq(fornitori.id, id))
        .returning();

      if (!updatedFornitore) {
        throw new NotFoundError('Fornitore', id);
      }

      return updatedFornitore;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore aggiornamento fornitore', error as Error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await db
        .delete(fornitori)
        .where(eq(fornitori.id, id));

      if (result.changes === 0) {
        throw new NotFoundError('Fornitore', id);
      }
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore eliminazione fornitore', error as Error);
    }
  }
}

export const fornitoriRepo = new FornitoriRepository();
