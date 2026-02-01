from playwright.sync_api import Page, expect, sync_playwright
import time

def test_jules_dashboard(page: Page):
    page.goto("http://localhost:3000")

    # Wait for the dashboard to load
    expect(page.get_by_text("Jules - IA Logística")).to_be_visible(timeout=10000)

    # Capture Dashboard
    page.screenshot(path="verification/dashboard_verified.png")

    # Go to Inventory
    page.get_by_role("button", name="Inventario").click()
    expect(page.get_by_text("Logística de Suministros")).to_be_visible()

    # Capture Inventory with Traffic Lights
    page.screenshot(path="verification/inventory_verified.png")

    # Go to Usage
    page.get_by_role("button", name="Consumo Diario").click()
    expect(page.get_by_text("Historial de Flujos")).to_be_visible()

    # Capture Usage
    page.screenshot(path="verification/usage_verified.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_jules_dashboard(page)
        finally:
            browser.close()
