import { eq, and } from 'drizzle-orm';
import { dbSqlite as db } from '../client.js';
import { righeOrdine, type RigaOrdine, type InsertRigaOrdineInput, type UpdateRigaOrdineInput, type UpdateQuantitaRicevutaInput } from '../schema/rigaOrdine.js';
import { articoli } from '../schema/articolo.js';
import { NotFoundError, DatabaseError } from '../../utils/errors.js';

/**
 * Repository per gestione CRUD Righe Ordine
 * Operazioni specifiche per dettaglio articoli ordinati
 */

export type RigaOrdineConArticolo = RigaOrdine & {
  articolo: {
    id: string;
    nome: string;
    unita: string | null;
    confezione: string | null;
  };
};

export class RigheOrdineRepository {
  
  async getByOrdineId(ordineId: string): Promise<RigaOrdineConArticolo[]> {
    try {
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
    } catch (error) {
      throw new DatabaseError('Errore recupero righe ordine', error as Error);
    }
  }

  async getById(id: string): Promise<RigaOrdineConArticolo> {
    try {
      const [riga] = await db
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
        .where(eq(righeOrdine.id, id))
        .limit(1);

      if (!riga) {
        throw new NotFoundError('Riga ordine', id);
      }

      return riga;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore recupero riga ordine', error as Error);
    }
  }
  async create(data: InsertRigaOrdineInput): Promise<RigaOrdine> {
    try {
      // Conversione tipi per Drizzle
      const dbData = {
        ...data,
        ordine_id: data.ordine_id,
        articolo_id: data.articolo_id,
        qta_ordinata: data.qta_ordinata,
        qta_ricevuta: data.qta_ricevuta || 0
      };

      const [newRiga] = await db
        .insert(righeOrdine)
        .values(dbData)
        .returning();

      return newRiga;
    } catch (error) {
      throw new DatabaseError('Errore creazione riga ordine', error as Error);
    }
  }

  async update(id: string, data: UpdateRigaOrdineInput): Promise<RigaOrdine> {
    try {
      // Conversione tipi per Drizzle
      const dbData: any = { ...data, updated_at: new Date() };
      if (data.qta_ordinata !== undefined) {
        dbData.qta_ordinata = data.qta_ordinata.toString();
      }
      if (data.qta_ricevuta !== undefined) {
        dbData.qta_ricevuta = data.qta_ricevuta.toString();
      }

      const [updatedRiga] = await db
        .update(righeOrdine)
        .set(dbData)
        .where(eq(righeOrdine.id, id))
        .returning();

      if (!updatedRiga) {
        throw new NotFoundError('Riga ordine', id);
      }

      return updatedRiga;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore aggiornamento riga ordine', error as Error);
    }
  }

  async updateQuantitaRicevuta(id: string, data: UpdateQuantitaRicevutaInput): Promise<RigaOrdine> {
    try {
      const [updatedRiga] = await db
        .update(righeOrdine)
        .set({ 
          qta_ricevuta: data.qta_ricevuta,
          note: data.note,
          updated_at: new Date() 
        })
        .where(eq(righeOrdine.id, id))
        .returning();

      if (!updatedRiga) {
        throw new NotFoundError('Riga ordine', id);
      }

      return updatedRiga;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore aggiornamento quantità ricevuta', error as Error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Verifica esistenza prima di eliminare
      await this.getById(id);
      
      await db
        .delete(righeOrdine)
        .where(eq(righeOrdine.id, id));
        
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore eliminazione riga ordine', error as Error);
    }
  }

  async removeByOrdineAndArticolo(ordineId: string, articoloId: string): Promise<void> {
    try {
      // Verifica esistenza tramite query
      const existing = await db
        .select()
        .from(righeOrdine)
        .where(and(
          eq(righeOrdine.ordine_id, ordineId),
          eq(righeOrdine.articolo_id, articoloId)
        ))
        .limit(1);
        
      if (existing.length === 0) {
        throw new NotFoundError('Riga ordine', `${ordineId}-${articoloId}`);
      }
      
      await db
        .delete(righeOrdine)
        .where(and(
          eq(righeOrdine.ordine_id, ordineId),
          eq(righeOrdine.articolo_id, articoloId)
        ));
        
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Errore eliminazione riga ordine', error as Error);
    }
  }
}

export const righeOrdineRepo = new RigheOrdineRepository();
