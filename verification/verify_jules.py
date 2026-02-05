import time
from playwright.sync_api import sync_playwright, expect

def verify_jules():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Wait for dev server to be ready
        max_retries = 10
        for i in range(max_retries):
            try:
                page.goto("http://localhost:3000")
                break
            except:
                time.sleep(2)

        # Handle login if necessary
        try:
            page.wait_for_selector("main", timeout=5000)
        except:
            login_button = page.get_by_role("button", name="Continuar con Google")
            if login_button.is_visible():
                login_button.click()
                page.wait_for_selector("main", timeout=10000)

        # 1. Dashboard & High Demand Toggle
        page.screenshot(path="verification/01_dashboard.png")

        # 2. Inventory Traffic Lights
        page.get_by_role("button", name="Inventario").click()
        page.wait_for_selector("table")
        page.screenshot(path="verification/02_inventory.png")

        # 3. Usage Dual Registration
        page.get_by_role("button", name="Consumo Diario").click()
        page.wait_for_selector("select")
        page.screenshot(path="verification/03_usage.png")

        # 4. Chat Jules Protocol
        page.get_by_role("button", name="Asistente IA").click()
        page.wait_for_selector("input[placeholder='Consulta...']")
        chat_input = page.get_by_placeholder("Consulta...")
        chat_input.fill("Jules, dame el estado del Jamón Ibérico")
        chat_input.press("Enter")
        time.sleep(5) # Wait for AI response
        page.screenshot(path="verification/04_chat.png")

        browser.close()

if __name__ == "__main__":
    verify_jules()
