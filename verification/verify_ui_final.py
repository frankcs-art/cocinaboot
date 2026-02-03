from playwright.sync_api import sync_playwright
import time
import os

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 800})

        print("Navigating to http://localhost:3000...")
        try:
            page.goto("http://localhost:3000", timeout=60000)
            print("Page loaded. Waiting for content...")

            # Wait for either main or the login button
            try:
                page.wait_for_selector("main", timeout=5000)
            except:
                print("Main not found, checking for login button...")
                login_button = page.get_by_role("button", name="Continuar con Google")
                if login_button.is_visible():
                    print("Clicking login button...")
                    login_button.click()

            # Wait for main container
            page.wait_for_selector("main", timeout=30000)
            time.sleep(10) # extra wait for vite

            # 1. Dashboard
            page.screenshot(path="verification/01_dashboard.png")
            print("Captured 01_dashboard.png")

            # 2. Inventory
            page.get_by_role("button", name="Inventario").click()
            time.sleep(3)
            page.screenshot(path="verification/02_inventory.png")
            print("Captured 02_inventory.png")

            # 3. Usage
            page.get_by_role("button", name="Consumo Diario").click()
            time.sleep(3)
            page.screenshot(path="verification/03_usage.png")
            print("Captured 03_usage.png")

            # 4. Chat
            page.get_by_role("button", name="Asistente IA").click()
            time.sleep(3)
            page.fill("input[placeholder='Escribe un mensaje...']", "Jules, muestra el protocolo de comunicación")
            page.keyboard.press("Enter")
            time.sleep(15) # Wait for AI response
            page.screenshot(path="verification/04_chat.png")
            print("Captured 04_chat.png")

        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="verification/error_state.png")

        browser.close()

if __name__ == "__main__":
    if not os.path.exists("verification"):
        os.makedirs("verification")
    run_verification()
