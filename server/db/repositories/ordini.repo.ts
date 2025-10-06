import { eq, and, count, desc, gte, lte, lt, sql } from 'drizzle-orm';
import { db } from '../client';
import { ordini, type Ordine, type InsertOrdineInput, type UpdateOrdineInput, type SearchOrdiniInput } from '../schema/ordine';
import { righeOrdine, type RigaOrdine, type InsertRigaOrdineInput } from '../schema/rigaOrdine';
import { fornitori } from '../schema/fornitore';
import { articoli } from '../schema/articolo';
import { NotFoundError, DatabaseError } from '../../utils/errors';
import type { PaginatedResponse } from '../../utils/validate';

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
      
      // TODO: Implementare filtri per data quando necessario
      // if (data_da) {
      //   conditions.push(gte(ordini.data, data_da));
      // }
      
      // if (data_a) {
      //   conditions.push(lte(ordini.data, data_a));
      // }

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
      const [newOrdine] = await db
        .insert(ordini)
        .values({
          fornitore_id: data.fornitore_id,
          stato: data.stato || 'nuovo',
          note: data.note
        })
        .returning();

      // Aggiungi righe se fornite
      if (righe && righe.length > 0) {
        const righeConOrdineId = righe.map(riga => ({
          ordine_id: newOrdine.id,
          articolo_id: riga.articolo_id,
          qta_ordinata: riga.qta_ordinata,
          qta_ricevuta: riga.qta_ricevuta || 0,
          note: riga.note
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
      const [updatedOrdine] = await db
        .update(ordini)
        .set({
          ...data,
          updated_at: new Date()
        })
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

  async riceviOrdine(ordineId: string, righeRicezione: { rigaId: string; quantita_ricevuta: number }[]): Promise<OrdineCompleto> {
    try {
      // Verifica esistenza ordine
      const ordine = await this.getById(ordineId);
      
      // Aggiorna quantità ricevute per ogni riga
      for (const { rigaId, quantita_ricevuta } of righeRicezione) {
        // Aggiorna riga ordine
        await db
          .update(righeOrdine)
          .set({ 
            qta_ricevuta: quantita_ricevuta,
            updated_at: new Date()
          })
          .where(eq(righeOrdine.id, rigaId));

        // Trova l'articolo corrispondente e aggiorna le scorte
        const [riga] = await db
          .select({
            articolo_id: righeOrdine.articolo_id
          })
          .from(righeOrdine)
          .where(eq(righeOrdine.id, rigaId))
          .limit(1);

        if (riga) {
          // Incrementa quantità attuale dell'articolo
          await db
            .update(articoli)
            .set({
              quantita_attuale: sql`${articoli.quantita_attuale} + ${quantita_ricevuta}`,
              updated_at: new Date()
            })
            .where(eq(articoli.id, riga.articolo_id));
        }
      }

      // Verifica se tutte le righe sono state ricevute completamente
      const righeOrdineAggiornate = await this.getRigheByOrdineId(ordineId);
      const tutteRicevute = righeOrdineAggiornate.every(riga => 
        Number(riga.qta_ricevuta) >= Number(riga.qta_ordinata)
      );

      // Aggiorna stato ordine se completamente ricevuto
      if (tutteRicevute) {
        await db
          .update(ordini)
          .set({ 
            stato: 'archiviato',
            updated_at: new Date()
          })
          .where(eq(ordini.id, ordineId));
      }

      return this.getById(ordineId);
    } catch (error) {
      throw new DatabaseError('Errore ricezione ordine', error as Error);
    }
  }

  async generaOrdiniAutomatici(): Promise<OrdineCompleto[]> {
    try {
      // Trova articoli sotto soglia minima raggruppati per fornitore
      const articoliScarsi = await db
        .select({
          id: articoli.id,
          nome: articoli.nome,
          quantita_attuale: articoli.quantita_attuale,
          soglia_minima: articoli.soglia_minima,
          fornitore_id: articoli.fornitore_id,
          fornitore_nome: fornitori.nome,
          fornitore_whatsapp: fornitori.whatsapp
        })
        .from(articoli)
        .innerJoin(fornitori, eq(articoli.fornitore_id, fornitori.id))
        .where(lt(articoli.quantita_attuale, articoli.soglia_minima));

      if (articoliScarsi.length === 0) {
        return [];
      }

      // Raggruppa per fornitore
      const articoliPerFornitore = articoliScarsi.reduce((acc, articolo) => {
        if (!acc[articolo.fornitore_id]) {
          acc[articolo.fornitore_id] = {
            fornitore: {
              id: articolo.fornitore_id,
              nome: articolo.fornitore_nome,
              whatsapp: articolo.fornitore_whatsapp
            },
            articoli: []
          };
        }
        acc[articolo.fornitore_id].articoli.push(articolo);
        return acc;
      }, {} as Record<string, any>);

      const ordiniCreati: OrdineCompleto[] = [];

      // Crea un ordine per ogni fornitore
      for (const fornitoreId in articoliPerFornitore) {
        const { fornitore, articoli: articoliFornitore } = articoliPerFornitore[fornitoreId];
        
        // Crea ordine
        const nuovoOrdine = await this.create({
          fornitore_id: fornitoreId,
          stato: 'nuovo',
          note: `Ordine automatico generato per ${articoliFornitore.length} articoli sotto soglia`
        });

        // Crea righe ordine
        for (const articolo of articoliFornitore) {
          const quantitaDaOrdinare = Math.max(1, 
            Number(articolo.soglia_minima) - Number(articolo.quantita_attuale)
          );

          await db.insert(righeOrdine).values({
            ordine_id: nuovoOrdine.id,
            articolo_id: articolo.id,
            qta_ordinata: quantitaDaOrdinare,
            qta_ricevuta: 0,
            note: `Riordino automatico - scorta attuale: ${articolo.quantita_attuale}`
          });
        }

        // Ricarica ordine completo con righe
        const ordineCompleto = await this.getById(nuovoOrdine.id);
        ordiniCreati.push(ordineCompleto);
      }

      return ordiniCreati;
    } catch (error) {
      throw new DatabaseError('Errore generazione ordini automatici', error as Error);
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
