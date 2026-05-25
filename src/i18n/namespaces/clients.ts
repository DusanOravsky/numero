import type { Language } from '../../store/useStore';

export type ClientsKey =
  | 'clients.title' | 'clients.subtitle' | 'clients.searchPlaceholder'
  | 'clients.noClients' | 'clients.addFirst' | 'clients.newClient'
  | 'clients.history' | 'clients.deleteAll' | 'clients.foundOf'
  | 'clients.notesLabel' | 'clients.parent' | 'clients.child'
  | 'clients.partner' | 'clients.partnerCompat'
  | 'clients.birthDate' | 'clients.time' | 'clients.added' | 'clients.readingCount'
  | 'clients.deleteClient' | 'clients.deleteClientConfirm'
  | 'clients.deleteReading' | 'clients.deleteReadingsConfirm'
  | 'clients.deleteSelected' | 'clients.cancelSelection'
  | 'clients.selectAll' | 'clients.bulkMode' | 'clients.compare'
  | 'clients.addTag' | 'clients.tagFilter' | 'clients.allClients'
  | 'clients.noMatch' | 'clients.clearFilter'
  | 'clients.editClient' | 'clients.saveChanges' | 'clients.cancelEdit'
  | 'clients.namePlaceholder' | 'clients.notesPlaceholder' | 'clients.tagsLabel'
  | 'clients.tagsPlaceholder' | 'clients.existingTags' | 'clients.readings'
  | 'clients.exportJson' | 'clients.importClient'
  | 'clients.importInvalidFile' | 'clients.importInvalidName'
  | 'clients.importInvalidDate' | 'clients.importInvalidHour' | 'clients.importInvalidMinute'
  | 'clients.importSuccess' | 'clients.importJsonError'
  | 'clients.deleteSelectedConfirm'
  | 'clients.backToClient' | 'clients.notFound' | 'clients.backToClients'
  | 'clients.consultTips' | 'clients.coreIdentity' | 'clients.howDecides'
  | 'clients.currentEnergy' | 'clients.visits' | 'clients.recordVisit'
  | 'clients.visitAlreadyRecorded'
  | 'clients.timeline' | 'clients.completeReading' | 'clients.readingFor'
  | 'clients.compareTitle' | 'clients.compareSubtitle';

type Dict = Record<ClientsKey, string>;

const sk: Dict = {
  'clients.title': 'Klienti',
  'clients.subtitle': 'Správa klientov a ich výkladov',
  'clients.searchPlaceholder': 'Hľadať podľa mena, dátumu, ŽČ, miesta alebo poznámok…',
  'clients.noClients': 'Zatiaľ nemáte žiadnych klientov',
  'clients.addFirst': 'Pridať prvého klienta',
  'clients.newClient': '+ Nový klient',
  'clients.history': 'História výkladov',
  'clients.deleteAll': 'Vymazať všetky',
  'clients.foundOf': 'Nájdených',
  'clients.notesLabel': 'Poznámky',
  'clients.parent': 'Rodič',
  'clients.child': 'Dieťa',
  'clients.partner': 'Partner',
  'clients.partnerCompat': 'Kompatibilita s partnerom',
  'clients.birthDate': 'Dátum narodenia',
  'clients.time': 'Čas',
  'clients.added': 'Pridaný',
  'clients.readingCount': 'Počet výkladov',
  'clients.deleteClient': 'Vymazať klienta',
  'clients.deleteClientConfirm': 'Naozaj vymazať klienta a všetky jeho výklady?',
  'clients.deleteReading': 'Vymazať výklad',
  'clients.deleteReadingsConfirm': 'Vymazať všetky výklady klienta?',
  'clients.deleteSelected': 'Vymazať vybrané',
  'clients.cancelSelection': '✕ Zrušiť výber',
  'clients.selectAll': 'Vybrať všetkých',
  'clients.bulkMode': '☑ Hromadne',
  'clients.compare': '⇄ Porovnať',
  'clients.addTag': '+ Pridať tag',
  'clients.tagFilter': 'Filter podľa tagu:',
  'clients.allClients': 'Všetci',
  'clients.noMatch': 'Žiadny klient nezodpovedá filtrom.',
  'clients.clearFilter': 'Vyčistiť tag filter',
  'clients.editClient': 'Upraviť',
  'clients.saveChanges': 'Uložiť zmeny',
  'clients.cancelEdit': 'Zrušiť úpravy',
  'clients.namePlaceholder': 'Meno a priezvisko',
  'clients.notesPlaceholder': 'Voliteľné poznámky o klientovi...',
  'clients.tagsLabel': 'Tagy (oddelené čiarkou)',
  'clients.tagsPlaceholder': 'napr. rodina, VIP, dieťa',
  'clients.existingTags': 'Existujúce:',
  'clients.readings': 'výkladov',
  'clients.exportJson': '↓ Export JSON',
  'clients.importClient': '↑ Import',
  'clients.importInvalidFile': 'Neplatný súbor – chýbajú údaje klienta.',
  'clients.importInvalidName': 'Neplatné meno klienta.',
  'clients.importInvalidDate': 'Neplatný dátum narodenia.',
  'clients.importInvalidHour': 'Neplatná hodina narodenia.',
  'clients.importInvalidMinute': 'Neplatná minúta narodenia.',
  'clients.importSuccess': 'bol importovaný.',
  'clients.importJsonError': 'Chyba pri čítaní súboru – nie je platný JSON.',
  'clients.deleteSelectedConfirm': 'Vymazať vybraných klientov?',
  'clients.backToClient': '← Späť na klienta',
  'clients.notFound': 'Klient nebol nájdený',
  'clients.backToClients': '← Klienti',
  'clients.consultTips': '3 veci na konzultáciu',
  'clients.coreIdentity': 'Kto je v jadre',
  'clients.howDecides': 'Ako rozhoduje',
  'clients.currentEnergy': 'Aktuálna energia',
  'clients.visits': 'Návštevy klienta',
  'clients.recordVisit': '+ Zaznamenať dnešnú návštevu',
  'clients.visitAlreadyRecorded': 'Návšteva pre tento deň je už zaznamenaná.',
  'clients.timeline': 'Časová os',
  'clients.completeReading': 'Kompletný výklad',
  'clients.readingFor': 'Výklad pre',
  'clients.compareTitle': 'Porovnanie klientov',
  'clients.compareSubtitle': 'Vyber 2–{max} klientov a porovnaj kľúčové numerologické, astrologické a HD údaje vedľa seba.',
};

const en: Dict = {
  'clients.title': 'Clients',
  'clients.subtitle': 'Client management and their readings',
  'clients.searchPlaceholder': 'Search by name, date, life path, place or notes…',
  'clients.noClients': 'No clients yet',
  'clients.addFirst': 'Add first client',
  'clients.newClient': '+ New client',
  'clients.history': 'Reading history',
  'clients.deleteAll': 'Delete all',
  'clients.foundOf': 'Found',
  'clients.notesLabel': 'Notes',
  'clients.parent': 'Parent',
  'clients.child': 'Child',
  'clients.partner': 'Partner',
  'clients.partnerCompat': 'Partner compatibility',
  'clients.birthDate': 'Birth date',
  'clients.time': 'Time',
  'clients.added': 'Added',
  'clients.readingCount': 'Number of readings',
  'clients.deleteClient': 'Delete client',
  'clients.deleteClientConfirm': 'Delete this client and all their readings?',
  'clients.deleteReading': 'Delete reading',
  'clients.deleteReadingsConfirm': 'Delete all client readings?',
  'clients.deleteSelected': 'Delete selected',
  'clients.cancelSelection': '✕ Cancel selection',
  'clients.selectAll': 'Select all',
  'clients.bulkMode': '☑ Bulk mode',
  'clients.compare': '⇄ Compare',
  'clients.addTag': '+ Add tag',
  'clients.tagFilter': 'Filter by tag:',
  'clients.allClients': 'All',
  'clients.noMatch': 'No clients match the current filters.',
  'clients.clearFilter': 'Clear tag filter',
  'clients.editClient': 'Edit',
  'clients.saveChanges': 'Save changes',
  'clients.cancelEdit': 'Cancel editing',
  'clients.namePlaceholder': 'Full name',
  'clients.notesPlaceholder': 'Optional notes about the client...',
  'clients.tagsLabel': 'Tags (comma-separated)',
  'clients.tagsPlaceholder': 'e.g. family, VIP, child',
  'clients.existingTags': 'Existing:',
  'clients.readings': 'readings',
  'clients.exportJson': '↓ Export JSON',
  'clients.importClient': '↑ Import',
  'clients.importInvalidFile': 'Invalid file — client data missing.',
  'clients.importInvalidName': 'Invalid client name.',
  'clients.importInvalidDate': 'Invalid birth date.',
  'clients.importInvalidHour': 'Invalid birth hour.',
  'clients.importInvalidMinute': 'Invalid birth minute.',
  'clients.importSuccess': 'was imported.',
  'clients.importJsonError': 'Error reading file — not valid JSON.',
  'clients.deleteSelectedConfirm': 'Delete selected clients?',
  'clients.backToClient': '← Back to client',
  'clients.notFound': 'Client not found',
  'clients.backToClients': '← Clients',
  'clients.consultTips': '3 things for consultation',
  'clients.coreIdentity': 'Core identity',
  'clients.howDecides': 'How they decide',
  'clients.currentEnergy': 'Current energy',
  'clients.visits': 'Client visits',
  'clients.recordVisit': '+ Record today\'s visit',
  'clients.visitAlreadyRecorded': 'A visit for today has already been recorded.',
  'clients.timeline': 'Timeline',
  'clients.completeReading': 'Complete reading',
  'clients.readingFor': 'Reading for',
  'clients.compareTitle': 'Client comparison',
  'clients.compareSubtitle': 'Select 2–{max} clients and compare key numerological, astrological and HD data side by side.',
};

export const clientsDictionaries: Record<Language, Dict> = { sk, en };
