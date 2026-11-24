import { type Locator, type Page, expect } from '@playwright/test';

// The "Find a reservation" panel (root: <aside id="findDrawer" role="dialog">): a search field and the list of the
// reservations kept in this browser (newest first), filtered by the search.
export class FindReservationDrawer {
  readonly title: Locator;
  readonly closeButton: Locator;
  readonly queryField: Locator;
  readonly searchButton: Locator;
  readonly showAllButton: Locator;
  /** "All reservations", "All reservations (N)" or "M of N reservations match …". */
  readonly reservationsTitle: Locator;
  /** The status line: "No reservations yet." or "No reservation matches …". */
  readonly message: Locator;
  readonly reservationRows: Locator;
  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator("//*[@id='findDrawer']");
    this.title = this.root.locator("//*[@id='findTitle']");
    this.closeButton = this.root.locator("//*[@id='closeFind']");
    this.queryField = this.root.locator("//*[@id='findQuery']");
    this.searchButton = this.root.locator("//*[@id='findSubmit']");
    this.showAllButton = this.root.locator("//*[@id='findClear']");
    this.reservationsTitle = this.root.locator("//*[@id='reservationsTitle']");
    this.message = this.root.locator("//*[@id='findMsg']");
    this.reservationRows = this.root.getByTestId('reservation-row'); // a list: one row per listed reservation
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
}
