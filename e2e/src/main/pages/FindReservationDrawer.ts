import { type Locator, type Page, expect } from '@playwright/test';

// The "Find a reservation" panel (root: <aside id="findDrawer" role="dialog">): a search field and the list of the
// reservations kept in this browser (newest first), filtered by the search.
export class FindReservationDrawer {
  readonly title: Locator;
  readonly closeButton: Locator;
  readonly queryField: Locator;
  readonly searchButton: Locator;
  /** "Clear search": shown only while a search term is applied. */
  readonly clearSearchButton: Locator;
  /** "All reservations", "All reservations (N)" or "M of N reservations match …". */
  readonly reservationsTitle: Locator;
  /** The status line: "No reservations yet." or "No reservation matches …". */
  readonly message: Locator;
  readonly reservationRows: Locator;
  /** The table of the listed reservations: not rendered when nothing is listed. */
  readonly reservationsTable: Locator;
  /** The Company cell of every listed row, in the order shown (newest first). */
  readonly rowCompanies: Locator;
  /** The panel itself (<aside id="findDrawer">): aria-hidden "true" while it is closed. */
  readonly panel: Locator;
  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator("//*[@id='findDrawer']");
    this.panel = this.root;
    this.title = this.root.locator("//*[@id='findTitle']");
    this.closeButton = this.root.locator("//*[@id='closeFind']");
    this.queryField = this.root.locator("//*[@id='findQuery']");
    this.searchButton = this.root.locator("//*[@id='findSubmit']");
    this.clearSearchButton = this.root.locator("//*[@id='findReset']");
    this.reservationsTitle = this.root.locator("//*[@id='reservationsTitle']");
    this.message = this.root.locator("//*[@id='findMsg']");
    this.reservationRows = this.root.getByTestId('reservation-row'); // a list: one row per listed reservation
    this.reservationsTable = this.root.getByTestId('reservations-table');
    this.rowCompanies = this.reservationRows.getByTestId('reservation-company'); // a list: one cell per listed row
  }

  /** The panel is open: its heading is exposed (a closed panel is aria-hidden). */
  async expectLoaded(): Promise<void> {
    await expect(this.root.getByRole('heading', { name: 'Find a reservation', exact: true })).toBeVisible();
  }

  /** Searches for what the field holds; an empty value leaves the field empty. */
  async search(query: string): Promise<void> {
    await this.queryField.fill(query);
    await this.searchButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  /** Types a value in the search field without searching. */
  async enterQuery(query: string): Promise<void> {
    await this.queryField.fill(query);
  }

  /** A button of the search form, by its visible name ("Search", "Clear search"). */
  button(name: string): Locator {
    return this.root.getByRole('button', { name, exact: true });
  }

  async clickButton(name: string): Promise<void> {
    await this.button(name).click();
  }

  /** The listed row of a reservation, by its company (the Company cell holds exactly that text). */
  rowOf(company: string): Locator {
    const exact = new RegExp(`^\\s*${company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
    return this.reservationRows.filter({
      has: this.root.page().getByTestId('reservation-company').filter({ hasText: exact }),
    });
  }

  /** A cell of a reservation's row, by the company and the cell's column ("code", "requester", "pieces", "amount"). */
  cellOf(company: string, column: 'date' | 'company' | 'code' | 'requester' | 'pieces' | 'amount'): Locator {
    return this.rowOf(company).getByTestId(`reservation-${column}`);
  }

  /** The tracking code a listed reservation shows (a random value the app gives every reservation). */
  async codeOf(company: string): Promise<string> {
    const cell = this.cellOf(company, 'code');
    await expect(cell, `no listed reservation is from "${company}"`).toHaveText(/\S/);
    return (await cell.innerText()).trim();
  }

  /** The Company cell of the first listed row: the list is newest first, so the order is what is checked. */
  firstRowCompany(): Locator {
    return this.rowCompanies.first(); // the order is part of the case: the newest reservation comes first
  }
}
